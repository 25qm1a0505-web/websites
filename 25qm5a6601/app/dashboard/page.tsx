'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useStore } from '@/lib/store'
import { useEffect } from 'react'
import {
  Brain,
  FlaskConical,
  TrendingUp,
  AlertCircle,
  Target,
  Clock,
  CheckCircle,
  BookOpen,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const { weakConcepts, problemAttempts, labAttempts } = useStore()
  const router = useRouter()

  useEffect(() => {
    useStore.getState().loadFromStorage()
  }, [])

  const totalProblems = problemAttempts.length
  const correctProblems = problemAttempts.filter((p) => p.correct).length
  const accuracy = totalProblems > 0 ? (correctProblems / totalProblems) * 100 : 0
  const totalHints = problemAttempts.reduce((sum, p) => sum + p.hintsUsed, 0)
  const avgHints = totalProblems > 0 ? totalHints / totalProblems : 0
  const totalTime = problemAttempts.reduce((sum, p) => sum + p.timeSpent, 0)
  const avgTime = totalProblems > 0 ? totalTime / totalProblems : 0

  const topWeakConcepts = [...weakConcepts]
    .sort((a, b) => a.strength - b.strength)
    .slice(0, 5)

  // Prepare chart data
  const accuracyData = problemAttempts.slice(-7).map((attempt, idx) => ({
    day: `Day ${idx + 1}`,
    accuracy: attempt.correct ? 100 : 0,
  }))

  const conceptData = topWeakConcepts.map((concept) => ({
    concept: concept.concept,
    strength: concept.strength,
  }))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, Student! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Target className="w-6 h-6" />}
            title="Problem Accuracy"
            value={`${accuracy.toFixed(1)}%`}
            subtitle={`${correctProblems}/${totalProblems} correct`}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Brain className="w-6 h-6" />}
            title="Avg Hints Used"
            value={avgHints.toFixed(1)}
            subtitle="Lower is better"
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Avg Time/Problem"
            value={`${(avgTime / 60).toFixed(1)} min`}
            subtitle="Time efficiency"
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<FlaskConical className="w-6 h-6" />}
            title="Lab Attempts"
            value={labAttempts.length.toString()}
            subtitle="Virtual lab practice"
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accuracy Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Problem-Solving Accuracy Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weak Concepts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Concept Strength Analysis
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={conceptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="concept" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="strength" fill="#0ea5e9" name="Strength %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Concepts List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              Weak Concepts Detected
            </h3>
            <button
              onClick={() => router.push('/dashboard/problem-solver')}
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-semibold"
            >
              Practice Now →
            </button>
          </div>

          {topWeakConcepts.length > 0 ? (
            <div className="space-y-3">
              {topWeakConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{concept.concept}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {concept.attempts} attempts, {concept.wrongAttempts} incorrect
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Strength</p>
                      <p
                        className={`text-lg font-bold ${
                          concept.strength < 50
                            ? 'text-red-600 dark:text-red-400'
                            : concept.strength < 70
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {concept.strength.toFixed(0)}%
                      </p>
                    </div>
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          concept.strength < 50
                            ? 'bg-red-500'
                            : concept.strength < 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${concept.strength}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 dark:text-green-400" />
              <p>No weak concepts detected yet. Start solving problems to track your progress!</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Solve Problems"
            description="Practice with AI guidance"
            icon={<Brain className="w-6 h-6" />}
            onClick={() => router.push('/dashboard/problem-solver')}
            color="bg-blue-500"
          />
          <QuickActionCard
            title="Virtual Lab"
            description="Practice lab experiments"
            icon={<FlaskConical className="w-6 h-6" />}
            onClick={() => router.push('/dashboard/virtual-lab')}
            color="bg-green-500"
          />
          <QuickActionCard
            title="Course Content"
            description="Learn Water & Its Treatment"
            icon={<BookOpen className="w-6 h-6" />}
            onClick={() => router.push('/dashboard/course')}
            color="bg-purple-500"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
  bgColor,
}: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  color: string
  bgColor: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className={`${bgColor} dark:opacity-80 w-12 h-12 rounded-lg flex items-center justify-center ${color} mb-4`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  icon,
  onClick,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white rounded-xl p-6 text-left hover:opacity-90 transition transform hover:scale-105`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  )
}

