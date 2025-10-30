import { useTheme } from "@/context/ThemeContext"
import { assessmentService } from "@/services/assessmentService"
import type { Assessment, Question } from "@/types"
import { useState } from "react"

function AssessmentPreview({ assessment }: { assessment: Assessment }) {
  const { isDark } = useTheme()
  const [responses, setResponses] = useState<Record<string, any>>({})

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  // Fixed conditional logic function
  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.conditional) return true
    
    const { dependsOn, condition } = question.conditional
    const dependentResponse = responses[dependsOn]
    
    if (!dependentResponse) return false
    
    if (Array.isArray(dependentResponse)) {
      return dependentResponse.includes(condition)
    }
    
    return dependentResponse === condition
  }

  const gradientText = isDark
    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
    : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${gradientText}`}>
          {assessment.title}
        </h1>
        {assessment.description && (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {section.description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {section.questions.map((question, questionIndex) => (
              <div 
                key={question.id} 
                className={`p-4 rounded-lg transition-all ${
                  shouldShowQuestion(question) 
                    ? (isDark ? 'bg-gray-600 border border-gray-500' : 'bg-white border border-gray-200') 
                    : 'opacity-50 pointer-events-none bg-gray-400 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isDark ? 'bg-gray-500 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {sectionIndex + 1}.{questionIndex + 1}
                  </span>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white flex-1">
                    {question.question}
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

// Fixed QuestionInput Component with proper styling
function QuestionInput({ 
  question, 
  value, 
  onChange, 
  isDark 
}: { 
  question: Question
  value: any
  onChange: (value: any) => void
  isDark: boolean
}) {
  const inputBaseClasses = `w-full p-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
    isDark ? 'border-gray-600' : 'border-gray-300'
  }`
  
  const errorClasses = 'border-red-500 dark:border-red-400'

  switch (question.type) {
    case 'single-choice':
      return (
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="text-blue-500 focus:ring-blue-500"
              />
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
      )

    case 'multi-choice':
      return (
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value={option}
                checked={Array.isArray(value) && value.includes(option)}
                onChange={(e) => {
                  const currentValues = Array.isArray(value) ? value : []
                  if (e.target.checked) {
                    onChange([...currentValues, option])
                  } else {
                    onChange(currentValues.filter(v => v !== option))
                  }
                }}
                className="text-blue-500 rounded focus:ring-blue-500"
              />
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
      )

    case 'short-text':
      const isShortTextInvalid = question.maxLength && value?.length > question.maxLength
      return (
        <div className="space-y-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={question.maxLength}
            className={`${inputBaseClasses} ${isShortTextInvalid ? errorClasses : ''}`}
            placeholder="Enter your answer..."
          />
          {isShortTextInvalid && (
            <p className="text-red-500 text-sm">
              Maximum {question.maxLength} characters allowed
            </p>
          )}
        </div>
      )

    case 'long-text':
      const isLongTextInvalid = question.maxLength && value?.length > question.maxLength
      return (
        <div className="space-y-1">
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={question.maxLength}
            rows={4}
            className={`${inputBaseClasses} resize-vertical ${isLongTextInvalid ? errorClasses : ''}`}
            placeholder="Enter your detailed answer..."
          />
          {isLongTextInvalid && (
            <p className="text-red-500 text-sm">
              Maximum {question.maxLength} characters allowed
            </p>
          )}
        </div>
      )

    case 'numeric-range':
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={question.min}
            max={question.max}
            value={value || question.min}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{question.min}</span>
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              Selected: <strong>{value || question.min}</strong>
            </span>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{question.max}</span>
          </div>
        </div>
      )

    case 'file-upload':
      return (
        <div className="space-y-2">
          <input
            type="file"
            onChange={(e) => onChange(e.target.files?.[0])}
            className={`w-full p-2 rounded-lg border ${
              isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
            } file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
              isDark 
                ? 'file:bg-gray-600 file:text-white' 
                : 'file:bg-gray-50 file:text-gray-700'
            }`}
          />
          {value && (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Selected: {value.name}
            </p>
          )}
        </div>
      )

    default:
      return null
  }
}

export default AssessmentPreview;