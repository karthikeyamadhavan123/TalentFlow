import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { assessmentService } from '@/services/assessmentService'
import type { Assessment } from '@/types'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Download, 
  User, 
  Calendar,
  FileText,
  Mail,
  Filter,
  Search
} from 'lucide-react'
import LoadingAnimation from '@/components/Animations/LoadingAnimation'

 function AssessmentResponses() {
  const { id } = useParams<{ id: string }>()
  const { isDark } = useTheme()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResponse, setSelectedResponse] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        setLoading(true)
        const [assessmentData, responsesData] = await Promise.all([
          assessmentService.getAssessment(id),
          assessmentService.getAssessmentResponses(id)
        ])
        
        setAssessment(assessmentData)
        setResponses(responsesData.responses || [])
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const filteredResponses = responses.filter(response =>
    response.candidate?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.candidate?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportToCSV = () => {
    if (!assessment || responses.length === 0) return

    const headers = ['Candidate', 'Email', 'Submitted At']
    assessment.sections.forEach(section => {
      section.questions.forEach(question => {
        headers.push(question.question)
      })
    })

    const csvData = filteredResponses.map(response => {
      const row = [
        `${response.candidate?.firstName} ${response.candidate?.lastName}`,
        response.candidate?.email,
        new Date(response.submittedAt).toLocaleString()
      ]

      assessment.sections.forEach(section => {
        section.questions.forEach(question => {
          const answer = response.responses[question.id]
          let answerText = ''
          
          if (Array.isArray(answer)) {
            answerText = answer.join('; ')
          } else if (typeof answer === 'object' && answer instanceof File) {
            answerText = answer.name
          } else {
            answerText = String(answer || '')
          }
          
          row.push(answerText)
        })
      })

      return row
    })

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${assessment.title.replace(/\s+/g, '_')}_responses.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingAnimation />
  if (!assessment) return <div className="text-center mt-10">Assessment not found</div>

  const gradientText = isDark
    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
    : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to={`/jobs/${assessment.jobId}`}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Assessment Responses
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {assessment.title}
              </p>
            </div>
          </div>
          
          <button
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              responses.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : isDark
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white border'
          }`}>
            <div className="text-2xl font-bold text-blue-500">{responses.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Responses</div>
          </div>
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white border'
          }`}>
            <div className="text-2xl font-bold text-green-500">
              {Math.round((responses.length / Math.max(responses.length, 1)) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
          </div>
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white border'
          }`}>
            <div className="text-2xl font-bold text-purple-500">
              {assessment.sections.reduce((acc, section) => acc + section.questions.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
          </div>
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white border'
          }`}>
            <div className="text-2xl font-bold text-orange-500">
              {new Date(assessment.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Responses List */}
          <div className="xl:col-span-1">
            <div className={`rounded-2xl shadow-lg p-6 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Filter size={20} />
                <h2 className={`text-xl font-semibold ${gradientText}`}>
                  Responses ({filteredResponses.length})
                </h2>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Responses List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredResponses.map((response, index) => (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedResponse(response)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedResponse?.id === response.id
                        ? isDark
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDark
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {response.candidate?.firstName} {response.candidate?.lastName}
                        </p>
                        <p className={`text-sm truncate ${
                          selectedResponse?.id === response.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {response.candidate?.email}
                        </p>
                      </div>
                      <Calendar size={16} className="shrink-0" />
                    </div>
                    <p className={`text-xs mt-2 ${
                      selectedResponse?.id === response.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(response.submittedAt).toLocaleString()}
                    </p>
                  </motion.div>
                ))}

                {filteredResponses.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No responses found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Detail */}
          <div className="xl:col-span-2">
            {selectedResponse ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-2xl shadow-lg p-6 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-2xl font-bold ${gradientText} mb-2`}>
                      {selectedResponse.candidate?.firstName} {selectedResponse.candidate?.lastName}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail size={16} />
                        <span>{selectedResponse.candidate?.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Submitted {new Date(selectedResponse.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {assessment.sections.map((section) => (
                    <div key={section.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <h3 className={`text-xl font-semibold mb-4 ${gradientText}`}>
                        {section.title}
                      </h3>
                      
                      <div className="space-y-4">
                        {section.questions.map((question) => {
                          const answer = selectedResponse.responses[question.id]
                          return (
                            <div key={question.id} className={`p-4 rounded-lg ${
                              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                            }`}>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                {question.question}
                                {question.required && <span className="text-red-500 ml-1">*</span>}
                              </h4>
                              
                              <div className={`p-3 rounded ${
                                isDark ? 'bg-gray-600' : 'bg-white border'
                              }`}>
                                {answer === undefined || answer === null || answer === '' ? (
                                  <p className="text-gray-500 dark:text-gray-400 italic">No response</p>
                                ) : Array.isArray(answer) ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    {answer.map((item, index) => (
                                      <li key={index} className="text-gray-700 dark:text-gray-300">
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                ) : typeof answer === 'object' && answer instanceof File ? (
                                  <div className="flex items-center gap-2">
                                    <FileText size={16} />
                                    <span className="text-gray-700 dark:text-gray-300">{answer.name}</span>
                                    <button
                                      onClick={() => {
                                        // In a real app, you would download the file
                                        alert(`Downloading ${answer.name}`)
                                      }}
                                      className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                      Download
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-gray-700 dark:text-gray-300">{String(answer)}</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-2xl shadow-lg p-12 text-center ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Response
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a candidate response from the list to view their answers.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentResponses;