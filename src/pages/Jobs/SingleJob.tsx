import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { jobService } from '@/services/jobService'
import { assessmentService } from '@/services/assessmentService'
import type { JobProps } from '@/types'
import type { Assessment } from '@/types'
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Edit3, 
  Users,
  Calendar,
  BarChart3
} from 'lucide-react'
import LoadingAnimation from '@/components/Animations/LoadingAnimation'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/pages/Jobs/components/AppSideBar'

function JobDetail() {
    const { jobId } = useParams<{ jobId: string }>()
    const { isDark } = useTheme()
    const [job, setJob] = useState<JobProps | null>(null)
    const [assessment, setAssessment] = useState<Assessment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [assessmentLoading, setAssessmentLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!jobId) return

            try {
                setLoading(true)
                const jobData = await jobService.getJobById(jobId)
                setJob(jobData)
                
                // Fetch assessment for this job
                await fetchAssessment(jobId)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load job')
            } finally {
                setLoading(false)
            }
        }

        const fetchAssessment = async (jobId: string) => {
            try {
                setAssessmentLoading(true)
                const assessmentData = await assessmentService.getAssessmentByJobId(jobId)
                setAssessment(assessmentData)
            } catch (err) {
                // Assessment might not exist, which is fine
                setAssessment(null)
            } finally {
                setAssessmentLoading(false)
            }
        }

        fetchData()
    }, [jobId])

    const handleCreateAssessment = async () => {
        if (!job) return

        try {
            const newAssessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'> = {
                jobId: job.id,
                title: `${job.title} - Skills Assessment`,
                description: `Technical assessment for ${job.title} position in ${job.department}`,
                sections: [
                    {
                        id: `section-${Date.now()}`,
                        title: 'Technical Skills',
                        description: 'Evaluate candidate technical capabilities',
                        questions: []
                    }
                ]
            }

            const createdAssessment = await assessmentService.createAssessment(newAssessment)
            setAssessment(createdAssessment)
        } catch (err) {
            console.error('Failed to create assessment:', err)
            setError('Failed to create assessment')
        }
    }

    const handleDeleteAssessment = async () => {
        if (!assessment) return

        try {
            await assessmentService.deleteAssessment(assessment.id)
            setAssessment(null)
        } catch (err) {
            console.error('Failed to delete assessment:', err)
            setError('Failed to delete assessment')
        }
    }

    if (loading) return <LoadingAnimation />
    if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>
    if (!job) return <div className="text-center mt-10">Job not found</div>

    const gradientText = isDark
        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
        : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

    const totalQuestions = assessment?.sections?.reduce((acc, section) => 
        acc + (section.questions?.length || 0), 0
    ) || 0

    return (
        <SidebarProvider>
            <div className={`min-h-screen flex w-full ${isDark ? "dark bg-gray-900" : "bg-background"}`}>
                {/* Sidebar */}
                <AppSidebar />
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Header with Sidebar Trigger and Back Button - Mobile */}
                    <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <SidebarTrigger className={`font-semibold ${gradientText}`} />
                            <Link
                                to="/jobs"
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    isDark
                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                <ArrowLeft size={16} />
                                Back
                            </Link>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Header for Desktop */}
                            <div className="hidden lg:flex items-center justify-between mb-6">
                                <Link
                                    to="/jobs"
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                        isDark
                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    <ArrowLeft size={16} />
                                    Back to Jobs
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Job Details */}
                                <div className="lg:col-span-2">
                                    {/* Job Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`rounded-2xl shadow-lg p-6 lg:p-8 border mb-6 ${
                                            isDark
                                                ? 'bg-gray-800/60 border-gray-700'
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        {/* Job Title */}
                                        <div className="mb-8">
                                            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${gradientText} wrap-break-word mb-2`}>
                                                {job.title}
                                            </h1>
                                            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {job.department} • {job.location}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                            {/* Job Details */}
                                            <div>
                                                <h3 className={`text-xl font-semibold mb-6 ${gradientText}`}>
                                                    Job Details
                                                </h3>
                                                
                                                <div className="space-y-4">
                                                    <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Department</p>
                                                        <p className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                                            {job.department}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</p>
                                                        <p className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                                            {job.location}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                                        <p className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                                            {job.status}
                                                        </p>
                                                    </div>
                                                    
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order</p>
                                                        <p className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                                            {job.order}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description & Tags */}
                                            <div>
                                                <div className="mb-8">
                                                    <h3 className={`text-xl font-semibold mb-4 ${gradientText}`}>
                                                        Job Description
                                                    </h3>
                                                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                                        <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {job.description || 'No description provided.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {job.tags && job.tags.length > 0 && (
                                                    <div>
                                                        <h3 className={`text-xl font-semibold mb-4 ${gradientText}`}>
                                                            Skills & Tags
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.tags.map((tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                                                                        isDark
                                                                            ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                                                                            : 'bg-purple-100 text-purple-700 border border-purple-200'
                                                                    }`}
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right Column - Assessment Section */}
                                <div className="lg:col-span-1">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className={`rounded-2xl shadow-lg p-6 border ${
                                            isDark
                                                ? 'bg-gray-800/60 border-gray-700'
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <FileText className={gradientText} size={24} />
                                            <h2 className={`text-2xl font-bold ${gradientText}`}>
                                                Assessment
                                            </h2>
                                        </div>

                                        {assessmentLoading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : assessment ? (
                                            <div className="space-y-6">
                                                {/* Assessment Info */}
                                                <div className={`p-4 rounded-lg ${
                                                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                                                }`}>
                                                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                                                        {assessment.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                        {assessment.description}
                                                    </p>
                                                    
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <BarChart3 size={16} />
                                                            <span>{totalQuestions} questions</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <Calendar size={16} />
                                                            <span>Created {new Date(assessment.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <Users size={16} />
                                                            <span>{assessment.sections?.length || 0} sections</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Assessment Actions */}
                                                <div className="space-y-3">
                                                    <Link
                                                        to={`/assessment/builder/${assessment.id}`}
                                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                                                            isDark
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                                        }`}
                                                    >
                                                        <Edit3 size={18} />
                                                        Edit Assessment
                                                    </Link>
                                                    
                                                    
                                                    <Link
                                                        to={`/assessment/responses/${assessment.id}`}
                                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all border ${
                                                            isDark
                                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <Users size={18} />
                                                        View Responses
                                                    </Link>

                                                    <button
                                                        onClick={handleDeleteAssessment}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                    >
                                                        Delete Assessment
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-6">
                                                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    No Assessment Created
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                    Create an assessment to evaluate candidates for this position.
                                                </p>
                                                <button
                                                    onClick={handleCreateAssessment}
                                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                                                        isDark
                                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                                            : 'bg-green-500 text-white hover:bg-green-600'
                                                    }`}
                                                >
                                                    <Plus size={18} />
                                                    Create Assessment
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Quick Actions */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className={`rounded-2xl shadow-lg p-6 border mt-6 ${
                                            isDark
                                                ? 'bg-gray-800/60 border-gray-700'
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <h3 className={`text-xl font-semibold mb-4 ${gradientText}`}>
                                            Quick Actions
                                        </h3>
                                        <div className="space-y-3">
                                            <Link
                                                to={`/candidates?jobId=${job.id}`}
                                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                                    isDark
                                                        ? 'bg-gray-700 hover:bg-gray-600'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                <Users size={20} />
                                                <span>View Candidates</span>
                                            </Link>
                                            
                                            <Link
                                                to={`/jobs/edit/${job.id}`}
                                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                                    isDark
                                                        ? 'bg-gray-700 hover:bg-gray-600'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                <Edit3 size={20} />
                                                <span>Edit Job</span>
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default JobDetail