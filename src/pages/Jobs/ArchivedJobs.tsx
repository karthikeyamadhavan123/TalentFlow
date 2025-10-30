// pages/ArchivedJobs.tsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { jobService } from '@/services/jobService'
import type { JobProps } from '@/types'
import { ArchiveRestore, ArrowLeft } from 'lucide-react'
import LoadingAnimation from '@/components/Animations/LoadingAnimation'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/pages/Jobs/components/AppSideBar'
import { Link } from 'react-router-dom'

function ArchivedJobs() {
    const { isDark } = useTheme()
    const [archivedJobs, setArchivedJobs] = useState<JobProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [unarchiving, setUnarchiving] = useState<string | null>(null)

    useEffect(() => {
        const fetchArchivedJobs = async () => {
            try {
                setLoading(true)
                // Fetch all jobs and filter archived ones
                const response = await jobService.getArchiveJob();
                setArchivedJobs(response)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load archived jobs')
            } finally {
                setLoading(false)
            }
        }

        fetchArchivedJobs()
    }, [])

    const handleUnarchive = async (jobId: string) => {
        try {
            setUnarchiving(jobId)
            await jobService.unarchiveJob(jobId)
            // Remove the job from the list after successful unarchive
            setArchivedJobs(prev => prev.filter(job => job.id !== jobId))
        } catch (err) {
            console.error('Failed to unarchive job:', err)
        } finally {
            setUnarchiving(null)
        }
    }

    const handleUnarchiveAll = async () => {
        try {
            setUnarchiving('all')
            // Unarchive all jobs sequentially
            for (const job of archivedJobs) {
                await jobService.unarchiveJob(job.id)
            }
            // Clear all archived jobs from the list
            setArchivedJobs([])
        } catch (err) {
            console.error('Failed to unarchive all jobs:', err)
        } finally {
            setUnarchiving(null)
        }
    }

    if (loading) return <LoadingAnimation />
    if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>

    const gradientText = isDark
        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
        : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

    return (
        <SidebarProvider>
            <div className={`min-h-screen flex w-full ${isDark ? "dark bg-gray-900" : "bg-background"}`}>
                {/* Sidebar */}
                <AppSidebar />
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Header with Sidebar Trigger and Back Button - Mobile */}
                    <div className=" p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <SidebarTrigger />
                          
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Header for Desktop */}
                            <div className="hidden lg:flex items-center justify-between mb-8">
                                <Link
                                    to="/jobs"
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isDark
                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    <ArrowLeft size={16} />
                                    Back to Jobs
                                </Link>
                            </div>

                            {/* Page Title */}
                            <div className="text-center mb-8">
                                <motion.h1
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${gradientText}`}
                                >
                                    Archived Jobs
                                </motion.h1>
                                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {archivedJobs.length} archived job{archivedJobs.length !== 1 ? 's' : ''} found
                                </p>
                            </div>

                            {/* Unarchive All Button */}
                            {archivedJobs.length > 0 && (
                                <div className="flex justify-center mb-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleUnarchiveAll}
                                        disabled={unarchiving === 'all'}
                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-lg transition-all bg-linear-to-r ${isDark ? 'from-cyan-400 to-blue-500' : 'from-purple-600 to-pink-600'} text-white hover:opacity-90 disabled:opacity-50`}
                                    >
                                        <ArchiveRestore size={20} />
                                        {unarchiving === 'all' ? 'Unarchiving All...' : `Unarchive All (${archivedJobs.length})`}
                                    </motion.button>

                                </div>
                            )}

                            {/* Archived Jobs Grid */}
                            {archivedJobs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {archivedJobs.map((job, index) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`rounded-2xl shadow-lg p-6 border ${isDark
                                                ? 'bg-gray-800/60 border-gray-700'
                                                : 'bg-white border-gray-200'
                                                }`}
                                        >
                                            {/* Job Header */}
                                            <div className="mb-4">
                                                <h3 className={`text-xl font-semibold mb-2 ${gradientText} wrap-break-word`}>
                                                    {job.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-1">
                                                    {job.department} • {job.location}
                                                </p>
                                                <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                    Status: {job.status}
                                                </p>
                                            </div>

                                            {/* Job Description */}
                                            {job.description && (
                                                <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {job.description}
                                                </p>
                                            )}

                                            {/* Tags */}
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
                                                        <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                                                            +{job.tags.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Archived Date */}
                                            <div className="mb-4">
                                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    Archived on: {new Date(job.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Unarchive Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleUnarchive(job.id)}
                                                disabled={unarchiving === 'all'}
                                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-lg transition-all bg-linear-to-r ${isDark ? 'from-cyan-400 to-blue-500' : 'from-purple-600 to-pink-600'} text-white hover:opacity-90 disabled:opacity-50`}
                                            >
                                                <ArchiveRestore size={20} />
                                                {unarchiving === 'all' ? 'Unarchiving All...' : `Unarchive `}
                                            </motion.button>

                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                /* Empty State */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                                        📁
                                    </div>
                                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        No Archived Jobs
                                    </h3>
                                    <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                                        All your jobs are currently active. Archived jobs will appear here.
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}
export default ArchivedJobs;