"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DailyScore from "@/components/dashboard/DailyScore"
import ProgressChart from "@/components/dashboard/ProgressChart"
import ActiveStreaks from "@/components/dashboard/ActiveStreaks"
import ChallengeCard from "@/components/challenges/ChallengeCard"
import WallOfGains from "@/components/dashboard/WallOfGains"
import MotivationalQuote, { useMotivationalQuote } from "@/components/dashboard/MotivationalQuote"
import AvatarEvolution from "@/components/dashboard/AvatarEvolution"
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
  Zap,
  TrendingUp,
  Dumbbell,
  ChefHat,
  BookOpen
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
  bio?: string
  profileImageUrl?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  rarity: "common" | "rare" | "epic" | "legendary"
  category: "streak" | "habits" | "challenges" | "milestone"
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
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Gamification data
  const [userLevel, setUserLevel] = useState(1)
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  
  // Motivational content
  const motivationalQuote = useMotivationalQuote()

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

        // Fetch complete dashboard data from API
        const dashboardResponse = await fetch("/api/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json()
          
          // Set all data from API
          setUserData(dashboardData.user)
          setDailyScore(dashboardData.dailyScore)
          setHabits(dashboardData.habits || [])
          setChallenges(dashboardData.challenges || [])
          setStreaks(dashboardData.streaks || [])
          setAchievements(dashboardData.achievements || [])
          
          // Set gamification data
          setUserLevel(dashboardData.userLevel.currentLevel)
          setTotalPoints(dashboardData.stats.totalPoints)
          setCurrentStreak(dashboardData.stats.currentStreak)
          
        } else {
          throw new Error("Error al cargar datos del dashboard")
        }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-orange-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-6"
              >
                <div className="text-6xl mb-4">🔥</div>
                <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent mb-4">
                  VAMOS POR ESOS GAINZ YIJU!
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {getGreeting()}, <span className="text-orange-400">{userData?.firstName || "Transformer"}</span>!
                </h2>
                <p className="text-gray-300 text-lg capitalize">{currentDate}</p>
                
                {userData?.personalManifesto && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-6 p-6 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl backdrop-blur-sm"
                  >
                    <p className="text-orange-200 text-lg font-medium italic">
                      &ldquo;{userData.personalManifesto}&rdquo;
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gamification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* User Level & Avatar */}
          <div className="lg:col-span-1">
            <AvatarEvolution
              level={userLevel}
              totalPoints={totalPoints}
              currentStreak={currentStreak}
              isActive={true}
            />
          </div>
          
          {/* Motivational Quote */}
          <div className="lg:col-span-2">
            <MotivationalQuote
              quote={motivationalQuote.quote}
              author={motivationalQuote.author}
              category={motivationalQuote.category}
              isDaily={true}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group relative p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm font-medium">Puntos Hoy</p>
                  <p className="text-3xl font-black text-orange-400">{getTotalPoints()}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group relative p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Hábitos Completados</p>
                  <p className="text-3xl font-black text-green-400">
                    {getCompletedHabitsToday()}/{getTotalHabits()}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group relative p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm font-medium">Racha Actual</p>
                  <p className="text-3xl font-black text-yellow-400">{getCurrentStreak()} días</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Flame className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group relative p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Desafíos Activos</p>
                  <p className="text-3xl font-black text-purple-400">{challenges.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Wall of Gains Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8">
            <WallOfGains
              achievements={achievements}
              totalAchievements={achievements.length}
              recentAchievements={achievements.slice(0, 5)}
            />
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
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl"
            >
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                  Puntuación Diaria
                </h2>
                <p className="text-gray-300">Tu rendimiento de hoy por categorías</p>
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
                    <p className="text-gray-300 mb-6">Completa algunos hábitos para ver tu puntuación diaria</p>
                    <Link
                      href="/dashboard/habits"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
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
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl"
            >
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  Progreso Semanal
                </h2>
                <p className="text-gray-300">Tu evolución en los últimos 7 días</p>
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
              transition={{ delay: 1.0, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl"
            >
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  Rachas Activas
                </h2>
                <p className="text-gray-300">Mantén el impulso</p>
              </div>
              <div className="p-6">
                {streaks.length > 0 ? (
                  <ActiveStreaks streaks={streaks} />
                ) : (
                  <div className="text-center py-8">
                    <Flame className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-6">Comienza un hábito para ver tu racha</p>
                    <Link
                      href="/dashboard/habits"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
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
              transition={{ delay: 1.2, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl"
            >
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-orange-400" />
                  Desafíos Activos
                </h2>
                <p className="text-gray-300">Completa tus objetivos</p>
              </div>
              <div className="p-6 space-y-4">
                {challenges.length > 0 ? (
                  challenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-6">Comienza un desafío para acelerar tu progreso</p>
                    <Link
                      href="/dashboard/challenges"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
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
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 backdrop-blur-sm rounded-2xl border border-orange-500/30 p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6 text-center bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🚀 ACCIONES RÁPIDAS 🚀
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard/habits" className="group p-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-3 min-h-[100px]">
                  <Clock className="w-8 h-8 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="text-sm">Log Rápido</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard/habits" className="group p-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-3 min-h-[100px]">
                  <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="text-sm">Nuevo Hábito</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard/challenges" className="group p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-3 min-h-[100px]">
                  <Trophy className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm">Ver Desafíos</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard/progress" className="group p-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-3 min-h-[100px]">
                  <BarChart3 className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm">Estadísticas</span>
                </Link>
              </motion.div>
            </div>
            
            {/* Additional Quick Actions */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/dashboard/workouts" className="group p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 text-green-300 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Entrenos
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/dashboard/recipes" className="group p-4 bg-gradient-to-r from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 border border-pink-500/30 text-pink-300 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Recetas
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/blog" className="group p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/30 text-indigo-300 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 md:col-span-1 col-span-2">
                  <BookOpen className="w-5 h-5" />
                  Blog GF
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 