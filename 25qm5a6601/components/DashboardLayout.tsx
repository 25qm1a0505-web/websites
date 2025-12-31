'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useStore } from '@/lib/store'
import {
  LayoutDashboard,
  Brain,
  FlaskConical,
  BookOpen,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { DarkModeToggle } from './DarkModeToggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Brain, label: 'AI Problem Solver', path: '/dashboard/problem-solver' },
    { icon: FlaskConical, label: 'Virtual Lab', path: '/dashboard/virtual-lab' },
    { icon: BookOpen, label: 'Teach-Back', path: '/dashboard/teach-back' },
    { icon: GraduationCap, label: 'Course Content', path: '/dashboard/course' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <span className="font-bold text-gray-800 dark:text-gray-100">ChemLearn</span>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 dark:text-gray-300"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">ChemLearn</span>
              </div>
              <DarkModeToggle />
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

