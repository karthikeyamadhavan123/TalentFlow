import type { Question } from "@/types"

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

export default QuestionInput;