
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { jobService } from '@/services/jobService'

export function useSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const { data: selectedJob, isLoading: isLoadingSelectedJob } = useQuery({
    queryKey: ['selectedJob', selectedJobId],
    queryFn: () => {
      if (!selectedJobId) return null
      return jobService.getJobById(selectedJobId)
    },
    enabled: !!selectedJobId,
    staleTime: 5 * 60 * 1000, 
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'm') {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId)
    // Update URL
    const params = new URLSearchParams(window.location.search)
    params.set('jobId', jobId)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const clearSelectedJob = () => {
    setSelectedJobId(null)

    const params = new URLSearchParams(window.location.search)
    params.delete('jobId')
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
  }

  return {
    isOpen,
    selectedJobId,
    selectedJob,
    isLoadingSelectedJob,
    setIsOpen,
    handleClose,
    handleJobSelect,
    clearSelectedJob
  }
}