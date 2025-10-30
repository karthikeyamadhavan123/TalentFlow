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
import QuestionInput from './QuestionInput'

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

interface AssessmentBuilderProps {
  jobId: string
}
 
function AssessmentBuilder({ jobId }: AssessmentBuilderProps) {

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
          // Creating new assessment for job
          const assessmentData = await assessmentService.getAssessmentByJobId(jobId)
          if (assessmentData) {
            setAssessment(assessmentData)
          } else {
            // Create a new assessment structure
            setAssessment({
              id: `assessment-${Date.now()}`,
              jobId,
              title: 'New Assessment',
              description: '',
              sections: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          }
        }
      } catch (err) {
        console.error('Error fetching assessment:', err)
        setError('Failed to load assessment')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [id, jobId])

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
      
      // Navigate back to job detail
      navigate(`/jobs/${jobId}`)
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
              onClick={() => navigate(`/jobs/${id ? assessment.jobId : id} `)}
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

// Question Builder Component
function QuestionBuilder({ 
  question, 
  allQuestions,
  onUpdate, 
  onDelete,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  onAddConditional,
  onRemoveConditional,
  isDark 
}: {
  question: Question
  section: AssessmentSection
  allQuestions: Question[]
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onAddOption: () => void
  onUpdateOption: (index: number, value: string) => void
  onDeleteOption: (index: number) => void
  onAddConditional: (dependsOn: string, condition: string) => void
  onRemoveConditional: () => void
  isDark: boolean
}) {
  const [showConditional, setShowConditional] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-4 rounded-lg border ${
        isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
      }`}
    >
      {/* Question Header */}
      <div className="flex items-center gap-3 mb-3">
        <GripVertical className={isDark ? 'text-gray-600' : 'text-gray-400'} />
        <input
          type="text"
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          className={`flex-1 p-2 rounded-lg font-medium border ${
            isDark
              ? 'bg-black border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          placeholder="Question text"
        />
        <select
          value={question.type}
          onChange={(e) => onUpdate({ type: e.target.value as QuestionType })}
          className={`px-3 py-2 rounded-lg border ${
            isDark
              ? 'bg-black border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {QUESTION_TYPES.map(({ type, label }) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
        <button
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Question Configuration */}
      <div className="space-y-3 ml-8">
        {/* Description */}
        <input
          type="text"
          value={question.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Description (optional)"
          className={`w-full p-2 rounded-lg text-sm border ${
            isDark
              ? 'bg-black border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />

        {/* Required Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded"
          />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Required question
          </span>
        </label>

        {/* Options for Choice Questions */}
        {(question.type === 'single-choice' || question.type === 'multi-choice') && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Options
              </span>
              <button
                onClick={onAddOption}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Plus size={14} />
                Add Option
              </button>
            </div>
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => onUpdateOption(optionIndex, e.target.value)}
                  className={`flex-1 p-2 rounded-lg text-sm border ${
                    isDark
                      ? 'bg-black border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={() => onDeleteOption(optionIndex)}
                  className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Numeric Range Configuration */}
        {question.type === 'numeric-range' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Minimum
              </label>
              <input
                type="number"
                value={question.min || 0}
                onChange={(e) => onUpdate({ min: parseInt(e.target.value) })}
                className={`w-full p-2 rounded-lg text-sm border ${
                  isDark
                    ? 'bg-black border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Maximum
              </label>
              <input
                type="number"
                value={question.max || 100}
                onChange={(e) => onUpdate({ max: parseInt(e.target.value) })}
                className={`w-full p-2 rounded-lg text-sm border ${
                  isDark
                    ? 'bg-black border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        )}

        {/* Max Length for Text Questions */}
        {(question.type === 'short-text' || question.type === 'long-text') && (
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Maximum Length
            </label>
            <input
              type="number"
              value={question.maxLength || (question.type === 'short-text' ? 100 : 1000)}
              onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) })}
              className={`w-full p-2 rounded-lg text-sm border ${
                isDark
                  ? 'bg-black border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        )}

        {/* Conditional Logic */}
        <div className="border-t pt-3 mt-3 border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Conditional Logic
            </span>
            <button
              onClick={() => setShowConditional(!showConditional)}
              className={`text-sm ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              {showConditional ? 'Hide' : 'Add Conditional'}
            </button>
          </div>

          {showConditional && (
            <div className={`space-y-2 p-3 rounded-lg border ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'
            }`}>
              {question.conditional ? (
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Show if {question.conditional.dependsOn} = "{question.conditional.condition}"
                  </span>
                  <button
                    onClick={onRemoveConditional}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    onChange={(e) => {
                      const dependsOn = e.target.value
                      if (dependsOn) {
                        onAddConditional(dependsOn, '')
                      }
                    }}
                    className={`w-full p-2 rounded text-sm border ${
                      isDark
                        ? 'bg-black border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select question...</option>
                    {allQuestions
                      .filter(q => q.id !== question.id && (q.type === 'single-choice' || q.type === 'multi-choice'))
                      .map(q => (
                        <option key={q.id} value={q.id}>
                          {q.question}
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Assessment Preview Component
function AssessmentPreview({ assessment }: { assessment: Assessment }) {
  const { isDark } = useTheme()
  const [responses, setResponses] = useState<Record<string, any>>({})

  const gradientText = isDark
    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
    : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  // Fixed conditional logic function
  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.conditional) return true
    
    const { dependsOn, condition } = question.conditional
    const dependentResponse = responses[dependsOn]
    
    // If no response yet, don't show conditional questions
    if (dependentResponse === undefined || dependentResponse === null) return false
    
    if (Array.isArray(dependentResponse)) {
      return dependentResponse.includes(condition)
    }
    
    return dependentResponse === condition
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${gradientText}`}>
          {assessment.title}
        </h1>
        {assessment.description && (
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {assessment.description}
          </p>
        )}
      </div>

      {assessment.sections.map((section, sectionIndex) => (
        <div key={section.id} className="space-y-4">
          <div>
            <h2 className={`text-xl font-semibold mb-2 ${gradientText}`}>
              {section.title}
            </h2>
            {section.description && (
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {section.description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {section.questions.map((question, questionIndex) => (
              <div 
                key={question.id} 
                className={`p-4 rounded-lg border transition-all ${
                  shouldShowQuestion(question) 
                    ? (isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200') 
                    : 'opacity-50 pointer-events-none bg-gray-400 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {sectionIndex + 1}.{questionIndex + 1}
                  </span>
                  <label className="block text-sm font-medium flex-1">
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {question.question}
                    </span>
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                </div>
                
                {question.description && (
                  <p className={`text-sm mb-3 ml-9 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {question.description}
                  </p>
                )}

                {shouldShowQuestion(question) && (
                  <div className="ml-9">
                    <QuestionInput
                      question={question}
                      value={responses[question.id]}
                      onChange={(value) => handleResponseChange(question.id, value)}
                      isDark={isDark}
                    />
                  </div>
                )}
                
                {!shouldShowQuestion(question) && (
                  <div className="ml-9">
                    <p className={`text-sm italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      This question is hidden based on previous answers
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={() => {
            // Validate required questions that are visible
            const requiredQuestions = assessment.sections.flatMap(section =>
              section.questions.filter(q => q.required && shouldShowQuestion(q))
            )
            
            const missingRequired = requiredQuestions.filter(q => {
              const response = responses[q.id]
              return !response || 
                    (Array.isArray(response) && response.length === 0) ||
                    (typeof response === 'string' && response.trim() === '')
            })
            
            if (missingRequired.length > 0) {
              alert(`Please complete ${missingRequired.length} required question(s)`)
              return
            }
            
            // Save responses locally
            assessmentService.saveDraftResponse(assessment.id, 'current-user', responses)
            alert('Assessment submitted successfully!')
          }}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          Submit Assessment
        </button>
      </div>
    </div>
  )
}


export default AssessmentBuilder;