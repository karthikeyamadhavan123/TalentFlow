import { motion } from 'framer-motion'
import { useJobs } from '@/hooks/useJobs'
import { useTheme } from '@/context/ThemeContext'
import { Search, Filter, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import LoadingAnimation from '@/components/Animations/LoadingAnimation'
import SearchModal from '@/components/SearchModal'
import FilterSidebar from '@/components/FilterSidebar'
import { useSearch } from '@/hooks/useSearch'
import type { JobProps } from '@/types'
import { useEffect, useState } from 'react'
import { jobService } from '@/services/jobService'
import JobForm from './JobForm'
import { JobsGrid } from './JobGrid'
import { arrayMove } from '@dnd-kit/sortable'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function JobBoard() {
  const queryClient = useQueryClient()

  const {
    isOpen: isSearchOpen,
    selectedJobId,
    selectedJob,
    isLoadingSelectedJob,
    setIsOpen: setSearchOpen,
    handleClose: closeSearch,
    handleJobSelect,
    clearSelectedJob
  } = useSearch()

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const { data: filterOptions } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => jobService.getFilterOptions(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const { data, loading, error, filters, updateFilters, goToPage, clearFilters } = useJobs()

  const { isDark } = useTheme()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editingJob, setEditingJob] = useState<JobProps | null>(null)
  const [jobsState, setJobsState] = useState<JobProps[]>([])

  // React Query mutation for creating/updating jobs
  const saveJobMutation = useMutation({
    mutationFn: (data: { jobData: any; mode: 'create' | 'edit'; jobId?: string }) => {
      if (data.mode === 'create') {
        return jobService.createJob(data.jobData)
      } else {
        return jobService.updateJob(data.jobId!, data.jobData)
      }
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['selectedJob'] })
      setIsFormOpen(false)
    },
    onError: (error) => {
      console.error('Failed to save job:', error)
    }
  })

  // React Query mutation for archiving jobs
  const archiveMutation = useMutation({
    mutationFn: (id: string) => jobService.archieveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      if (selectedJobId) {
        queryClient.invalidateQueries({ queryKey: ['selectedJob', selectedJobId] })
      }
    },
    onError: (error) => {
      console.error('Failed to archive job:', error)
    }
  })

  const reorderMutation = useMutation({
    mutationFn: ({ activeId, oldIndex, newIndex }: {
      activeId: string;
      oldIndex: number;
      newIndex: number
    }) => {
      // Convert array indices to order numbers (assuming order starts from 0)
      const fromOrder = oldIndex;
      const toOrder = newIndex;

      return jobService.reorderJob(activeId, { fromOrder, toOrder });
    },
    onSuccess: () => {
      // Invalidate and refetch jobs to get the updated order
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      console.error('Reorder failed:', error);
      // Revert optimistic update on error
      setJobsState(data.jobs);
    }
  });

  const handleReorder = async (activeId: string, oldIndex: number, newIndex: number) => {
    // Optimistic update - immediately update UI
    const reorderedJobs = arrayMove(jobsState, oldIndex, newIndex);
    setJobsState(reorderedJobs);

    try {
      // Permanent update - save to database
      await reorderMutation.mutateAsync({ activeId, oldIndex, newIndex });
    } catch (error) {
      console.error('Reorder failed:', error);
      // Revert on error
      setJobsState(data.jobs);
    }
  }

  useEffect(() => {
    if (data.jobs.length > 0) {
      setJobsState(data.jobs)
    }
  }, [data.jobs, filters.page])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [filters.page, filters.search, filters.status, filters.tags, filters.sort])

  const handleCreateJob = () => {
    setFormMode('create')
    setEditingJob(null)
    setIsFormOpen(true)
  }

  const handleEditJob = (job: JobProps) => {
    setFormMode('edit')
    setEditingJob(job)
    setIsFormOpen(true)
  }

  const handleSaveJob = async (jobData: any) => {
    saveJobMutation.mutate({
      jobData,
      mode: formMode,
      jobId: editingJob?.id
    })
  }

  const handleArchive = async (id: string) => {
    archiveMutation.mutate(id)
  }

  const handleClearAll = () => {
    clearSelectedJob()
    clearFilters()
  }

  const handleClearFilters = () => {
    clearFilters()
    if (selectedJobId) {
      clearSelectedJob()
    }
  }

  if (loading && !data.jobs.length) return <LoadingAnimation />
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error.message}</div>

  const gradientText = isDark
    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
    : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

  const displayJobs = selectedJob ? [selectedJob] : jobsState
  const hasActiveFilters = filters.search || filters.status || (filters.tags && filters.tags?.length > 0)

  return (
    <>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onJobSelect={handleJobSelect}
        isDark={isDark}
      />

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={handleClearFilters}
        isDark={isDark}
        filterOptions={filterOptions || { statuses: [], tags: [] }}
      />

      <div className={`min-h-screen w-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-full max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 relative">
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${gradientText} order-1 sm:order-0`}
            >
              Job Board
            </motion.h1>

            <div className="flex flex-wrap gap-2 sm:gap-3 order-2 sm:order-0 w-full sm:w-auto justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateJob}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all flex-1 sm:flex-none justify-center ${isDark
                  ? 'bg-cyan-500 text-white hover:bg-cyan-400'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
              >
                <Plus size={16} />
                <span className="hidden sm:inline">New Job</span>
                <span className="sm:hidden">New</span>
              </motion.button>

              <button
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all flex-1 sm:flex-none justify-center ${isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all flex-1 sm:flex-none justify-center ${isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded hidden sm:inline ${isDark ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                >
                  Ctrl+M
                </span>
              </button>
            </div>
          </div>

          {/* Selected Job Header */}
          {selectedJob && (
            <div className="text-center mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                {isLoadingSelectedJob ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading job details...</p>
                  </div>
                ) : (
                  <>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Showing: <span className="font-semibold">{selectedJob.title}</span>
                    </p>
                    <button
                      onClick={handleClearAll}
                      className={`flex items-center gap-1 text-sm ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
                        }`}
                    >
                      <X size={16} />
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Active Filters - Only show when not showing selected job */}
          {!selectedJob && hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center items-center">
              {filters.search && (
                <span className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-cyan-400/20 text-cyan-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                  Search: {filters.search}
                </span>
              )}
              {filters.status && (
                <span className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-cyan-400/20 text-cyan-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                  Status: {filters.status}
                </span>
              )}
              {filters.tags?.map(tag => (
                <span key={tag} className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-cyan-400/20 text-cyan-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                  Tag: {tag}
                </span>
              ))}

              {/* Clear Filters Button */}
              <button
                onClick={handleClearFilters}
                className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
                  }`}
              >
                <X size={14} />
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          {!selectedJob && (
            <div className="text-center mb-6">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Showing {jobsState.length} of {data.totalCount} jobs
                {data.totalPages > 1 && ` • Page ${data.currentPage} of ${data.totalPages}`}
              </p>
              {!selectedJob && (
                <p className="text-sm text-gray-500 mt-2">
                  💡 Drag and drop jobs to reorder them
                </p>
              )}
            </div>
          )}

          {/* Jobs Grid */}
          <JobsGrid
            jobs={displayJobs}
            isDark={isDark}
            gradientText={gradientText}
            handleEditJob={handleEditJob}
            handleArchive={handleArchive}
            selectedJob={selectedJob}
            onReorder={handleReorder}
            isLoading={isLoadingSelectedJob && !!selectedJob}
          />

          {/* Pagination - Only show when not showing selected job */}
          {!selectedJob && data.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8">
              <button
                onClick={() => {
                  goToPage(data.currentPage - 1)
                 }}
                disabled={!data.hasPrev}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium w-full sm:w-auto justify-center ${data.hasPrev
                    ? isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div
                className={`px-3 py-2 rounded text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
              >
                Page {data.currentPage} of {data.totalPages}
              </div>

              <button
                onClick={() => {
                  goToPage(data.currentPage + 1)
                }}
                disabled={!data.hasNext}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium w-full sm:w-auto justify-center ${data.hasNext
                    ? isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Next
                <ChevronRight size={16} />
              </button>

            </div>
          )}

          {/* No Jobs Message */}
          {displayJobs.length === 0 && (
            <div className="text-center mt-10">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No jobs found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>

      <JobForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveJob}
        isDark={isDark}
        job={editingJob}
        mode={formMode}
      />
    </>
  )
}

export default JobBoard