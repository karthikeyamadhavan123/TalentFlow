import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import type { FilterSidebarProps } from '@/types'

function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
  isDark,
  filterOptions
}: FilterSidebarProps) {
  const handleStatusChange = (status: string) => {
    onFiltersChange({ status: filters.status === status ? undefined : status })
  }

  const handleTagChange = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    onFiltersChange({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const handleSortChange = (sort: string) => {
    onFiltersChange({ sort })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed right-0 top-0 w-80 h-full p-6 shadow-xl z-50 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                <Filter size={20} />
                Filters
              </h2>
              <button
                onClick={onClose}
                className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
              >
                <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Sort By
              </label>
              <select
                value={filters.sort || 'order'}
                onChange={(e) => handleSortChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                  }`}
              >
                <option value="order">Order (Default)</option>
                <option value="title">Title (A-Z)</option>
                <option value="title_desc">Title (Z-A)</option>
                <option value="status">Status (A-Z)</option>
                <option value="status_desc">Status (Z-A)</option>
                <option value="createdAt">Created (Newest)</option>
                <option value="createdAt_desc">Created (Oldest)</option>
              </select>
            </div>
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Status
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={!filters.status}
                    onChange={() => onFiltersChange({ status: undefined })}
                    className={`focus:ring-2 ${isDark
                      ? 'text-cyan-400 focus:ring-cyan-400'
                      : 'text-purple-400 focus:ring-purple-400'
                      }`}
                  />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    All Statuses
                  </span>
                </label>
                {filterOptions.statuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={filters.status === status}
                      onChange={() => handleStatusChange(status)}
                      className={`focus:ring-2 ${isDark
                        ? 'text-cyan-400 focus:ring-cyan-400'
                        : 'text-purple-400 focus:ring-purple-400'
                        }`}
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Tags
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filterOptions.tags.length > 0 ? (
                  filterOptions.tags.map(tag => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.tags?.includes(tag) || false}
                        onChange={() => handleTagChange(tag)}
                        className={`rounded focus:ring-2 ${isDark
                          ? 'text-cyan-400 focus:ring-cyan-400 bg-gray-700 border-gray-600'
                          : 'text-purple-400 focus:ring-purple-400'
                          }`}
                      />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {tag}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No tags available
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                onFiltersChange({
                  status: undefined,
                  tags: undefined,
                  sort: 'order',
                  page: 1
                })
                onClearFilters()
                onClose()
                setTimeout(() => {
                  window.location.reload()
                }, 100)
              }}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
              Clear All Filters
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilterSidebar