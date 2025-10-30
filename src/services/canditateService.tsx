// services/candidateService.ts
import type {
  CandidateProps,
  CandidatesResponse,
  CandidateFilters,
  CandidateStats,
} from '@/types'
import { simulateError } from '@/utils/helper';

export const candidateService = {
  async getCandidates(
    filters: CandidateFilters & { page?: number; pageSize?: number }
  ): Promise<CandidatesResponse> {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive canditate - Server error (simulated)')
    }
    const queryParams = new URLSearchParams()

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            queryParams.set(key, value.join(','))
          }
        } else {
          queryParams.set(key, String(value))
        }
      }
    })

    // Add pagination
    if (filters.page) {
      queryParams.set('page', filters.page.toString())
    }
    if (filters.pageSize) {
      queryParams.set('pageSize', filters.pageSize.toString())
    }

    const response = await fetch(`/api/candidates?${queryParams}`)

    if (!response.ok) {
      throw new Error('Failed to fetch candidates')
    }

    return response.json()
  },

  async getCandidateById(id: string): Promise<CandidateProps> {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive job - Server error (simulated)')
    }
    const response = await fetch(`/api/candidates/${id}`)

    if (!response.ok) {
      throw new Error('Failed to fetch candidate')
    }

    return response.json()
  },

  async updateCandidateStage(id: string, stage: CandidateProps['stage']): Promise<CandidateProps> {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive canditate - Server error (simulated)')
    }
    const response = await fetch(`/api/candidates/${id}/stage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stage }),
    })

    if (!response.ok) {
      throw new Error('Failed to update candidate stage')
    }

    return response.json()
  },

  async getCandidateStats(jobId?: string): Promise<CandidateStats> {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive canditate - Server error (simulated)')
    }
    const queryParams = new URLSearchParams()
    if (jobId) {
      queryParams.set('jobId', jobId)
    }

    const response = await fetch(`/api/candidates/stats?${queryParams}`)

    if (!response.ok) {
      throw new Error('Failed to fetch candidate stats')
    }

    return response.json()
  },


  async updateCandidate(id: string, data: Partial<CandidateProps>): Promise<CandidateProps> {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive canditate - Server error (simulated)')
    }
    const response = await fetch(`/api/candidates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update candidate')
    }

    return response.json()
  },

  async deleteCandidate(id: string): Promise<void> {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive canditate - Server error (simulated)')
    }
    const response = await fetch(`/api/candidates/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete candidate')
    }
  }
}