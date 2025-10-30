import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { candidateService } from '@/services/canditateService'
import type { CandidateFilters, CandidateProps } from '@/types'

export function useInfiniteCandidates(filters: CandidateFilters) {
  return useInfiniteQuery({
    queryKey: ['candidates', filters],
    queryFn: ({ pageParam = 1 }) => 
      candidateService.getCandidates({
        ...filters,
        page: pageParam,
        pageSize: 20, 
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined
      
      const currentPage = lastPage.currentPage
      const totalPages = lastPage.totalPages
      
      if (currentPage < totalPages) {
        return currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, 
  })
}

export function useCandidateStats(jobId?: string) {
  return useQuery({
    queryKey: ['candidateStats', jobId],
    queryFn: () => candidateService.getCandidateStats(jobId),
    staleTime: 2 * 60 * 1000, 
  })
}


export function useCandidate(id: string) {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidateService.getCandidateById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, 
  })
}

export function useUpdateCandidateStage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: 'applied' | 'screening' | 'interview' | 'technical' | 'offer' | 'hired' | 'rejected' }) =>
      candidateService.updateCandidateStage(id, stage),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      queryClient.invalidateQueries({ queryKey: ['candidateStats'] })
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] })
    },
  })
}



export function useUpdateCandidate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CandidateProps> }) =>
      candidateService.updateCandidate(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      queryClient.invalidateQueries({ queryKey: ['candidate', variables.id] })
    },
  })
}