import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentService } from '@/services/assessmentService';
import type { Assessment, CandidateResponse } from '@/types';

export const useAssessments = (params?: { jobId?: string; page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ['assessments', params],
    queryFn: () => assessmentService.getAssessments(params),
  });
};

export const useAssessment = (id: string) => {
  return useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentService.getAssessment(id),
    enabled: !!id,
  });
};

export const useAssessmentByJobId = (jobId: string) => {
  return useQuery({
    queryKey: ['assessment', 'job', jobId],
    queryFn: () => assessmentService.getAssessmentByJobId(jobId),
    enabled: !!jobId,
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) =>
      assessmentService.createAssessment(assessment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, assessment }: { id: string; assessment: Partial<Assessment> }) =>
      assessmentService.updateAssessment(id, assessment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['assessment', variables.id] });
    },
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => assessmentService.deleteAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

export const useSubmitResponse = () => {
  return useMutation({
    mutationFn: ({ assessmentId, response }: { 
      assessmentId: string; 
      response: Omit<CandidateResponse, 'id' | 'submittedAt'> 
    }) => assessmentService.submitResponse(assessmentId, response),
  });
};

export const useAssessmentResponses = (assessmentId: string) => {
  return useQuery({
    queryKey: ['assessment-responses', assessmentId],
    queryFn: () => assessmentService.getAssessmentResponses(assessmentId),
    enabled: !!assessmentId,
  });
};

export const useCandidateResponse = (assessmentId: string, candidateId: string) => {
  return useQuery({
    queryKey: ['candidate-response', assessmentId, candidateId],
    queryFn: () => assessmentService.getCandidateResponse(assessmentId, candidateId),
    enabled: !!assessmentId && !!candidateId,
  });
};

export const useCandidateResponses = (candidateId: string) => {
  return useQuery({
    queryKey: ['candidate-responses', candidateId],
    queryFn: () => assessmentService.getCandidateResponses(candidateId),
    enabled: !!candidateId,
  });
};