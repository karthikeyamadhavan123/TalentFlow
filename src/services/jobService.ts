// services/jobService.ts
import type { JobFilters, JobsResponse, CreateJobData, UpdateJobData } from '@/types'
import { simulateError } from '@/utils/helper'

export const jobService = {
  async getJobs(filters: JobFilters): Promise<JobsResponse> {
    const params = new URLSearchParams()

    // Only append filters that have values
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','))
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters.sort) params.append('sort', filters.sort)

    const res = await fetch(`/api/jobs?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch jobs')
    return res.json()
  },

  async getFilterOptions() {
    const res = await fetch('/api/jobs/filters/options') // Fixed endpoint
    if (!res.ok) throw new Error('Failed to load filter options')
    return res.json()
  },

  async getJobById(id: string) {
    const res = await fetch(`/api/jobs/${id}`)
    if (!res.ok) throw new Error('Failed to fetch job')
    return res.json()
  },

  async createJob(data: CreateJobData) {
    if (simulateError(0.08)) {
      throw new Error('Failed to create job - Server error (simulated)')
    }
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create job')
    return res.json()
  },

  async updateJob(id: string, data: UpdateJobData) {
    if (simulateError(0.07)) {
      throw new Error('Failed to update job - Server error (simulated)')
    }
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update job')
    return res.json()
  },

  async deleteJob(id: string) {
    // Simulate 10% error rate for delete (highest since it's destructive)
    if (simulateError(0.10)) {
      throw new Error('Failed to delete job - Server error (simulated)')
    }
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete job')
    return res.json()
  },

  async archieveJob(id: string) {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive job - Server error (simulated)')
    }
    const res = await fetch(`/api/jobs/${id}/archive`, { method: 'PATCH' })
    if (!res.ok) throw new Error('Failed to archieve job')
    return res.json()
  },


  async unarchiveJob(id: string) {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive job - Server error (simulated)')
    }
    const res = await fetch(`/api/jobs/${id}/unarchive`, { method: 'PATCH' })
    if (!res.ok) throw new Error('Failed to archieve job')
    return res.json()
  },
  async getArchiveJob() {
    const res = await fetch(`/api/jobs/archive`, { method: 'GET' })
    if (!res.ok) throw new Error('Failed to get archieved jobs')
    return res.json()
  },
  async reorderJob(jobId: string, reorderData: { fromOrder: number; toOrder: number }) {
    if (simulateError(0.05)) {
      throw new Error('Failed to reorder job - Server error (simulated)')
    }

    const res = await fetch(`/api/jobs/${jobId}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reorderData)
    })

    if (!res.ok) throw new Error('Failed to reorder job')
    return res.json()
  },
}