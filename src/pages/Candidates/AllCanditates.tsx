import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useInfiniteCandidates, useCandidateStats } from '@/hooks/useCanditates'
import { Search, Loader2, User, Phone, Calendar, Star, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import LoadingAnimation from '@/components/Animations/LoadingAnimation'
import { Link } from 'react-router-dom'
import type { CandidateFilters } from '@/types'

const STAGE_OPTIONS = [
  { value: '', label: 'All Stages' },
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'technical', label: 'Technical' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
]

function Candidates() {
  const { isDark } = useTheme()

  const [filters, setFilters] = useState<CandidateFilters>({
    stage: '',
    sort: 'appliedDate_desc',
    search: '',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const searchTimeoutRef = useRef<number | undefined>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useInfiniteCandidates(filters)

  const { data: stats } = useCandidateStats()

  // Debounced search - update filters when user stops typing
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }))
    }, 500)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Flatten all candidates from all pages
  const allCandidates = useMemo(() => {
    return data?.pages.flatMap(page => page.candidates) || []
  }, [data?.pages])

  const totalCount = data?.pages[0]?.totalCount || 0

  // Improved infinite scroll observer with proper cleanup
  const lastCandidateRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // Don't observe if loading or no more pages
      if (isFetchingNextPage || !hasNextPage) return

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage()
          }
        },
        { 
          threshold: 0.1,
          rootMargin: '100px' // Start loading before reaching the end
        }
      )

      // Observe the node
      if (node) {
        observerRef.current.observe(node)
      }
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const gradientText = isDark
    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
    : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

  if (isLoading && !allCandidates.length) return <LoadingAnimation />
  if (isError) return <div className="text-center text-red-500 mt-10">Error: {error?.message}</div>

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${isDark ? "dark bg-gray-900" : "bg-background"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${gradientText}`}
          >
            Candidates
          </motion.h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and track all candidate applications
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8 p-6 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white/80'
              }`}
          >
            {Object.entries(stats.byStage).map(([stage, count]) => (
              <div key={stage} className="text-center">
                <div className={`text-2xl font-bold ${gradientText}`}>{count}</div>
                <div className="text-sm capitalize text-gray-500 dark:text-gray-400">
                  {stage}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col sm:flex-row gap-4 mb-8 p-6 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white/80'
            }`}
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-400'
                }`}
            />
          </div>

          {/* Stage Filter */}
          <select
            value={filters.stage}
            onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
            className={`px-4 py-3 rounded-lg border transition-colors ${isDark
              ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400'
              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
              }`}
          >
            {STAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            className={`px-4 py-3 rounded-lg border transition-colors ${isDark
              ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400'
              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
              }`}
          >
            <option value="appliedDate_desc">Newest First</option>
            <option value="appliedDate_asc">Oldest First</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="rating_asc">Lowest Rated</option>
          </select>
        </motion.div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Showing {allCandidates.length} of {totalCount} candidates
          </p>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allCandidates.map((candidate, index) => {
            const isLastCandidate = index === allCandidates.length - 1
            
            return (
              <motion.div
                key={`${candidate.id}-${index}`}
                ref={isLastCandidate ? lastCandidateRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }} // Cap animation delay
                className={`rounded-2xl shadow-lg p-6 border transition-all ${isDark
                  ? 'bg-gray-800/60 border-gray-700 hover:border-cyan-400/50'
                  : 'bg-white border-gray-200 hover:border-purple-400/50'
                  }`}
              >
                {/* Candidate Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isDark ? 'bg-cyan-400/20' : 'bg-purple-100'}`}>
                      <User size={20} className={isDark ? 'text-cyan-400' : 'text-purple-600'} />
                    </div>
                    <div>
                      <Link 
                        to={`/candidate/${candidate.id}`} 
                        className={`font-semibold text-lg hover:underline ${gradientText}`}
                      >
                        {candidate.firstName} {candidate.lastName}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</p>
                    </div>
                  </div>
                  {candidate.rating && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-medium">{candidate.rating}</span>
                    </div>
                  )}
                </div>

                {/* Candidate Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Phone size={16} />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar size={16} />
                    <span>{new Date(candidate.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stage Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {candidate.stage}
                  </span>
                </div>

                {/* Tags */}
                {candidate.tags && candidate.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {candidate.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-2 py-1 text-xs rounded-full ${isDark
                          ? 'bg-cyan-400/20 text-cyan-300'
                          : 'bg-purple-100 text-purple-700'
                          }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {candidate.tags.length > 3 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-600'
                        }`}>
                        +{candidate.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Resume Download */}
                {candidate.resumeUrl && (
                  <button
                    onClick={() => window.open(candidate.resumeUrl, '_blank')}
                    className={`w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <Download size={16} />
                    Download Resume
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Loading Indicator - Always visible when fetching next page */}
        {isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8 py-8"
          >
            <div className={`flex items-center gap-3 px-6 py-3 rounded-lg ${isDark ? 'bg-gray-800/80' : 'bg-white/80'
              } shadow-lg`}>
              <Loader2 size={20} className={`animate-spin ${isDark ? 'text-cyan-400' : 'text-purple-600'}`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Loading more candidates...</span>
            </div>
          </motion.div>
        )}

        {/* End of list message */}
        {!hasNextPage && allCandidates.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 py-8"
          >
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              You've reached the end of the list
            </p>
          </motion.div>
        )}

        {/* No Candidates */}
        {allCandidates.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              👥
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No Candidates Found
            </h3>
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              {searchQuery || filters.stage
                ? 'Try adjusting your search or filters to see more results.'
                : 'No candidates have applied yet.'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Candidates