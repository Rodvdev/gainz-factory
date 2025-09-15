// Types for calendar API Prisma query results
export interface CalendarEventWithRelations {
  id: string
  userId: string
  type: string
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  location: string | null
  programmeId: string | null
  programme: {
    id: string
    title: string
  } | null
  teamMemberId: string | null
  teamMember: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
  } | null
  isRecurring: boolean
  recurrence: unknown | null
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface HabitEntryWithHabit {
  id: string
  habitId: string
  date: Date
  status: string
  value: number | null
  textValue: string | null
  note: string | null
  timeSpent: number | null
  difficulty: number | null
  mood: number | null
  createdAt: Date
  habit: {
    id: string
    name: string
    description: string | null
    category: string
  }
}

export interface ChallengeWithRelations {
  id: string
  userId: string
  name: string
  description: string | null
  category: string | null
  startDate: Date
  endDate: Date
  targetValue: number
  currentValue: number
  isCompleted: boolean
  reward: string | null
  createdAt: Date
}

export interface TaskSubmissionWithRelations {
  id: string
  userId: string
  taskId: string
  status: string
  score: number | null
  feedback: string | null
  completedAt: Date
  createdAt: Date
  task: {
    id: string
    title: string
    description: string | null
    taskType: string
    weeklyPlan: {
      programmeId: string
      programme: {
        id: string
        title: string
      }
    }
  }
}

export interface ProgressMetricsWithRelations {
  id: string
  userId: string
  metricType: string
  value: number
  unit: string
  date: Date
  notes: string | null
  photoUrl: string | null
  isPrivate: boolean
  createdAt: Date
}
