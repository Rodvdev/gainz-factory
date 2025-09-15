// Types for stats API Prisma query results
export interface UserWithStats {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: Date
  userLevel: {
    currentLevel: number
    totalXP: number
    levelName: string
    avatarEmoji: string
    totalPoints: number
    longestStreak: number
    achievementsUnlocked: number
  } | null
  dailyScores: DailyScoreWithStats[]
  habits: HabitWithStats[]
  userAchievements: UserAchievementWithStats[]
  userProgrammes: UserProgrammeWithStats[]
  taskSubmissions: TaskSubmissionWithStats[]
  progressMetrics: ProgressMetricWithStats[]
  challenges: ChallengeWithStats[]
}

export interface DailyScoreWithStats {
  id: string
  date: Date
  totalPoints: number
  completedHabits: number
  totalHabits: number
  morningScore: number
  physicalScore: number
  nutritionScore: number
  workScore: number
  developmentScore: number
  socialScore: number
  reflectionScore: number
  sleepScore: number
  percentile: number | null
  rank: number | null
  createdAt: Date
}

export interface HabitWithStats {
  id: string
  name: string
  category: string
  entries: HabitEntryWithStats[]
  streaks: HabitStreakWithStats[]
}

export interface HabitEntryWithStats {
  id: string
  date: Date
  status: string
  value: number | null
  textValue: string | null
  note: string | null
  timeSpent: number | null
  difficulty: number | null
  mood: number | null
  createdAt: Date
}

export interface HabitStreakWithStats {
  id: string
  startDate: Date
  endDate: Date | null
  length: number
  isActive: boolean
  createdAt: Date
}

export interface UserAchievementWithStats {
  id: string
  unlockedAt: Date
  achievement: {
    id: string
    title: string
    description: string
    icon: string
    rarity: string
  }
}

export interface UserProgrammeWithStats {
  id: string
  status: string
  programme: {
    id: string
    title: string
  }
}

export interface TaskSubmissionWithStats {
  id: string
  status: string
  score: number | null
  feedback: string | null
  completedAt: Date
  createdAt: Date
}

export interface ProgressMetricWithStats {
  id: string
  metricType: string
  value: number
  unit: string
  date: Date
  notes: string | null
  photoUrl: string | null
  isPrivate: boolean
  createdAt: Date
}

export interface ChallengeWithStats {
  id: string
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

export interface HabitSuccessRate {
  id: string
  name: string
  category: string
  successRate: number
  totalEntries: number
  completedEntries: number
}

export interface RecentAchievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: string
  unlockedAt: Date
}

export interface LatestMetric {
  value: number
  unit: string
  date: Date
}

export interface Last30DaysStats {
  points: number
  averageScore: number
  activeDays: number
}

export interface UserStatsResponse {
  // Estadísticas principales
  totalDays: number
  daysSinceRegistration: number
  currentStreak: number
  longestStreak: number
  totalPoints: number
  averageScore: number
  completedHabits: number
  
  // Programas y tareas
  completedProgrammes: number
  activeProgrammes: number
  completedTasks: number
  
  // Logros y desafíos
  achievementsUnlocked: number
  completedChallenges: number
  recentAchievements: RecentAchievement[]
  
  // Nivel y gamificación
  level: number
  levelName: string
  avatarEmoji: string
  totalXP: number
  
  // Progreso físico
  latestWeight: LatestMetric | null
  latestBodyFat: LatestMetric | null
  latestMuscleMass: LatestMetric | null
  
  // Estadísticas de período
  last30Days: Last30DaysStats
  
  // Análisis detallado
  habitSuccessRates: HabitSuccessRate[]
  progressTrend: 'up' | 'down' | 'stable'
  
  // Satisfacción estimada
  satisfaction: number
}
