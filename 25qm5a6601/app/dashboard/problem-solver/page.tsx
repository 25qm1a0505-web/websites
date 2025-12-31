'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import {
  Send,
  Lightbulb,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Upload,
  X,
} from 'lucide-react'

interface ProblemStep {
  type: 'concept' | 'question' | 'hint' | 'feedback' | 'answer-check'
  content: string
  timestamp: string
}

interface ProblemState {
  problem: string
  steps: ProblemStep[]
  currentStep: number
  userAnswer: string
  hintsUsed: number
  startTime: number
  concepts: string[]
}

const CONCEPTS = [
  'Stoichiometry',
  'Water chemistry',
  'Hardness',
  'pH',
  'Thermodynamics',
  'Units & dimensions',
  'Concentration',
  'Chemical reactions',
]

export default function ProblemSolver() {
  const { addProblemAttempt } = useStore()
  const [problemState, setProblemState] = useState<ProblemState | null>(null)
  const [inputProblem, setInputProblem] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultCorrect, setResultCorrect] = useState(false)

  const detectConcepts = (problem: string): string[] => {
    const detected: string[] = []
    const lowerProblem = problem.toLowerCase()
    CONCEPTS.forEach((concept) => {
      if (lowerProblem.includes(concept.toLowerCase())) {
        detected.push(concept)
      }
    })
    return detected.length > 0 ? detected : ['General Chemistry']
  }

  const generateConceptQuestion = (concepts: string[]): string => {
    if (concepts.includes('Hardness')) {
      return 'What is the difference between temporary and permanent hardness of water?'
    }
    if (concepts.includes('pH')) {
      return 'What does pH measure, and what is the pH scale range?'
    }
    if (concepts.includes('Stoichiometry')) {
      return 'What is the relationship between moles, mass, and molecular weight?'
    }
    if (concepts.includes('Concentration')) {
      return 'How do you calculate molarity from given mass and volume?'
    }
    return 'What are the key principles involved in solving this type of problem?'
  }

  const generateHint = (step: number, concepts: string[]): string => {
    const hints = [
      'Think about the units involved. What are you trying to find?',
      'Consider the relationships between the given quantities.',
      'Check if you need to convert units before calculation.',
      'Review the formula that connects these concepts.',
      'Double-check your arithmetic and significant figures.',
    ]
    return hints[Math.min(step - 1, hints.length - 1)]
  }

  const handleSubmitProblem = async () => {
    if (!inputProblem.trim()) return

    setIsProcessing(true)
    const concepts = detectConcepts(inputProblem)

    // Simulate AI processing
    setTimeout(() => {
      const newState: ProblemState = {
        problem: inputProblem,
        steps: [
          {
            type: 'concept',
            content: `I've identified the core concepts: ${concepts.join(', ')}. Let's start step-by-step!`,
            timestamp: new Date().toISOString(),
          },
        ],
        currentStep: 0,
        userAnswer: '',
        hintsUsed: 0,
        startTime: Date.now(),
        concepts,
      }

      setProblemState(newState)
      setIsProcessing(false)
      setInputProblem('')
    }, 1500)
  }

  const handleNextStep = () => {
    if (!problemState) return

    const nextStep = problemState.currentStep + 1
    let newSteps = [...problemState.steps]

    if (nextStep === 1) {
      // Ask concept question
      const question = generateConceptQuestion(problemState.concepts)
      newSteps.push({
        type: 'question',
        content: question,
        timestamp: new Date().toISOString(),
      })
    }

    setProblemState({
      ...problemState,
      currentStep: nextStep,
      steps: newSteps,
    })
  }

  const handleRequestHint = () => {
    if (!problemState) return

    const hintNumber = problemState.hintsUsed + 1
    const hint = generateHint(hintNumber, problemState.concepts)

    setProblemState({
      ...problemState,
      hintsUsed: hintNumber,
      steps: [
        ...problemState.steps,
        {
          type: 'hint',
          content: `Hint ${hintNumber}: ${hint}`,
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  const handleSubmitAnswer = () => {
    if (!problemState || !problemState.userAnswer.trim()) return

    // Simulate answer checking
    setIsProcessing(true)
    setTimeout(() => {
      // In a real app, this would use AI to check the answer
      const isCorrect = Math.random() > 0.3 // 70% chance for demo
      setResultCorrect(isCorrect)

      const feedback = isCorrect
        ? "Great job! Your answer is correct. You've shown good understanding of the concepts."
        : "Your answer needs some work. Let's review: Check your units, verify your calculations, and ensure you've applied the correct formula."

      setProblemState({
        ...problemState,
        steps: [
          ...problemState.steps,
          {
            type: 'feedback',
            content: feedback,
            timestamp: new Date().toISOString(),
          },
        ],
      })

      // Record attempt
      const timeSpent = (Date.now() - problemState.startTime) / 1000 / 60 // minutes
      addProblemAttempt({
        problemId: `prob_${Date.now()}`,
        concept: problemState.concepts[0],
        hintsUsed: problemState.hintsUsed,
        correct: isCorrect,
        timeSpent,
        timestamp: new Date().toISOString(),
      })

      setShowResult(true)
      setIsProcessing(false)
    }, 1500)
  }

  const handleNewProblem = () => {
    setProblemState(null)
    setShowResult(false)
    setResultCorrect(false)
    setInputProblem('')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Problem Solver</h1>
          <p className="text-gray-600">
            Get step-by-step guidance. No direct answers—just smart hints to help you learn!
          </p>
        </div>

        {!problemState ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Enter Your Chemistry Problem
            </h2>
            <div className="space-y-4">
              <textarea
                value={inputProblem}
                onChange={(e) => setInputProblem(e.target.value)}
                placeholder="Example: Calculate the hardness of water sample containing 120 mg/L of CaCO3..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSubmitProblem}
                  disabled={isProcessing || !inputProblem.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Start Solving
                    </>
                  )}
                </button>
                <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Problem Display */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Problem</h3>
                  <p className="text-gray-700">{problemState.problem}</p>
                </div>
                <button
                  onClick={handleNewProblem}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {problemState.concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guided Steps</h3>
              <div className="space-y-4">
                {problemState.steps.map((step, idx) => (
                  <StepCard key={idx} step={step} index={idx} />
                ))}

                {problemState.currentStep === 0 && (
                  <button
                    onClick={handleNextStep}
                    className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Continue to Concept Check
                  </button>
                )}

                {problemState.steps.some((s) => s.type === 'question') &&
                  !problemState.steps.some((s) => s.type === 'answer-check') && (
                    <div className="space-y-3">
                      <textarea
                        value={problemState.userAnswer}
                        onChange={(e) =>
                          setProblemState({ ...problemState, userAnswer: e.target.value })
                        }
                        placeholder="Type your answer or approach here..."
                        className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleRequestHint}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Lightbulb className="w-4 h-4" />
                          Request Hint ({problemState.hintsUsed} used)
                        </button>
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={!problemState.userAnswer.trim() || isProcessing}
                          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-2 justify-center">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Checking...
                            </span>
                          ) : (
                            'Submit Answer'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Result */}
            {showResult && (
              <div
                className={`rounded-xl shadow-sm p-6 border-2 ${
                  resultCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {resultCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        resultCorrect ? 'text-green-900' : 'text-orange-900'
                      }`}
                    >
                      {resultCorrect ? 'Correct Answer!' : 'Needs Improvement'}
                    </h3>
                    <p className={resultCorrect ? 'text-green-800' : 'text-orange-800'}>
                      {problemState.steps[problemState.steps.length - 1].content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Your Performance:</p>
                      <div className="flex gap-4 text-sm">
                        <span>Hints used: {problemState.hintsUsed}</span>
                        <span>
                          Time: {((Date.now() - problemState.startTime) / 1000 / 60).toFixed(1)} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNewProblem}
                  className="mt-4 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Try Another Problem
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function StepCard({ step, index }: { step: ProblemStep; index: number }) {
  const getIcon = () => {
    switch (step.type) {
      case 'concept':
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      case 'question':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />
      case 'hint':
        return <Lightbulb className="w-5 h-5 text-purple-600" />
      case 'feedback':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return null
    }
  }

  const getBgColor = () => {
    switch (step.type) {
      case 'concept':
        return 'bg-blue-50 border-blue-200'
      case 'question':
        return 'bg-yellow-50 border-yellow-200'
      case 'hint':
        return 'bg-purple-50 border-purple-200'
      case 'feedback':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-gray-900">{step.content}</p>
        </div>
      </div>
    </div>
  )
}

