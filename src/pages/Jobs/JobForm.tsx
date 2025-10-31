import { motion } from 'framer-motion'
import { X, Plus, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { JobFormProps } from '@/types'
import toast from 'react-hot-toast'


function JobForm({ isOpen, onClose, onSave, isDark, job, mode }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'active',
    description: '',
    department: '',
    location: '',
    order: 0,
  })
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form when opening or when job changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && job) {
        setFormData({
          title: job.title,
          slug: job.slug,
          status: job.status,
          description: job.description || '',
          department: job.department || '',
          location: job.location || '',
          order: job.order,
        })
        setTags(job.tags || [])
      } else {
        // Reset form for create mode
        setFormData({
          title: '',
          slug: '',
          status: 'active',
          description: '',
          department: '',
          location: '',
          order: 0,
        })
        setTags([])
      }
      setErrors({})
      setCurrentTag('')
    }
  }, [isOpen, job, mode])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }))

    // Auto-generate slug if in create mode and slug is empty or matches the generated one
    if (mode === 'create' && (!formData.slug || formData.slug === generateSlug(formData.title))) {
      setFormData(prev => ({ ...prev, slug: generateSlug(title) }))
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    if (!formData.status) {
      newErrors.status = 'Status is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const jobData = {
        ...formData,
        tags,
        description: formData.description || undefined,
        department: formData.department || undefined,
        location: formData.location || undefined,
      }

      await onSave(jobData)
      toast.success(`Job ${mode === 'create' ? 'created' : 'updated'} successfully`)
      onClose()
    } catch (error) {
      console.error('Failed to save job:', error)
      toast.error('Failed to save job. Please try again.')
      setErrors({ submit: 'Failed to save job. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'
          }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {mode === 'create' ? 'Create New Job' : 'Edit Job'}
            </h2>
            <button
              onClick={onClose}
              className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
            >
              <X size={24} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                } ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter job title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                } ${errors.slug ? 'border-red-500' : ''}`}
              placeholder="job-title-url"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
            )}
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
              URL-friendly identifier. Use lowercase letters, numbers, and hyphens.
            </p>
          </div>

          {/* Status */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                } ${errors.status ? 'border-red-500' : ''}`}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                }`}
              placeholder="Enter job description"
            />
          </div>

          {/* Department */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                }`}
              placeholder="e.g., Engineering, Marketing"
            />
          </div>

          {/* Location */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                }`}
              placeholder="e.g., Remote, New York"
            />
          </div>

          {/* Order */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDark
                ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                }`}
              placeholder="Display order (lower = higher)"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Lower numbers appear first. 0 = auto-assign.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400 focus:ring-purple-400/20'
                  }`}
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className={`px-4 py-2 rounded-lg font-medium ${isDark
                  ? 'bg-cyan-400 text-white hover:bg-cyan-500'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
              >
                <Plus size={16} />
              </button>
            </div>


            {/* Tags List */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDark
                    ? 'bg-cyan-400/20 text-cyan-300'
                    : 'bg-purple-100 text-purple-700'
                    }`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:opacity-70"
                  >
                    <Minus size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${isDark
                ? 'bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-400/50'
                : 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400'
                }`}
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Job' : 'Update Job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default JobForm