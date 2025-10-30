import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { assessmentService } from '@/services/assessmentService'
import type { Assessment, AssessmentSection, Question, QuestionType } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  GripVertical,
  FileText,
  Hash,
  CheckSquare,
  List,
  Type,
  ArrowLeft,
  Upload
} from 'lucide-react'
import LoadingAnimation from '@/components/Animations/LoadingAnimation'
import QuestionBuilder from './QuestionBuilder' // You'll need to create this or fix the inline component
import AssessmentPreview from './AssessmentPreview' // You'll need to create this

const QUESTION_TYPES: { type: QuestionType; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    type: 'single-choice', 
    label: 'Single Choice', 
    icon: <CheckSquare size={16} />,
    description: 'Multiple options, single selection'
  },
  { 
    type: 'multi-choice', 
    label: 'Multiple Choice', 
    icon: <List size={16} />,
    description: 'Multiple options, multiple selections'
  },
  { 
    type: 'short-text', 
    label: 'Short Text', 
    icon: <Type size={16} />,
    description: 'Short text answer (max 100 chars)'
  },
  { 
    type: 'long-text', 
    label: 'Long Text', 
    icon: <FileText size={16} />,
    description: 'Long text answer (max 1000 chars)'
  },
  { 
    type: 'numeric-range', 
    label: 'Numeric Range', 
    icon: <Hash size={16} />,
    description: 'Number within a specified range'
  },
  { 
    type: 'file-upload', 
    label: 'File Upload', 
    icon: <Upload size={16} />,
    description: 'Upload files (resume, portfolio, etc.)'
  },
]

function AssessmentBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const gradientText = isDark
    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
    : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true)
        if (id) {
          // Editing existing assessment
          const assessmentData = await assessmentService.getAssessment(id)
          setAssessment(assessmentData)
        } else {
          // This shouldn't happen since we always have an id from the route
          setError('No assessment ID provided')
        }
      } catch (err) {
        console.error('Error fetching assessment:', err)
        setError('Failed to load assessment')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [id]) // Remove jobId dependency

  const saveAssessment = async () => {
    if (!assessment) return

    try {
      setSaving(true)
      if (id) {
        // Update existing assessment
        await assessmentService.updateAssessment(id, assessment)
      } else {
        // Create new assessment
        await assessmentService.createAssessment(assessment)
      }
      
      // Save draft locally
      assessmentService.saveDraftAssessment(assessment)
      
      // Navigate back to job detail - use the jobId from assessment
      if (assessment.jobId) {
        navigate(`/jobs/${assessment.jobId}`)
      } else {
        navigate('/jobs')
      }
    } catch (err) {
      console.error('Error saving assessment:', err)
      setError('Failed to save assessment')
    } finally {
      setSaving(false)
    }
  }

  const addSection = useCallback(() => {
    if (!assessment) return

    const newSection: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      questions: [],
    }
    setAssessment(prev => ({
      ...prev!,
      sections: [...prev!.sections, newSection],
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const updateSection = useCallback((sectionId: string, updates: Partial<AssessmentSection>) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const deleteSection = useCallback((sectionId: string) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.filter(section => section.id !== sectionId),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const addQuestion = useCallback((sectionId: string, type: QuestionType) => {
    if (!assessment) return

    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      question: 'New Question',
      required: false,
      ...(type === 'single-choice' || type === 'multi-choice' ? { options: ['Option 1', 'Option 2'] } : {}),
      ...(type === 'numeric-range' ? { min: 0, max: 100 } : {}),
      ...(type === 'short-text' ? { maxLength: 100 } : {}),
      ...(type === 'long-text' ? { maxLength: 1000 } : {}),
    }

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const updateQuestion = useCallback((sectionId: string, questionId: string, updates: Partial<Question>) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId ? { ...question, ...updates } : question
              ),
            }
          : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const deleteQuestion = useCallback((sectionId: string, questionId: string) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
          : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const addOption = useCallback((sectionId: string, questionId: string) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? { 
                      ...question, 
                      options: [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`] 
                    }
                  : question
              ),
            }
          : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const updateOption = useCallback((sectionId: string, questionId: string, optionIndex: number, value: string) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? {
                      ...question,
                      options: question.options?.map((option, idx) =>
                        idx === optionIndex ? value : option
                      ),
                    }
                  : question
              ),
            }
          : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const deleteOption = useCallback((sectionId: string, questionId: string, optionIndex: number) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? {
                      ...question,
                      options: question.options?.filter((_, idx) => idx !== optionIndex),
                    }
                  : question
              ),
            }
          : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const addConditionalLogic = useCallback((sectionId: string, questionId: string, dependsOn: string, condition: string) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? {
                      ...question,
                      conditional: { dependsOn, condition },
                    }
                  : question
              ),
            }
          : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  const removeConditionalLogic = useCallback((sectionId: string, questionId: string) => {
    if (!assessment) return

    setAssessment(prev => ({
      ...prev!,
      sections: prev!.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? {
                      ...question,
                      conditional: undefined,
                    }
                  : question
              ),
            }
          : section
      ),
      updatedAt: new Date().toISOString(),
    }))
  }, [assessment])

  if (loading) return <LoadingAnimation />
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>
  if (!assessment) return <div className="text-center mt-10">Assessment not found</div>

  return (
    <div className={`min-h-screen p-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(assessment.jobId ? `/jobs/${assessment.jobId}` : '/jobs')}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
            >
              <ArrowLeft size={20} className={isDark ? 'text-white' : 'text-gray-900'} />
            </button>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${gradientText}`}>
                Assessment Builder
              </h1>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {id ? 'Editing assessment' : 'Creating new assessment'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <Eye size={20} />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>
            <button
              onClick={saveAssessment}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Assessment'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Builder Panel */}
          {!previewMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl ${
                isDark ? 'bg-black border border-gray-800' : 'bg-white shadow-lg border border-gray-200'
              }`}
            >
              {/* Assessment Info */}
              <div className="mb-8">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Assessment Title
                </label>
                <input
                  type="text"
                  value={assessment.title}
                  onChange={(e) => setAssessment(prev => ({ ...prev!, title: e.target.value }))}
                  className={`w-full text-xl font-bold p-3 rounded-lg border ${
                    isDark
                      ? 'bg-black border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter assessment title..."
                />
                
                <label className={`block text-sm font-medium mb-2 mt-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={assessment.description}
                  onChange={(e) => setAssessment(prev => ({ ...prev!, description: e.target.value }))}
                  placeholder="Enter assessment description..."
                  className={`w-full p-3 rounded-lg border resize-none ${
                    isDark
                      ? 'bg-black border-gray-700 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  rows={3}
                />
              </div>

              {/* Sections */}
              <div className="space-y-6">
                <AnimatePresence>
                  {assessment.sections.map((section) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 rounded-xl border-2 ${
                        isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {/* Section Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <GripVertical className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          className={`flex-1 text-lg font-semibold p-2 rounded-lg ${
                            isDark
                              ? 'bg-black text-white border border-gray-700'
                              : 'bg-white text-gray-900 border border-gray-300'
                          }`}
                          placeholder="Section title..."
                        />
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <textarea
                        value={section.description || ''}
                        onChange={(e) => updateSection(section.id, { description: e.target.value })}
                        placeholder="Section description (optional)..."
                        className={`w-full mb-4 p-2 rounded-lg resize-none border ${
                          isDark
                            ? 'bg-black border-gray-700 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        rows={2}
                      />

                      {/* Questions */}
                      <div className="space-y-4">
                        <AnimatePresence>
                          {section.questions.map((question) => (
                            <QuestionBuilder
                              key={question.id}
                              question={question}
                              section={section}
                              allQuestions={section.questions}
                              onUpdate={(updates) => updateQuestion(section.id, question.id, updates)}
                              onDelete={() => deleteQuestion(section.id, question.id)}
                              onAddOption={() => addOption(section.id, question.id)}
                              onUpdateOption={(optionIndex, value) => updateOption(section.id, question.id, optionIndex, value)}
                              onDeleteOption={(optionIndex) => deleteOption(section.id, question.id, optionIndex)}
                              onAddConditional={(dependsOn, condition) => addConditionalLogic(section.id, question.id, dependsOn, condition)}
                              onRemoveConditional={() => removeConditionalLogic(section.id, question.id)}
                              isDark={isDark}
                            />
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Add Question Buttons */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                        {QUESTION_TYPES.map(({ type, label, icon, description }) => (
                          <button
                            key={type}
                            onClick={() => addQuestion(section.id, type)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg text-sm transition-colors border ${
                              isDark
                                ? 'bg-black border-gray-700 text-gray-300 hover:bg-gray-800'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                            title={description}
                          >
                            {icon}
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add Section Button */}
              <button
                onClick={addSection}
                className={`w-full mt-6 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-colors ${
                  isDark
                    ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                <Plus size={20} />
                Add Section
              </button>
            </motion.div>
          )}

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-2xl ${
              isDark ? 'bg-black border border-gray-800' : 'bg-white shadow-lg border border-gray-200'
            }`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${gradientText}`}>
              Live Preview
            </h2>
            
            <div className={`p-6 rounded-xl ${
              isDark ? 'bg-black border border-gray-800' : 'bg-gray-50 border border-gray-200'
            }`}>
              <AssessmentPreview assessment={assessment} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentBuilder