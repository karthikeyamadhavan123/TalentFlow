// components/SearchModal.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, Briefcase, MapPin } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import type { JobProps, SearchModalProps } from '@/types'

function SearchModal({ 
  isOpen, 
  onClose, 
  onJobSelect,
  isDark 
}: SearchModalProps) {
  const [searchParam, setSearchParam] = useState('')
  const [searchResults, setSearchResults] = useState<JobProps[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      inputRef.current?.focus()
      // Clear previous search when opening
      setSearchParam('')
      setSearchResults([])
    }

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault()
    }

    if (isOpen) {
      document.addEventListener('wheel', preventScroll, { passive: false })
    }

    return () => document.removeEventListener('wheel', preventScroll)
  }, [isOpen])

  const handleSearchChange = async (value: string) => {
    setSearchParam(value)
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (value.trim()) {
      setIsSearching(true)
      timeoutRef.current = window.setTimeout(async () => {
        await performSearch(value.trim())
        setIsSearching(false)
      }, 300)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const performSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Search failed')
      const results: JobProps[] = await response.json()
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    }
  }

  const handleResultClick = (job: JobProps) => {
    onJobSelect(String(job.id))
    onClose()
  }

  const clearSearch = () => {
    setSearchParam('')
    setSearchResults([])
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        className={`w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
              size={20}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search jobs by title, company, location, skills..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 text-lg focus:outline-none focus:ring-2 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-purple-400 focus:ring-purple-400/20'
              }`}
              autoFocus
              value={searchParam}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchParam && (
              <button
                onClick={clearSearch}
                className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                  isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
              >
                <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            )}
            <button
              onClick={onClose}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
              }`}
            >
              <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className={`max-h-96 overflow-y-auto ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <AnimatePresence>
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
                    isDark ? 'border-cyan-400' : 'border-purple-500'
                  }`}></div>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    Searching...
                  </span>
                </div>
              </motion.div>
            ) : searchParam && searchResults.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {searchResults.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      isDark 
                        ? 'border-gray-700 hover:bg-gray-700/50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleResultClick(job)}
                  >
                    <div className="flex items-start gap-3">
                      <Briefcase className={`mt-1 shrink-0 ${
                        isDark ? 'text-cyan-400' : 'text-purple-500'
                      }`} size={18} />
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold truncate ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <MapPin size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {job.location}
                          </span>
                        </div>
                        {job.department && (
                          <p className={`text-xs mt-1 ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {job.department}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : searchParam && !isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <Clock className={`mx-auto mb-3 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} size={32} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  No jobs found for "<span className="font-semibold">{searchParam}</span>"
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <Search className={`mx-auto mb-3 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} size={32} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Start typing to search for jobs
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-xs ${
          isDark 
            ? 'border-gray-700 text-gray-400 bg-gray-900/50' 
            : 'border-gray-200 text-gray-500 bg-gray-50'
        }`}>
          <div className="flex justify-between items-center">
            <span>Press Esc to close</span>
            {searchParam && !isSearching && (
              <span>{searchResults.length} results found</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SearchModal