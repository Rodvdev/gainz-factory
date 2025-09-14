// Tipos base para eventos del calendario
export interface BaseCalendarEvent {
  id: string
  title: string
  type: string
  startTime: string
  endTime: string
  status: string
  description?: string
  source: string
}

// Eventos del calendario principal
export interface CalendarEvent extends BaseCalendarEvent {
  type: 'workout' | 'nutrition' | 'mindset' | 'session' | 'meeting'
  location?: string
  coach?: string
  programmeId?: string
  programmeTitle?: string
  isRecurring?: boolean
  source: 'calendar'
}

// Eventos de hábitos
export interface HabitEvent extends BaseCalendarEvent {
  type: 'habit'
  habitId: string
  habitCategory: string
  source: 'habit'
}

// Eventos de desafíos
export interface ChallengeEvent extends BaseCalendarEvent {
  type: 'challenge'
  targetValue: number
  currentValue: number
  reward?: string
  source: 'challenge'
}

// Eventos de tareas
export interface TaskEvent extends BaseCalendarEvent {
  type: 'task'
  programmeTitle?: string
  programmeId?: string
  taskType: string
  score?: number
  feedback?: string
  source: 'task'
}

// Eventos de formularios
export interface FormEvent extends BaseCalendarEvent {
  type: 'form'
  formId: string
  source: 'form'
}

// Eventos de programas
export interface ProgrammeEvent extends BaseCalendarEvent {
  type: 'programme'
  programmeId: string
  progress: number
  notes?: string
  source: 'programme'
}

// Eventos de asignaciones
export interface AssignmentEvent extends BaseCalendarEvent {
  type: 'assignment'
  contentType: string
  contentId: string
  dueDate?: string
  completedAt?: string
  source: 'assignment'
}

// Eventos de progreso
export interface ProgressEvent extends BaseCalendarEvent {
  type: 'progress'
  metricType: string
  value: number
  unit: string
  photoUrl?: string
  isPrivate: boolean
  source: 'progress'
}

// Eventos de diario
export interface JournalEvent extends BaseCalendarEvent {
  type: 'journal'
  mood?: number
  prompt?: string
  source: 'journal'
}

// Eventos de metas
export interface GoalEvent extends BaseCalendarEvent {
  type: 'goal'
  goal: string
  targetDate: string
  source: 'goal'
}

// Eventos de tickets
export interface TicketEvent extends BaseCalendarEvent {
  type: 'ticket'
  ticketType: string
  isUsed: boolean
  source: 'ticket'
}

// Eventos de logros
export interface AchievementEvent extends BaseCalendarEvent {
  type: 'achievement'
  achievementId: string
  points: number
  rarity: string
  category: string
  source: 'achievement'
}

// Eventos de asignación de coach
export interface CoachAssignmentEvent extends BaseCalendarEvent {
  type: 'coach-assignment'
  coachName: string
  coachRole: string
  coachSpecialty: string[]
  source: 'coach-assignment'
}

// Eventos de órdenes
export interface OrderEvent extends BaseCalendarEvent {
  type: 'order'
  orderNumber: string
  total: number
  paymentStatus: string
  source: 'order'
}

// Eventos de suscripciones
export interface SubscriptionEvent extends BaseCalendarEvent {
  type: 'subscription'
  planName: string
  planPrice: number
  billingCycle: string
  autoRenew: boolean
  source: 'subscription'
}

// Eventos de blog
export interface BlogEvent extends BaseCalendarEvent {
  type: 'blog'
  slug: string
  views: number
  likes: number
  source: 'blog'
}

// Eventos de foro (topics)
export interface ForumTopicEvent extends BaseCalendarEvent {
  type: 'forum-topic'
  isPinned: boolean
  isLocked: boolean
  views: number
  likes: number
  repliesCount: number
  source: 'forum-topic'
}

// Eventos de foro (respuestas)
export interface ForumReplyEvent extends BaseCalendarEvent {
  type: 'forum-reply'
  topicTitle: string
  isSolution: boolean
  source: 'forum-reply'
}

// Unión de todos los tipos de eventos
export type CalendarEventUnion = 
  | CalendarEvent
  | HabitEvent
  | ChallengeEvent
  | TaskEvent
  | FormEvent
  | ProgrammeEvent
  | AssignmentEvent
  | ProgressEvent
  | JournalEvent
  | GoalEvent
  | TicketEvent
  | AchievementEvent
  | CoachAssignmentEvent
  | OrderEvent
  | SubscriptionEvent
  | BlogEvent
  | ForumTopicEvent
  | ForumReplyEvent

// Tipos para la respuesta de la API
export interface CalendarResponse {
  events: CalendarEventUnion[]
  total: number
  month: number
  year: number
}

// Tipos para el componente CalendarView
export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEventUnion[]
}

// Configuración de colores por tipo de evento
export interface EventTypeConfig {
  color: string
  bgColor: string
  borderColor: string
  icon: string
}

// Mapeo de tipos de eventos a configuración
export const EVENT_TYPE_CONFIG: Record<string, EventTypeConfig> = {
  // Eventos principales
  'workout': {
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: 'Target'
  },
  'cardio': {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    icon: 'Zap'
  },
  'nutrition': {
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    icon: 'BookOpen'
  },
  'mindset': {
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    icon: 'Star'
  },
  'session': {
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    icon: 'User'
  },
  'meeting': {
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200',
    icon: 'Users'
  },
  
  // Eventos de sistema
  'habit': {
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    icon: 'CheckCircle'
  },
  'challenge': {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    icon: 'Trophy'
  },
  'task': {
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-200',
    icon: 'ClipboardList'
  },
  'form': {
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200',
    icon: 'FileText'
  },
  'programme': {
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
    borderColor: 'border-violet-200',
    icon: 'Calendar'
  },
  'assignment': {
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    icon: 'Assignment'
  },
  'progress': {
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-200',
    icon: 'TrendingUp'
  },
  'journal': {
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-200',
    icon: 'Book'
  },
  'goal': {
    color: 'text-lime-600',
    bgColor: 'bg-lime-100',
    borderColor: 'border-lime-200',
    icon: 'Target'
  },
  'ticket': {
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    icon: 'Ticket'
  },
  'achievement': {
    color: 'text-gold-600',
    bgColor: 'bg-gold-100',
    borderColor: 'border-gold-200',
    icon: 'Award'
  },
  'coach-assignment': {
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-200',
    icon: 'UserCheck'
  },
  'order': {
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    icon: 'ShoppingCart'
  },
  'subscription': {
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200',
    icon: 'CreditCard'
  },
  'blog': {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    icon: 'Edit'
  },
  'forum-topic': {
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    icon: 'MessageSquare'
  },
  'forum-reply': {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: 'Reply'
  }
}
