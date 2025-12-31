'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from 'react'
import {
  BookOpen,
  CheckCircle,
  Circle,
  ChevronRight,
  Video,
  FileText,
  Target,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

interface Topic {
  id: string
  title: string
  type: 'prerequisite' | 'core' | 'advanced'
  difficulty: 'easy' | 'medium' | 'hard'
  completed: boolean
  content: {
    videos?: { title: string; duration: string }[]
    notes?: string[]
    quizzes?: { title: string; questions: number }[]
    examples?: string[]
  }
}

const COURSE_STRUCTURE: Topic[] = [
  {
    id: 'prereq-1',
    title: 'Units and Dimensions',
    type: 'prerequisite',
    difficulty: 'easy',
    completed: false,
    content: {
      videos: [{ title: 'Introduction to Units', duration: '10 min' }],
      notes: ['SI units', 'Unit conversions', 'Dimensional analysis'],
      examples: ['Convert 1 L to mL', 'Express density in g/cm³'],
    },
  },
  {
    id: 'prereq-2',
    title: 'Concentration Terms',
    type: 'prerequisite',
    difficulty: 'easy',
    completed: false,
    content: {
      videos: [{ title: 'Molarity, Normality, ppm', duration: '15 min' }],
      notes: ['Molarity (M)', 'Normality (N)', 'Parts per million (ppm)', 'Percentage'],
      examples: ['Calculate molarity of 0.5 mol in 2L', 'Convert 100 ppm to mg/L'],
    },
  },
  {
    id: 'prereq-3',
    title: 'Chemical Reactions',
    type: 'prerequisite',
    difficulty: 'medium',
    completed: false,
    content: {
      videos: [{ title: 'Balancing Equations', duration: '12 min' }],
      notes: ['Stoichiometry', 'Balancing equations', 'Reaction types'],
      examples: ['Balance CaCO₃ + HCl → CaCl₂ + H₂O + CO₂'],
    },
  },
  {
    id: 'core-1',
    title: 'Introduction to Water Chemistry',
    type: 'core',
    difficulty: 'easy',
    completed: false,
    content: {
      videos: [
        { title: 'Water as Universal Solvent', duration: '8 min' },
        { title: 'Water Cycle and Sources', duration: '10 min' },
      ],
      notes: [
        'Water structure (H₂O)',
        'Hydrogen bonding',
        'Water sources and impurities',
        'Types of water (distilled, deionized, tap)',
      ],
      examples: ['Identify hydrogen bonds in water', 'Compare different water sources'],
    },
  },
  {
    id: 'core-2',
    title: 'Hardness of Water',
    type: 'core',
    difficulty: 'medium',
    completed: false,
    content: {
      videos: [
        { title: 'What is Water Hardness?', duration: '12 min' },
        { title: 'Temporary vs Permanent Hardness', duration: '15 min' },
        { title: 'Hardness Measurement', duration: '18 min' },
      ],
      notes: [
        'Definition of hardness',
        'Causes: Ca²⁺, Mg²⁺ ions',
        'Temporary hardness (bicarbonates)',
        'Permanent hardness (sulfates, chlorides)',
        'Units: ppm, °H, mg/L as CaCO₃',
        'EDTA titration method',
      ],
      quizzes: [{ title: 'Hardness Concepts Quiz', questions: 10 }],
      examples: [
        'Calculate hardness from Ca²⁺ concentration',
        'Convert 50 ppm to °H',
        'EDTA titration calculation',
      ],
    },
  },
  {
    id: 'core-3',
    title: 'Alkalinity of Water',
    type: 'core',
    difficulty: 'medium',
    completed: false,
    content: {
      videos: [{ title: 'Understanding Alkalinity', duration: '14 min' }],
      notes: [
        'Definition of alkalinity',
        'Carbonate, bicarbonate, hydroxide',
        'Phenolphthalein and methyl orange indicators',
        'Alkalinity measurement',
      ],
      examples: ['Calculate total alkalinity', 'Distinguish carbonate vs bicarbonate'],
    },
  },
  {
    id: 'core-4',
    title: 'pH and Acidity',
    type: 'core',
    difficulty: 'medium',
    completed: false,
    content: {
      videos: [
        { title: 'pH Scale Explained', duration: '10 min' },
        { title: 'pH Measurement Methods', duration: '12 min' },
      ],
      notes: [
        'pH = -log[H⁺]',
        'pH scale (0-14)',
        'Acidic, neutral, basic',
        'pH indicators',
        'pH meter usage',
      ],
      examples: ['Calculate pH from [H⁺]', 'Determine [OH⁻] from pH'],
    },
  },
  {
    id: 'core-5',
    title: 'Water Softening Methods',
    type: 'core',
    difficulty: 'hard',
    completed: false,
    content: {
      videos: [
        { title: 'Lime-Soda Process', duration: '15 min' },
        { title: 'Ion Exchange Method', duration: '12 min' },
        { title: 'Reverse Osmosis', duration: '10 min' },
      ],
      notes: [
        'Lime-Soda process (Clark\'s method)',
        'Ion exchange resins',
        'Reverse osmosis',
        'Distillation',
        'Advantages and disadvantages',
      ],
      quizzes: [{ title: 'Softening Methods Quiz', questions: 8 }],
      examples: [
        'Calculate lime requirement',
        'Ion exchange capacity',
        'RO efficiency calculation',
      ],
    },
  },
  {
    id: 'core-6',
    title: 'Municipal Water Treatment',
    type: 'core',
    difficulty: 'hard',
    completed: false,
    content: {
      videos: [
        { title: 'Water Treatment Plant Overview', duration: '20 min' },
        { title: 'Coagulation and Flocculation', duration: '15 min' },
        { title: 'Filtration and Disinfection', duration: '18 min' },
      ],
      notes: [
        'Treatment stages',
        'Coagulation (alum, ferric chloride)',
        'Sedimentation',
        'Filtration (sand, activated carbon)',
        'Disinfection (chlorination, UV)',
        'Fluoridation',
      ],
      examples: ['Design treatment sequence', 'Calculate chlorine dose'],
    },
  },
  {
    id: 'advanced-1',
    title: 'Industrial Water Treatment',
    type: 'advanced',
    difficulty: 'hard',
    completed: false,
    content: {
      videos: [{ title: 'Industrial Applications', duration: '25 min' }],
      notes: [
        'Boiler water treatment',
        'Cooling water treatment',
        'Wastewater treatment',
        'Industrial case studies',
      ],
      examples: ['Boiler scale prevention', 'Cooling tower water quality'],
    },
  },
  {
    id: 'advanced-2',
    title: 'Exam-Oriented Problems',
    type: 'advanced',
    difficulty: 'hard',
    completed: false,
    content: {
      quizzes: [
        { title: 'Hardness Problems', questions: 15 },
        { title: 'pH and Alkalinity', questions: 12 },
        { title: 'Treatment Methods', questions: 10 },
      ],
      examples: [
        'Previous year exam questions',
        'Step-by-step solutions',
        'Common mistakes to avoid',
      ],
    },
  },
]

export default function Course() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic)
  }

  const handleMarkComplete = (topicId: string) => {
    setCompletedTopics(new Set([...completedTopics, topicId]))
    if (selectedTopic?.id === topicId) {
      setSelectedTopic({ ...selectedTopic, completed: true })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🟢'
      case 'medium':
        return '🟡'
      case 'hard':
        return '🔴'
      default:
        return '⚪'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'prerequisite':
        return 'Prerequisite'
      case 'core':
        return 'Core Topic'
      case 'advanced':
        return 'Advanced'
      default:
        return type
    }
  }

  const prerequisiteTopics = COURSE_STRUCTURE.filter((t) => t.type === 'prerequisite')
  const coreTopics = COURSE_STRUCTURE.filter((t) => t.type === 'core')
  const advancedTopics = COURSE_STRUCTURE.filter((t) => t.type === 'advanced')

  const progress =
    (completedTopics.size / COURSE_STRUCTURE.length) * 100

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Content</h1>
          <p className="text-gray-600">Water and Its Treatment - Complete Chapter</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Course Progress</h2>
            <span className="text-2xl font-bold text-primary-600">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {completedTopics.size} of {COURSE_STRUCTURE.length} topics completed
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Topics List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prerequisites */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Prerequisite Basics
              </h2>
              <div className="space-y-3">
                {prerequisiteTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onClick={() => handleTopicClick(topic)}
                    isCompleted={completedTopics.has(topic.id)}
                    getDifficultyColor={getDifficultyColor}
                    getDifficultyEmoji={getDifficultyEmoji}
                  />
                ))}
              </div>
            </section>

            {/* Core Topics */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                Core Topics
              </h2>
              <div className="space-y-3">
                {coreTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onClick={() => handleTopicClick(topic)}
                    isCompleted={completedTopics.has(topic.id)}
                    getDifficultyColor={getDifficultyColor}
                    getDifficultyEmoji={getDifficultyEmoji}
                  />
                ))}
              </div>
            </section>

            {/* Advanced Topics */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Advanced Applications
              </h2>
              <div className="space-y-3">
                {advancedTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onClick={() => handleTopicClick(topic)}
                    isCompleted={completedTopics.has(topic.id)}
                    getDifficultyColor={getDifficultyColor}
                    getDifficultyEmoji={getDifficultyEmoji}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Topic Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedTopic ? (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {getTypeLabel(selectedTopic.type)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(
                          selectedTopic.difficulty
                        )}`}
                      >
                        {getDifficultyEmoji(selectedTopic.difficulty)} {selectedTopic.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedTopic.title}</h3>
                  </div>
                  {completedTopics.has(selectedTopic.id) ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-4">
                  {selectedTopic.content.videos && selectedTopic.content.videos.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-600" />
                        Videos
                      </h4>
                      <ul className="space-y-2">
                        {selectedTopic.content.videos.map((video, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">{video.title}</span>
                            <span className="text-xs text-gray-500">{video.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTopic.content.notes && selectedTopic.content.notes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Key Points
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {selectedTopic.content.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTopic.content.quizzes && selectedTopic.content.quizzes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        Quizzes
                      </h4>
                      <ul className="space-y-2">
                        {selectedTopic.content.quizzes.map((quiz, idx) => (
                          <li
                            key={idx}
                            className="p-2 bg-purple-50 rounded-lg text-sm text-gray-700"
                          >
                            {quiz.title} ({quiz.questions} questions)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTopic.content.examples && selectedTopic.content.examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        Examples
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {selectedTopic.content.examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!completedTopics.has(selectedTopic.id) && (
                    <button
                      onClick={() => handleMarkComplete(selectedTopic.id)}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a topic to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function TopicCard({
  topic,
  onClick,
  isCompleted,
  getDifficultyColor,
  getDifficultyEmoji,
}: {
  topic: Topic
  onClick: () => void
  isCompleted: boolean
  getDifficultyColor: (difficulty: string) => string
  getDifficultyEmoji: (difficulty: string) => string
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition text-left"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <h3 className="font-semibold text-gray-900">{topic.title}</h3>
          </div>
          <div className="flex items-center gap-2 ml-7">
            <span
              className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(
                topic.difficulty
              )}`}
            >
              {getDifficultyEmoji(topic.difficulty)} {topic.difficulty}
            </span>
            {topic.content.videos && (
              <span className="text-xs text-gray-500">
                {topic.content.videos.length} video{topic.content.videos.length > 1 ? 's' : ''}
              </span>
            )}
            {topic.content.quizzes && (
              <span className="text-xs text-gray-500">
                {topic.content.quizzes.length} quiz{topic.content.quizzes.length > 1 ? 'zes' : ''}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
      </div>
    </button>
  )
}

