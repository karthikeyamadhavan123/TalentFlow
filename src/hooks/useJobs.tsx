import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { jobService } from '@/services/jobService'
import type { JobFilters } from '@/types'
import { useCallback, useEffect, useRef, useState } from 'react'

const JOBS_QUERY_KEY = 'jobs'

export function useJobs(initialFilters: JobFilters = {}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const isInitialMount = useRef(true)
  const isSyncingToUrl = useRef(false)

  // Keep filters in local state for instant updates
  const [localFilters, setLocalFilters] = useState<JobFilters>(() => {
    const paramsObj: Record<string, any> = {}
    for (const [key, value] of searchParams.entries()) {
      if (key === 'page' || key === 'pageSize') {
        paramsObj[key] = Number(value) || (key === 'page' ? 1 : 9)
      } else if (key === 'tags') {
        paramsObj[key] = value.split(',').filter(Boolean)
      } else {
        paramsObj[key] = value
      }
    }
    return {
      page: 1,
      pageSize: 9,
      sort: 'order',
      ...initialFilters,
      ...paramsObj
    }
  })

  // React Query for data fetching
  const {
    data = {
      jobs: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNext: false,
      hasPrev: false
    },
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: [JOBS_QUERY_KEY, localFilters],
    queryFn: () => jobService.getJobs(localFilters),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  // 🔄 Sync local filters to URL
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    isSyncingToUrl.current = true

    const params = new URLSearchParams()

    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 0) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','))
        } else {
          params.set(key, String(value))
        }
      }
    })

    setSearchParams(params, { replace: true })

    setTimeout(() => {
      isSyncingToUrl.current = false
    }, 50)
  }, [localFilters, setSearchParams])

  // 📦 Handle browser back/forward navigation ONLY
  useEffect(() => {
    if (isSyncingToUrl.current) {
      return
    }

    const newFilters: JobFilters = {
      page: 1,
      pageSize: 9,
      sort: 'order',
      ...initialFilters
    }

    for (const [key, value] of searchParams.entries()) {
      if (key === 'page' || key === 'pageSize') {
        newFilters[key] = Number(value) || (key === 'page' ? 1 : 9)
      } else if (key === 'tags') {
        newFilters[key] = value.split(',').filter(Boolean)
      } else {
        newFilters[key] = value
      }
    }

    // Only update if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(localFilters)) {
      setLocalFilters(newFilters)
    }
  }, [searchParams, initialFilters])

  // Prefetch next page for instant navigation
  const prefetchNextPage = useCallback((nextPage: number) => {
    const nextFilters = { ...localFilters, page: nextPage }
    queryClient.prefetchQuery({
      queryKey: [JOBS_QUERY_KEY, nextFilters],
      queryFn: () => jobService.getJobs(nextFilters),
      staleTime: 2 * 60 * 1000,
    })
  }, [localFilters, queryClient])

  const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
    setLocalFilters(prev => {
      const updated = {
        ...prev,
        ...newFilters,
        // Reset to page 1 for filter changes (not page changes)
        page: newFilters.page !== undefined ? newFilters.page :
          (newFilters.search !== undefined ||
            newFilters.status !== undefined ||
            newFilters.tags !== undefined ||
            newFilters.sort !== undefined) ? 1 : prev.page
      }
      return updated
    })

    // Prefetch next page when changing pages
    if (newFilters.page && newFilters.page > 1) {
      prefetchNextPage(newFilters.page + 1)
    }
  }, [prefetchNextPage])

 const goToPage = useCallback(async (page: number) => {
  // Update local filters
  setLocalFilters(prev => ({ ...prev, page }))

  // Force a refetch to always get latest data (especially when going back)
  await queryClient.invalidateQueries({ queryKey: [JOBS_QUERY_KEY] })

  // Prefetch nearby pages for smoother experience
  if (page > 1) {
    prefetchNextPage(page - 1)
  }
  prefetchNextPage(page + 1)
}, [prefetchNextPage, queryClient])


  const clearFilters = useCallback(async () => {
    const defaultFilters: JobFilters = {
      page: 1,
      pageSize: 9,
      sort: 'order',
      search: undefined,
      status: undefined,
      tags: undefined,
    }
    // ✅ Reset filters to defaults first
    setLocalFilters(defaultFilters)

    // ✅ Clear URL parameters by setting empty search params
    setSearchParams(new URLSearchParams(), { replace: true })

    // ✅ Clear all cached queries
    await queryClient.invalidateQueries({ queryKey: [JOBS_QUERY_KEY] })


    await queryRefetch()
  }, [queryClient, queryRefetch])

  // Manual refetch
  const manualRefetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [JOBS_QUERY_KEY] })
  }, [queryClient])

  return {
    data,
    loading: isLoading,
    error: error as Error | null,
    filters: localFilters,
    updateFilters,
    goToPage,
    clearFilters,
    refetch: manualRefetch
  }
}