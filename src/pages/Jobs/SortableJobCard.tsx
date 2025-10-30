import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Archive, Edit3 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type {SortableJobCardProps } from '@/types'



export function SortableJobCard({
    job,
    isDark,
    gradientText,
    handleEditJob,
    handleArchive,
    selectedJob
}: SortableJobCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: job.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: selectedJob ? 1 : 1.03 }}
            className={`rounded-2xl shadow-lg p-4 sm:p-6 border transition-all cursor-grab active:cursor-grabbing ${isDark
                    ? 'bg-gray-800/60 border-gray-700 hover:border-cyan-400/50'
                    : 'bg-white/80 border-gray-200 hover:border-purple-400/50'
                } ${selectedJob ? 'mx-auto w-full max-w-md' : ''} ${isDragging ? 'opacity-50 shadow-2xl' : ''
                }`}
        >
            {/* Drag handle area - the entire card is draggable */}
            <div {...attributes} {...listeners}>
                <Link className={`text-lg sm:text-xl font-semibold mb-2 ${gradientText} block`} to={`/jobs/${job.id}`}>
                    {job.title}
                </Link>
                <p className="text-sm mb-1 text-gray-500">
                    {job.department} • {job.location}
                </p>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status: {job.status}
                </p>

                {job.description && (
                    <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {job.description}
                    </p>
                )}

                {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {job.tags.slice(0, 3).map((tag, tagIndex) => (
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
                        {job.tags.length > 3 && (
                            <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-600'
                                }`}>
                                +{job.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Buttons - not part of drag handle */}
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditJob(job)}
                    className={`text-white px-3 py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-sm font-medium flex-1 sm:flex-none justify-center ${isDark
                            ? 'bg-linear-to-r from-cyan-400 to-blue-500'
                            : 'bg-linear-to-r from-purple-600 to-pink-600'
                        }`}
                >
                    <Edit3 size={16} />
                    <span>Edit</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleArchive(job.id)}
                    className="bg-gray-500/10 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-sm font-medium flex-1 sm:flex-none justify-center"
                >
                    <Archive size={16} />
                    <span className="hidden sm:inline">Archive</span>
                </motion.button>
            </div>
        </motion.div>
    )
}