import type { AssessmentSection, Question, QuestionType } from "@/types"
import { useState } from "react"
import {motion} from "framer-motion"
import { GripVertical, Trash2, Plus, Upload, Hash, FileText, Type, List, CheckSquare } from "lucide-react"

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
export default QuestionBuilder;