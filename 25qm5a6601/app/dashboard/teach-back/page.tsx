'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import {
  BookOpen,
  Mic,
  Send,
  CheckCircle,
  AlertCircle,
  Heart,
  Bookmark,
  TrendingUp,
  Loader2,
  Share2,
  Eye,
} from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  timestamp: string
  qualityScore: number
  concepts: string[]
  isPublic: boolean
  likes: number
  saves: number
  author: string
}

interface EvaluationResult {
  accuracy: number
  clarity: number
  completeness: number
  overallScore: number
  feedback: string
  improvedVersion: string
  missingPoints: string[]
  conceptMap: { concept: string; connections: string[] }[]
  formulaSummary: string[]
}

export default function TeachBack() {
  const [noteContent, setNoteContent] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null)
  const [myNotes, setMyNotes] = useState<Note[]>([])
  const [publicNotes, setPublicNotes] = useState<Note[]>([])
  const [activeTab, setActiveTab] = useState<'create' | 'my-notes' | 'public'>('create')

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser')
      return
    }

    setIsRecording(true)
    // Simulate speech-to-text
    setTimeout(() => {
      setNoteContent(
        (prev) =>
          prev +
          ' Water hardness is caused by the presence of calcium and magnesium ions. Temporary hardness can be removed by boiling, while permanent hardness requires chemical treatment like ion exchange or EDTA complexation.'
      )
      setIsRecording(false)
    }, 3000)
  }

  const handleEvaluate = async () => {
    if (!noteContent.trim() || !noteTitle.trim()) return

    setIsEvaluating(true)
    try {
      const response = await fetch('/api/ai/evaluate-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Evaluation failed')
      }

      const result: EvaluationResult = await response.json()
      setEvaluationResult(result)
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback to simulated evaluation
      const result: EvaluationResult = {
        accuracy: 85,
        clarity: 78,
        completeness: 72,
        overallScore: 78,
        feedback:
          'Good understanding of basic concepts! Your notes cover the main points about water hardness. Consider adding more details about the EDTA titration method and pH effects.',
        improvedVersion:
          '# Water Hardness\n\n## Definition\nWater hardness is caused by the presence of dissolved calcium (Ca²⁺) and magnesium (Mg²⁺) ions in water.\n\n## Types\n1. **Temporary Hardness**: Caused by bicarbonates. Removed by boiling.\n2. **Permanent Hardness**: Caused by sulfates and chlorides. Requires chemical treatment.\n\n## Measurement Methods\n- EDTA Titration (most common)\n- Soap Test\n- Atomic Absorption Spectroscopy\n\n## Treatment Methods\n- Ion Exchange\n- Lime-Soda Process\n- Reverse Osmosis',
        missingPoints: [
          'EDTA titration procedure details',
          'pH buffer importance (pH 10)',
          'Eriochrome Black T indicator mechanism',
          'Calculation formula for hardness',
        ],
        conceptMap: [
          { concept: 'Water Hardness', connections: ['Calcium', 'Magnesium', 'EDTA'] },
          { concept: 'EDTA', connections: ['Complexation', 'Titration', 'Indicator'] },
          { concept: 'Temporary Hardness', connections: ['Bicarbonates', 'Boiling'] },
        ],
        formulaSummary: [
          'Hardness (ppm) = (Volume of EDTA × Molarity × 1000) / Volume of Sample',
          '1° Hardness = 1 mg CaCO₃ per liter',
        ],
      }
      setEvaluationResult(result)
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleSaveNote = () => {
    if (!noteContent.trim() || !noteTitle.trim() || !evaluationResult) return

    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: noteTitle,
      content: noteContent,
      timestamp: new Date().toISOString(),
      qualityScore: evaluationResult.overallScore,
      concepts: evaluationResult.conceptMap.map((c) => c.concept),
      isPublic: false,
      likes: 0,
      saves: 0,
      author: 'Student',
    }

    setMyNotes([newNote, ...myNotes])
    setNoteContent('')
    setNoteTitle('')
    setEvaluationResult(null)
    alert('Note saved successfully!')
  }

  const handlePublish = (noteId: string) => {
    const note = myNotes.find((n) => n.id === noteId)
    if (!note) return

    note.isPublic = true
    setPublicNotes([note, ...publicNotes])
    setMyNotes(myNotes.filter((n) => n.id !== noteId))
    alert('Note published! It will be visible to other students.')
  }

  const handleLike = (noteId: string) => {
    const note = publicNotes.find((n) => n.id === noteId)
    if (note) {
      note.likes++
      setPublicNotes([...publicNotes])
    }
  }

  const handleSave = (noteId: string) => {
    const note = publicNotes.find((n) => n.id === noteId)
    if (note) {
      note.saves++
      setPublicNotes([...publicNotes])
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Teach-Back Learning</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create notes, get AI feedback, and learn by teaching others
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`pb-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'create'
                  ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Create Note
            </button>
            <button
              onClick={() => setActiveTab('my-notes')}
              className={`pb-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'my-notes'
                  ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              My Notes ({myNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`pb-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'public'
                  ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Top Student Explanations ({publicNotes.length})
            </button>
          </nav>
        </div>

        {/* Create Note Tab */}
        {activeTab === 'create' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Your Note</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="e.g., Water Hardness and EDTA Titration"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content (Text or Voice)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={handleVoiceInput}
                        disabled={isRecording}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50"
                      >
                        <Mic className={`w-4 h-4 ${isRecording ? 'text-red-600 animate-pulse' : ''}`} />
                        {isRecording ? 'Recording...' : 'Voice Input'}
                      </button>
                    </div>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Type your notes here or use voice input. Explain the topic as if teaching someone else..."
                      className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    onClick={handleEvaluate}
                    disabled={!noteContent.trim() || !noteTitle.trim() || isEvaluating}
                    className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Get AI Evaluation
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Evaluation Results */}
            <div className="space-y-4">
              {evaluationResult ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">AI Evaluation</h2>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        <span className="text-2xl font-bold text-primary-600">
                          {evaluationResult.overallScore}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                        <p className="text-xl font-bold text-blue-600">
                          {evaluationResult.accuracy}%
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Clarity</p>
                        <p className="text-xl font-bold text-green-600">
                          {evaluationResult.clarity}%
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Completeness</p>
                        <p className="text-xl font-bold text-purple-600">
                          {evaluationResult.completeness}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Feedback</h3>
                        <p className="text-gray-700 text-sm">{evaluationResult.feedback}</p>
                      </div>

                      {evaluationResult.missingPoints.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            Missing Key Points
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {evaluationResult.missingPoints.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Improved Version</h3>
                        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                          {evaluationResult.improvedVersion}
                        </div>
                      </div>

                      {evaluationResult.formulaSummary.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Key Formulas</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {evaluationResult.formulaSummary.map((formula, idx) => (
                              <li key={idx} className="font-mono">{formula}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={handleSaveNote}
                        className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Create a note and click "Get AI Evaluation" to see feedback here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Notes Tab */}
        {activeTab === 'my-notes' && (
          <div className="space-y-4">
            {myNotes.length > 0 ? (
              myNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{note.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Quality Score: {note.qualityScore}%
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {note.concepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                    <button
                      onClick={() => handlePublish(note.id)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition ml-4"
                    >
                      <Share2 className="w-4 h-4" />
                      Publish
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No notes yet. Create your first note!</p>
              </div>
            )}
          </div>
        )}

        {/* Public Notes Tab */}
        {activeTab === 'public' && (
          <div className="space-y-4">
            {publicNotes.length > 0 ? (
              publicNotes
                .sort((a, b) => b.likes + b.saves - (a.likes + a.saves))
                .map((note) => (
                  <div
                    key={note.id}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{note.title}</h3>
                          <span className="text-sm text-gray-500">by {note.author}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Score: {note.qualityScore}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {note.concepts.map((concept, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleLike(note.id)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                      >
                        <Heart className="w-4 h-4" />
                        {note.likes}
                      </button>
                      <button
                        onClick={() => handleSave(note.id)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                      >
                        <Bookmark className="w-4 h-4" />
                        {note.saves}
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center py-12">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No public notes yet. Be the first to publish!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

