"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DailyScore from "@/components/dashboard/DailyScore"
import ProgressChart from "@/components/dashboard/ProgressChart"
import ActiveStreaks from "@/components/dashboard/ActiveStreaks"
import ChallengeCard from "@/components/challenges/ChallengeCard"
import { HabitCategory } from "@prisma/client"
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  CheckCircle, 
  Plus, 
  BarChart3,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react"
import Link from "next/link"

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  personalManifesto?: string
  fitnessLevel?: string
  primaryGoals?: string[]
}

interface DailyScoreData {
  id: string
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
  percentile: number
  rank?: number
  date: string
}

interface HabitData {
  id: string
  name: string
  description?: string
  category: HabitCategory
  points: number
  color: string
  icon: string
  isActive: boolean
}

interface ChallengeData {
  id: string
  userId: string
  name: string
  description: string
  category: HabitCategory
  startDate: string
  endDate: string
  targetValue: number
  currentValue: number
  isCompleted: boolean
  reward: string
}

interface StreakData {
  id: string
  habitId: string
  length: number
  startDate: string
  isActive: boolean
  habit: HabitData
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [dailyScore, setDailyScore] = useState<DailyScoreData | null>(null)
  const [habits, setHabits] = useState<HabitData[]>([])
  const [challenges, setChallenges] = useState<ChallengeData[]>([])
  const [streaks, setStreaks] = useState<StreakData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch user data and dashboard information
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          setError("No autenticado")
          setLoading(false)
          return
        }

        // Fetch user data
        const userResponse = await fetch("/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (userResponse.ok) {
          const user = await userResponse.json()
          setUserData(user)
        }

        // Fetch onboarding progress to get complete dashboard data
        const progressResponse = await fetch("/api/onboarding/progress", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          
          // Set habits from progress data
          if (progressData.habits) {
            setHabits(progressData.habits)
          }

          // Set daily score if available
          if (progressData.dailyScore) {
            setDailyScore(progressData.dailyScore)
          }
        }

        // Fetch additional dashboard data
        const [challengesResponse, streaksResponse] = await Promise.all([
          fetch("/api/challenges", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }),
          fetch("/api/streaks", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
        ])

        if (challengesResponse.ok) {
          const challengesData = await challengesResponse.json()
          setChallenges(challengesData.challenges || [])
        }

        if (streaksResponse.ok) {
          const streaksData = await streaksResponse.json()
          setStreaks(streaksData.streaks || [])
        }

        // ProgressChart will fetch its own data from API

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Error al cargar los datos del dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])


  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  const getCurrentStreak = () => {
    if (streaks.length === 0) return 0
    return Math.max(...streaks.map(streak => streak.length))
  }

  const getCompletedHabitsToday = () => {
    return dailyScore?.completedHabits || 0
  }

  const getTotalHabits = () => {
    return dailyScore?.totalHabits || habits.length || 0
  }

  const getTotalPoints = () => {
    return dailyScore?.totalPoints || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
                {getGreeting()}, <span className="text-red-600">{userData?.firstName || "Transformer"}</span>! 🔥
            </h1>
              <p className="text-gray-600 text-lg capitalize">{currentDate}</p>
              
              {userData?.personalManifesto && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 italic">&ldquo;{userData.personalManifesto}&rdquo;</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-gray-600 text-sm">Puntos Hoy</p>
                  <p className="text-2xl font-bold text-red-600">{getTotalPoints()}</p>
                </div>
                <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-red-600" />
              </div>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-gray-600 text-sm">Hábitos Completados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {getCompletedHabitsToday()}/{getTotalHabits()}
                </p>
              </div>
                <div className="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-orange-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-gray-600 text-sm">Racha Actual</p>
                  <p className="text-2xl font-bold text-orange-600">{getCurrentStreak()} días</p>
                </div>
                <div className="w-12 h-12 bg-orange-600/10 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
              </div>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-gray-600 text-sm">Desafíos Activos</p>
                  <p className="text-2xl font-bold text-purple-600">{challenges.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Daily Score */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Puntuación Diaria</h2>
                <p className="text-gray-600">Tu rendimiento de hoy por categorías</p>
              </div>
                             <div className="p-6">
                {dailyScore ? (
                 <DailyScore 
                    score={dailyScore}
                   date={new Date().toISOString().split('T')[0]}
                 />
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">Completa algunos hábitos para ver tu puntuación diaria</p>
                    <Link
                      href="/dashboard/habits"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      Ver mis hábitos
                      <ArrowRight className="w-4 h-4" />
                    </Link>
               </div>
                )}
            </div>
            </motion.div>

            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Progreso Semanal</h2>
                <p className="text-gray-600">Tu evolución en los últimos 7 días</p>
              </div>
                             <div className="p-6">
                <ProgressChart currentStreak={getCurrentStreak()} />
               </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Active Streaks */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Rachas Activas</h2>
                <p className="text-gray-600">Mantén el impulso</p>
              </div>
              <div className="p-6">
                {streaks.length > 0 ? (
                  <ActiveStreaks streaks={streaks} />
                ) : (
                  <div className="text-center py-8">
                    <Flame className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">Comienza un hábito para ver tu racha</p>
                    <Link
                      href="/dashboard/habits"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      <Zap className="w-5 h-5" />
                      Crear hábito
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Active Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Desafíos Activos</h2>
                <p className="text-gray-600">Completa tus objetivos</p>
              </div>
                             <div className="p-6 space-y-4">
                {challenges.length > 0 ? (
                  challenges.map((challenge) => (
                   <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">Comienza un desafío para acelerar tu progreso</p>
                    <Link
                      href="/dashboard/challenges"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      <Trophy className="w-5 h-5" />
                      Ver desafíos
                      <ArrowRight className="w-4 h-4" />
                    </Link>
               </div>
                )}
            </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/habits" className="group p-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                Log Rápido
              </Link>
              <Link href="/dashboard/habits" className="group p-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Nuevo Hábito
              </Link>
              <Link href="/dashboard/challenges" className="group p-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                Ver Desafíos
              </Link>
              <Link href="/dashboard/progress" className="group p-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estadísticas
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 