import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { useCandidate, useUpdateCandidateStage } from '@/hooks/useCanditates'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Star,
  Download,
  Briefcase,
  MessageSquare,
  AtSign,
  Send
} from 'lucide-react'
import LoadingAnimation from '@/components/Animations/LoadingAnimation'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const STAGES = [
  { id: 'applied', label: 'Applied', color: 'bg-blue-500', description: 'Candidate has applied' },
  { id: 'screening', label: 'Screening', color: 'bg-purple-500', description: 'Initial resume screening' },
  { id: 'interview', label: 'Interview', color: 'bg-yellow-500', description: 'Interview phase' },
  { id: 'technical', label: 'Technical', color: 'bg-orange-500', description: 'Technical assessment' },
  { id: 'offer', label: 'Offer', color: 'bg-green-500', description: 'Offer extended' },
  { id: 'hired', label: 'Hired', color: 'bg-emerald-500', description: 'Candidate hired' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-500', description: 'Candidate rejected' },
]

// Mock team members for @mentions
const TEAM_MEMBERS = [
  { id: '1', name: 'John Doe', role: 'Recruiter', email: 'john@company.com' },
  { id: '2', name: 'Jane Smith', role: 'Hiring Manager', email: 'jane@company.com' },
  { id: '3', name: 'Mike Johnson', role: 'Tech Lead', email: 'mike@company.com' },
  { id: '4', name: 'Sarah Wilson', role: 'HR Manager', email: 'sarah@company.com' },
]

interface Note {
  id: string
  content: string
  author: string
  timestamp: Date
  mentions: string[]
}

// Candidate Card Component
function CandidateCard({ candidate, isDragging }: { candidate: any; isDragging?: boolean }) {
  return (
    <div className={`
      p-3 rounded-lg border transition-all
      ${isDragging
        ? 'rotate-6 shadow-2xl bg-white dark:bg-gray-700 scale-105'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:shadow-md'
      }
    `}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {candidate.firstName} {candidate.lastName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{candidate.email}</p>
        </div>
        {candidate.rating && (
          <div className="flex items-center gap-1 text-amber-500 ml-2">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold">{candidate.rating}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
        <span>{candidate.jobId}</span>
      </div>
    </div>
  )
}

// Sortable Candidate Card
function SortableCandidateCard({ candidate }: { candidate: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <CandidateCard candidate={candidate} isDragging={isDragging} />
    </div>
  )
}

// Stage Column Component
function StageColumn({ stage, candidates, isOver, isDark }: {
  stage: typeof STAGES[number];
  candidates: any[];
  isOver: boolean;
  isDark: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: stage.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        shrink-0 w-72 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all
        ${isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isDark ? 'border border-gray-700' : 'border border-gray-200'}
      `}
    >
      {/* Stage Header */}
      <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg ${stage.color} text-white`}>
        <div className="flex-1">
          <h3 className="font-semibold">{stage.label}</h3>
          <p className="text-sm opacity-90">{stage.description}</p>
        </div>
        <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm font-semibold">
          {candidates.length}
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-3 min-h-[100px]">
        <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {candidates.map(candidate => (
            <SortableCandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>

        {candidates.length === 0 && (
          <div className={`text-center py-8 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'
            }`}>
            <div className="text-sm">Drop candidate here</div>
          </div>
        )}
      </div>
    </div>
  )
}

function CandidateDetail() {
  const { id } = useParams<{ id: string }>()
  const { isDark } = useTheme()
  const { data: candidate, isLoading, error } = useCandidate(id!)
  const updateStageMutation = useUpdateCandidateStage()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')

  // Use the actual candidate data from the API
  const [candidatesByStage, setCandidatesByStage] = useState<Record<string, any[]>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const gradientText = isDark
    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
    : "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"

  // Initialize candidates data from the actual candidate
  useEffect(() => {
    if (candidate) {
      // Create candidatesByStage structure with the actual candidate
      const candidatesByStage: Record<string, any[]> = {}

      // Initialize all stages as empty arrays
      STAGES.forEach(stage => {
        candidatesByStage[stage.id] = []
      })

      // Add the current candidate to their current stage
      if (candidate.stage && candidatesByStage[candidate.stage]) {
        candidatesByStage[candidate.stage] = [candidate]
      } else {
        // Fallback to 'applied' stage if stage is not set
        candidatesByStage.applied = [candidate]
      }

      setCandidatesByStage(candidatesByStage)
    }
  }, [candidate])

  // Load mock notes
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: '1',
        content: 'Great candidate! Strong background in React and TypeScript. @John Doe please schedule interview.',
        author: 'Jane Smith',
        timestamp: new Date('2024-01-15T10:30:00'),
        mentions: ['John Doe']
      },
      {
        id: '2',
        content: 'Technical assessment completed. Scores: React 9/10, Node.js 8/10. @Mike Johnson for next round.',
        author: 'Mike Johnson',
        timestamp: new Date('2024-01-16T14:20:00'),
        mentions: ['Mike Johnson']
      }
    ]
    setNotes(mockNotes)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: any) => {
    const { over } = event
    setOverId(over?.id || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)
    setOverId(null)

    if (!over) return

    const candidateId = active.id as string
    const newStageId = over.id as string

    // Find the candidate being dragged
    let draggedCandidate: any = null
    let oldStageId = ''

    for (const [stageId, candidates] of Object.entries(candidatesByStage)) {
      const candidate = candidates.find(c => c.id === candidateId)
      if (candidate) {
        draggedCandidate = candidate
        oldStageId = stageId
        break
      }
    }

    if (!draggedCandidate || oldStageId === newStageId) return

    try {

      // Update local state optimistically first
      setCandidatesByStage(prev => {
        const newState = { ...prev }

        // Remove from old stage
        newState[oldStageId] = newState[oldStageId].filter(c => c.id !== candidateId)

        // Add to new stage
        newState[newStageId] = [...newState[newStageId], draggedCandidate]

        return newState
      })

      // Then update in backend
      await updateStageMutation.mutateAsync({
        id: candidateId,
        stage: newStageId as "applied" | "screening" | "interview" | "technical" | "offer" | "hired" | "rejected"
      })


    } catch (error) {
      console.error('Failed to update stage:', error)

      // Revert optimistic update on error
      setCandidatesByStage(prev => {
        const newState = { ...prev }

        // Remove from new stage (where we optimistically added)
        newState[newStageId] = newState[newStageId].filter(c => c.id !== candidateId)

        // Add back to old stage
        newState[oldStageId] = [...newState[oldStageId], draggedCandidate]

        return newState
      })

      // Show error message to user
      alert(`Failed to update stage: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setOverId(null)
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNewNote(value)

    const lastAtSymbol = value.lastIndexOf('@')
    if (lastAtSymbol !== -1) {
      const query = value.slice(lastAtSymbol + 1).split(' ')[0]
      setMentionQuery(query)
      setShowMentions(query.length > 0)
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (memberName: string) => {
    const lastAtSymbol = newNote.lastIndexOf('@')
    if (lastAtSymbol !== -1) {
      const before = newNote.slice(0, lastAtSymbol)
      const after = newNote.slice(lastAtSymbol).split(' ').slice(1).join(' ')
      setNewNote(`${before}@${memberName} ${after}`.trim())
    }
    setShowMentions(false)
    setMentionQuery('')
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const mentions = Array.from(newNote.matchAll(/@(\w+\s?\w+)/g)).map(match => match[1])

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User',
      timestamp: new Date(),
      mentions
    }

    setNotes(prev => [note, ...prev])
    setNewNote('')
    setShowMentions(false)
  }

  const filteredMembers = TEAM_MEMBERS.filter(member =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  const renderNoteContent = (content: string) => {
    const parts = content.split(/(@\w+\s?\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const name = part.slice(1)
        const member = TEAM_MEMBERS.find(m => m.name === name)
        return (
          <span
            key={index}
            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 rounded mx-1"
            title={member?.email}
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  // Get the currently dragged candidate
  const activeCandidate = activeId ? Object.values(candidatesByStage).flat().find(c => c.id === activeId) : null

  if (isLoading) return <LoadingAnimation />
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error.message}</div>
  if (!candidate) return <div className="text-center mt-10">Candidate not found</div>

  return (
    <div
      className={`min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'
        }`}
    >

      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/candidates"
          className={`inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-2 rounded-lg transition-colors ${isDark
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
        >
          <ArrowLeft size={18} />
          <span className="text-sm sm:text-base">Back to Candidates</span>
        </Link>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Candidate Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex-1 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white/80 border border-gray-200'
              }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <User size={28} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${gradientText} wrap-break-word`}>
                  {candidate.firstName} {candidate.lastName}
                </h1>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={18} className="text-gray-500 shrink-0" />
                  <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400 break-all">
                    {candidate.email}
                  </span>
                </div>
              </div>
              {candidate.rating && (
                <div className="flex items-center gap-1 text-amber-500 self-start sm:self-auto">
                  <Star size={20} fill="currentColor" />
                  <span className="text-lg sm:text-xl font-bold">{candidate.rating}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-gray-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Job ID: {candidate.jobId}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  Created {new Date(candidate.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Tags */}
            {candidate.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {candidate.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${isDark
                      ? 'bg-cyan-400/20 text-cyan-300'
                      : 'bg-purple-100 text-purple-700'
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Resume Download */}
          {candidate.resumeUrl && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white/80 border border-gray-200'
                }`}
            >
              <button
                onClick={() => window.open(candidate.resumeUrl, '_blank')}
                className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-colors w-full sm:w-auto ${isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
              >
                <Download size={20} />
                <div className="text-left">
                  <div className="font-semibold text-sm sm:text-base">Download Resume</div>
                  <div className="text-xs sm:text-sm opacity-90">PDF Document</div>
                </div>
              </button>
            </motion.div>
          )}
        </div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${gradientText}`}>Application Pipeline</h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Drag the candidate between stages to update their progress
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="flex overflow-x-auto pb-4 sm:pb-6 gap-4 sm:gap-6 px-1">
              {STAGES.map(stage => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  candidates={candidatesByStage[stage.id] || []}
                  isOver={overId === stage.id}
                  isDark={isDark}
                />
              ))}
            </div>

            <DragOverlay>
              {activeCandidate ? (
                <div className="w-72">
                  <CandidateCard candidate={activeCandidate} isDragging />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </motion.div>

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white/80 border border-gray-200'
            }`}
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <MessageSquare className={gradientText} size={20} />
            <h2 className={`text-xl sm:text-2xl font-bold ${gradientText}`}>Notes & Comments</h2>
          </div>

          {/* Add Note Form */}
          <div className="mb-6 sm:mb-8">
            <div className="relative">
              <textarea
                value={newNote}
                onChange={handleNoteChange}
                placeholder="Add a note... Use @ to mention team members"
                rows={3}
                className={`w-full p-3 sm:p-4 rounded-lg border resize-none text-sm sm:text-base ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />

              {/* Mentions Dropdown */}
              {showMentions && (
                <div className={`absolute bottom-full mb-2 w-full max-w-md rounded-lg shadow-lg border z-10 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}>
                  <div className="p-2 max-h-48 overflow-y-auto">
                    {filteredMembers.map(member => (
                      <button
                        key={member.id}
                        onClick={() => insertMention(member.name)}
                        className={`w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${isDark ? 'text-white' : 'text-gray-900'
                          }`}
                      >
                        <div className="font-medium text-sm sm:text-base">{member.name}</div>
                        <div className="text-xs sm:text-sm opacity-70">{member.role} • {member.email}</div>
                      </button>
                    ))}
                    {filteredMembers.length === 0 && (
                      <div className={`p-2 text-center text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No team members found
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <AtSign size={14} />
                  Type @ to mention team members
                </div>
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto justify-center"
                >
                  <Send size={14} />
                  <span className="text-sm sm:text-base">Add Note</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3 sm:space-y-4">
            {notes.length === 0 ? (
              <div className={`text-center py-6 sm:py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No notes yet. Add the first note to start the conversation.</p>
              </div>
            ) : (
              notes.map(note => (
                <div
                  key={note.id}
                  className={`p-3 sm:p-4 rounded-lg border ${isDark
                    ? 'bg-gray-700/50 border-gray-600'
                    : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div className={`${gradientText} font-semibold text-sm sm:text-base inline-block`}>
                      {note.author}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {note.timestamp.toLocaleDateString()} at{' '}
                      {note.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {/* ✅ Correct gradient usage */}
                  <p className={`${gradientText} text-sm sm:text-base leading-relaxed`}>
                    {renderNoteContent(note.content)}
                  </p>

                  {note.mentions.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <AtSign size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Mentioned: {note.mentions.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CandidateDetail