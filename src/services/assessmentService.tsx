import type { Assessment, CandidateResponse } from '@/types';
import { simulateError } from '@/utils/helper';

const API_BASE = '/api';

export const assessmentService = {
  async getAssessments(params?: { jobId?: string; page?: number; pageSize?: number }) {
    if (simulateError(0.06)) {
          throw new Error('Failed to archive assessments - Server error (simulated)')
        }
    const searchParams = new URLSearchParams();
    if (params?.jobId) searchParams.append('jobId', params.jobId);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const response = await fetch(`${API_BASE}/assessments?${searchParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessments');
    }
    return response.json();
  },

  async getAssessment(id: string) {
    if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const response = await fetch(`${API_BASE}/assessments/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessment');
    }
    return response.json();
  },

  async getAssessmentByJobId(jobId: string) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const response = await fetch(`${API_BASE}/assessments/job/${jobId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessment for job');
    }
    return response.json();
  },

  async createAssessment(assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const response = await fetch(`${API_BASE}/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessment),
    });
    if (!response.ok) {
      throw new Error('Failed to create assessment');
    }
    return response.json();
  },

  async updateAssessment(id: string, assessment: Partial<Assessment>) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const response = await fetch(`${API_BASE}/assessments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessment),
    });
    if (!response.ok) {
      throw new Error('Failed to update assessment');
    }
    return response.json();
  },

  async deleteAssessment(id: string) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const response = await fetch(`${API_BASE}/assessments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete assessment');
    }
    return response.json();
  },

  async submitResponse(assessmentId: string, response: Omit<CandidateResponse, 'id' | 'submittedAt'>) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const apiResponse = await fetch(`${API_BASE}/assessments/${assessmentId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });
    if (!apiResponse.ok) {
      throw new Error('Failed to submit response');
    }
    return apiResponse.json();
  },

  async getAssessmentResponses(assessmentId: string) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const response = await fetch(`${API_BASE}/assessments/${assessmentId}/responses`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessment responses');
    }
    return response.json();
  },

  async getCandidateResponse(assessmentId: string, candidateId: string) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const response = await fetch(`${API_BASE}/assessments/${assessmentId}/responses/${candidateId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch candidate response');
    }
    return response.json();
  },

  async getCandidateResponses(candidateId: string) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const response = await fetch(`${API_BASE}/candidates/${candidateId}/responses`);
    if (!response.ok) {
      throw new Error('Failed to fetch candidate responses');
    }
    return response.json();
  },

  saveDraftAssessment(assessment: Assessment) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    localStorage.setItem(`assessment_draft_${assessment.id}`, JSON.stringify(assessment));
  },

  getDraftAssessment(id: string): Assessment | null {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const draft = localStorage.getItem(`assessment_draft_${id}`);
    return draft ? JSON.parse(draft) : null;
  },

  clearDraftAssessment(id: string) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    localStorage.removeItem(`assessment_draft_${id}`);
  },

  saveDraftResponse(assessmentId: string, candidateId: string, responses: any) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    localStorage.setItem(`response_draft_${assessmentId}_${candidateId}`, JSON.stringify(responses));
  },

  getDraftResponse(assessmentId: string, candidateId: string): any {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    const draft = localStorage.getItem(`response_draft_${assessmentId}_${candidateId}`);
    return draft ? JSON.parse(draft) : null;
  },

  clearDraftResponse(assessmentId: string, candidateId: string) {
     if (simulateError(0.06)) {
      throw new Error('Failed to archive assessments - Server error (simulated)')
    }
    localStorage.removeItem(`response_draft_${assessmentId}_${candidateId}`);
  },
};