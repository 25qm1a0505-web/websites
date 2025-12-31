'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FlaskConical, BookOpen, Brain, GraduationCap, ArrowRight } from 'lucide-react'
import { DarkModeToggle } from '@/components/DarkModeToggle'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">ChemLearn</span>
          </div>
          <div className="flex gap-4">
            <DarkModeToggle />
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Master Engineering Chemistry
            <br />
            <span className="text-primary-600 dark:text-primary-400">with AI Guidance</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Step-by-step learning, weakness detection, and virtual lab practice
            for BTech First Year students
          </p>
          <button
            onClick={handleGetStarted}
            disabled={isLoading}
            className="px-8 py-4 bg-primary-600 dark:bg-primary-500 text-white text-lg rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="AI Problem Solver"
            description="Step-by-step guidance with weakness detection. No direct answers, just smart hints."
          />
          <FeatureCard
            icon={<FlaskConical className="w-8 h-8" />}
            title="Virtual Lab"
            description="Interactive chemistry lab simulations for Water & Its Treatment"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Teach-Back Learning"
            description="Create notes, get AI feedback, and learn by teaching"
          />
          <FeatureCard
            icon={<GraduationCap className="w-8 h-8" />}
            title="Structured Course"
            description="Complete Water and Its Treatment chapter with visual content"
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100 dark:border-gray-700">
      <div className="text-primary-600 dark:text-primary-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

