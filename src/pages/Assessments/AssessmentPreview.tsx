import { useTheme } from "@/context/ThemeContext"
import { assessmentService } from "@/services/assessmentService"
import type { Assessment, Question } from "@/types"
import { useState } from "react"
import QuestionInput from "./QuestionInput"

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
                className={`p-4 rounded-lg transition-all ${shouldShowQuestion(question)
                    ? (isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300')
                    : 'opacity-50 pointer-events-none bg-gray-400 dark:bg-gray-700'
                  }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {sectionIndex + 1}.{questionIndex + 1}
                  </span>
                  <label className="block text-sm font-medium  flex-1">
                    <span className= {`${gradientText}`}>{question.question}</span>
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                </div>

                {question.description && (
                  <p className={`text-sm mb-3 ml-9 ${gradientText}`}>
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
                    <p className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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



export default AssessmentPreview;