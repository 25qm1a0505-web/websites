'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import {
  FlaskConical,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  BookOpen,
  Shield,
} from 'lucide-react'

interface LabStep {
  id: string
  description: string
  type: 'select-chemical' | 'select-apparatus' | 'perform-action' | 'measure'
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
}

interface LabState {
  currentStep: number
  selectedItems: string[]
  mistakes: number
  hintsUsed: number
  mode: 'guided' | 'exam'
  completed: boolean
  score: number
}

const LAB_STEPS: LabStep[] = [
  {
    id: '1',
    description: 'Select the primary chemical needed for water hardness testing',
    type: 'select-chemical',
    options: ['EDTA Solution', 'Sodium Hydroxide', 'Hydrochloric Acid', 'Phenolphthalein'],
    correctAnswer: 'EDTA Solution',
    explanation: 'EDTA (Ethylenediaminetetraacetic acid) is used as a complexing agent to determine water hardness.',
  },
  {
    id: '2',
    description: 'Select the appropriate apparatus for titration',
    type: 'select-apparatus',
    options: ['Beaker', 'Burette', 'Test Tube', 'Pipette'],
    correctAnswer: 'Burette',
    explanation: 'A burette is used for precise volume measurement during titration.',
  },
  {
    id: '3',
    description: 'Select the indicator for hardness determination',
    type: 'select-chemical',
    options: ['Methyl Orange', 'Eriochrome Black T', 'Phenolphthalein', 'Litmus'],
    correctAnswer: 'Eriochrome Black T',
    explanation: 'Eriochrome Black T is the specific indicator used in EDTA titration for hardness.',
  },
  {
    id: '4',
    description: 'Arrange the steps in correct order: Add sample → Add indicator → Titrate with EDTA → Note endpoint',
    type: 'perform-action',
    options: ['Add sample', 'Add indicator', 'Titrate with EDTA', 'Note endpoint'],
    correctAnswer: ['Add sample', 'Add indicator', 'Titrate with EDTA', 'Note endpoint'],
    explanation: 'The correct sequence ensures accurate measurement of water hardness.',
  },
  {
    id: '5',
    description: 'What safety precaution is most important?',
    type: 'select-chemical',
    options: ['Wear gloves', 'Use fume hood', 'Handle glassware carefully', 'All of the above'],
    correctAnswer: 'All of the above',
    explanation: 'All safety measures are important in laboratory work.',
  },
]

const PRE_LAB_CONTENT = {
  objective: 'To determine the total hardness of a water sample using EDTA titration method.',
  apparatus: [
    'Burette (50 mL)',
    'Pipette (25 mL)',
    'Conical flask (250 mL)',
    'Beaker (100 mL)',
    'Measuring cylinder',
    'Burette stand',
  ],
  chemicals: [
    'EDTA solution (0.01 M)',
    'Eriochrome Black T indicator',
    'Buffer solution (pH 10)',
    'Water sample',
  ],
  safety: [
    'Wear safety goggles and lab coat',
    'Handle glassware carefully',
    'Dispose of chemicals properly',
    'Wash hands after experiment',
  ],
}

export default function VirtualLab() {
  const { addLabAttempt } = useStore()
  const [showPreLab, setShowPreLab] = useState(true)
  const [labState, setLabState] = useState<LabState>({
    currentStep: 0,
    selectedItems: [],
    mistakes: 0,
    hintsUsed: 0,
    mode: 'guided',
    completed: false,
    score: 0,
  })
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackCorrect, setFeedbackCorrect] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const currentStepData = LAB_STEPS[labState.currentStep]

  const handleStartLab = (mode: 'guided' | 'exam') => {
    setLabState({
      currentStep: 0,
      selectedItems: [],
      mistakes: 0,
      hintsUsed: 0,
      mode,
      completed: false,
      score: 0,
    })
    setShowPreLab(false)
  }

  const handleSelectOption = (option: string) => {
    setSelectedOption(option)
  }

  const handleSubmitStep = () => {
    if (!selectedOption && !Array.isArray(currentStepData.correctAnswer)) {
      return
    }

    const isCorrect =
      Array.isArray(currentStepData.correctAnswer)
        ? JSON.stringify(selectedOption.split(',').sort()) ===
          JSON.stringify(currentStepData.correctAnswer.sort())
        : selectedOption === currentStepData.correctAnswer

    setFeedbackCorrect(isCorrect)
    setFeedbackMessage(
      isCorrect
        ? 'Correct! Well done. ✅'
        : `Incorrect. ${currentStepData.explanation || 'Try again!'}`
    )
    setShowFeedback(true)

    if (isCorrect) {
      setTimeout(() => {
        if (labState.currentStep < LAB_STEPS.length - 1) {
          setLabState({
            ...labState,
            currentStep: labState.currentStep + 1,
            selectedItems: [...labState.selectedItems, selectedOption],
            score: labState.score + 20,
          })
          setSelectedOption('')
          setShowFeedback(false)
        } else {
          // Lab completed
          const finalScore = labState.score + 20
          setLabState({
            ...labState,
            completed: true,
            score: finalScore,
          })
          addLabAttempt({
            labId: 'water_hardness_edta',
            mode: labState.mode,
            score: finalScore,
            mistakes: labState.mistakes,
            timestamp: new Date().toISOString(),
          })
        }
      }, 2000)
    } else {
      setLabState({
        ...labState,
        mistakes: labState.mistakes + 1,
      })
    }
  }

  const handleRequestHint = () => {
    if (labState.mode === 'exam') {
      alert('Hints are disabled in Exam Mode!')
      return
    }
    setLabState({
      ...labState,
      hintsUsed: labState.hintsUsed + 1,
    })
    alert(`Hint: ${currentStepData.explanation || 'Think about the purpose of this step.'}`)
  }

  const handleReset = () => {
    setShowPreLab(true)
    setLabState({
      currentStep: 0,
      selectedItems: [],
      mistakes: 0,
      hintsUsed: 0,
      mode: 'guided',
      completed: false,
      score: 0,
    })
    setSelectedOption('')
    setShowFeedback(false)
  }

  if (showPreLab) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Virtual Chemistry Lab</h1>
            <p className="text-gray-600">Water Hardness Determination by EDTA Method</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Pre-Lab Learning</h2>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Objective</h3>
                <p className="text-gray-700">{PRE_LAB_CONTENT.objective}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Apparatus Required</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {PRE_LAB_CONTENT.apparatus.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Chemicals Required</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {PRE_LAB_CONTENT.chemicals.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Safety Precautions
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {PRE_LAB_CONTENT.safety.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Lab Mode</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleStartLab('guided')}
                    className="p-6 border-2 border-primary-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Lightbulb className="w-6 h-6 text-primary-600" />
                      <h4 className="font-semibold text-lg">Guided Mode</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Hints and explanations enabled. Perfect for learning!
                    </p>
                  </button>

                  <button
                    onClick={() => handleStartLab('exam')}
                    className="p-6 border-2 border-orange-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                      <h4 className="font-semibold text-lg">Exam Mode</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      No hints. Test your knowledge under exam conditions!
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (labState.completed) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lab Completed! 🎉</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-600">Final Score</p>
                <p className="text-4xl font-bold text-primary-600">{labState.score}%</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-gray-600 text-sm">Mistakes</p>
                  <p className="text-2xl font-semibold text-gray-900">{labState.mistakes}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Hints Used</p>
                  <p className="text-2xl font-semibold text-gray-900">{labState.hintsUsed}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Try Again
              </button>
              <button
                onClick={() => setShowPreLab(true)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Pre-Lab
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Virtual Lab</h1>
            <p className="text-gray-600">Step {labState.currentStep + 1} of {LAB_STEPS.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-primary-600">{labState.score}%</p>
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Reset Lab"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {Math.round(((labState.currentStep + 1) / LAB_STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((labState.currentStep + 1) / LAB_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-primary-600">
                  {currentStepData.type.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStepData.description}
              </h3>
            </div>
            {labState.mode === 'guided' && (
              <button
                onClick={handleRequestHint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Lightbulb className="w-4 h-4" />
                Hint
              </button>
            )}
          </div>

          {/* Options */}
          {currentStepData.options && (
            <div className="space-y-3 mt-6">
              {currentStepData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    selectedOption === option
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedOption === option && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`mt-4 p-4 rounded-lg border-2 ${
                feedbackCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {feedbackCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-medium ${
                      feedbackCorrect ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {feedbackMessage}
                  </p>
                  {!feedbackCorrect && currentStepData.explanation && (
                    <p className="text-sm text-red-700 mt-1">{currentStepData.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitStep}
            disabled={!selectedOption || showFeedback}
            className="mt-6 w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showFeedback ? 'Processing...' : 'Submit Answer'}
          </button>
        </div>

        {/* Lab Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-1">Mistakes</p>
            <p className="text-2xl font-bold text-red-600">{labState.mistakes}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-1">Hints Used</p>
            <p className="text-2xl font-bold text-purple-600">{labState.hintsUsed}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-1">Mode</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{labState.mode}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

