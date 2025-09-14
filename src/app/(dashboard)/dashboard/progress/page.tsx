"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ProgressChart from "@/components/dashboard/ProgressChart"
import { HabitCategory } from "@prisma/client"
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  CalendarIcon
} from "@heroicons/react/24/outline"
import { Flame, CheckCircle } from "lucide-react"

interface ProgressData {
  timeSeriesData: Array<{
    date: string
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
  }>
  totalStats: {
    totalPoints: number
    averageDaily: number
    bestStreak: number
    currentStreak: number
    totalHabits: number
    completionRate: number
    activeDays: number
    totalDays: number
  }
  categoryStats: Array<{
    category: HabitCategory
    name: string
    icon: string
    completed: number
    total: number
    percentage: number
    habits: number
  }>
  milestones: Array<{
    name: string
    date: string
    icon: string
    achieved: boolean
    description: string
  }>
  quickStats: {
    daysActive: number
    uniqueHabits: number
    bestDay: {
      totalPoints: number
      date: string
    }
    favoriteCategory: string
    totalTime: number
  }
  currentStreak: number
  habits: Array<{
    id: string
    name: string
    category: HabitCategory
    points: number
    color: string
    icon: string
  }>
  streaks: Array<{
    id: string
    length: number
    habit: {
      id: string
      name: string
      category: HabitCategory
      points: number
      color: string
      icon: string
    }
  }>
}

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          setError("No autenticado")
          setLoading(false)
          return
        }

        const response = await fetch(`/api/progress?timeRange=${timeRange}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProgressData(data)
        } else {
          setError("Error al cargar los datos de progreso")
        }
      } catch (error) {
        console.error("Error fetching progress data:", error)
        setError("Error al cargar los datos de progreso")
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [timeRange])

  const getCategoryColor = (category: HabitCategory) => {
    const colors = {
      [HabitCategory.MORNING_ROUTINE]: 'bg-blue-500',
      [HabitCategory.PHYSICAL_TRAINING]: 'bg-red-500',
      [HabitCategory.NUTRITION]: 'bg-green-500',
      [HabitCategory.DEEP_WORK]: 'bg-orange-500',
      [HabitCategory.PERSONAL_DEVELOPMENT]: 'bg-purple-500',
      [HabitCategory.SOCIAL_CHARISMA]: 'bg-pink-500',
      [HabitCategory.REFLECTION]: 'bg-indigo-500',
      [HabitCategory.SLEEP_RECOVERY]: 'bg-slate-500',
    }
    return colors[category]
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
          <p className="text-gray-600">Cargando tu progreso...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !progressData) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChartBarIcon className="w-8 h-8 text-red-600" />
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
                Progreso y Estadísticas 📊
              </h1>
              <p className="text-gray-600 text-lg">Analiza tu evolución y rendimiento a lo largo del tiempo</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-yellow-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Puntos Totales</p>
                  <p className="text-2xl font-bold text-yellow-600">{progressData.totalStats.totalPoints.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-600/10 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Promedio Diario</p>
                  <p className="text-2xl font-bold text-blue-600">{progressData.totalStats.averageDaily}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-orange-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Mejor Racha</p>
                  <p className="text-2xl font-bold text-orange-600">{progressData.totalStats.bestStreak} días</p>
                </div>
                <div className="w-12 h-12 bg-orange-600/10 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Tasa de Completación</p>
                  <p className="text-2xl font-bold text-green-600">{progressData.totalStats.completionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Evolución Temporal</h2>
                  <div className="flex gap-2">
                    {[
                      { key: 'week', label: '7D' },
                      { key: 'month', label: '30D' },
                      { key: 'year', label: '1A' }
                    ].map((range) => (
                      <button
                        key={range.key}
                        onClick={() => setTimeRange(range.key as typeof timeRange)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          timeRange === range.key
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ProgressChart 
                  weeklyData={progressData.timeSeriesData}
                  currentStreak={progressData.currentStreak}
                />
              </div>
            </motion.div>

            {/* Category Performance */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg mt-8"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Rendimiento por Categoría</h2>
                <p className="text-gray-600">Tu progreso en cada área de desarrollo</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {progressData.categoryStats.map((stat) => (
                    <div key={stat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${getCategoryColor(stat.category)} flex items-center justify-center`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{stat.name}</p>
                          <p className="text-sm text-gray-600">{stat.completed}/{stat.total} completados</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getCategoryColor(stat.category)}`}
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right text-gray-900">{stat.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Hitos y Logros
                </h2>
                <p className="text-gray-600">Celebra tus logros y mantén la motivación</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {progressData.milestones.map((milestone, index) => (
                    <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                      milestone.achieved ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {milestone.achieved ? '✓' : milestone.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${milestone.achieved ? 'text-green-800' : 'text-gray-700'}`}>
                          {milestone.name}
                        </p>
                        <p className="text-xs text-gray-500">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Estadísticas Rápidas</h2>
                <p className="text-gray-600">Resumen de tu actividad</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Días activos</span>
                    <span className="font-bold text-gray-900">{progressData.quickStats.daysActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hábitos únicos</span>
                    <span className="font-bold text-gray-900">{progressData.quickStats.uniqueHabits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mejor día</span>
                    <span className="font-bold text-gray-900">{progressData.quickStats.bestDay?.totalPoints || 0} puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría favorita</span>
                    <span className="font-bold text-gray-900">{progressData.quickStats.favoriteCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo total</span>
                    <span className="font-bold text-gray-900">{progressData.quickStats.totalTime}h</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Motivational Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">¡Sigue así! 🔥</h3>
              <p className="text-gray-700 text-sm mb-4">
                {progressData.currentStreak >= 14 
                  ? "Estás en una excelente racha. Solo necesitas 7 días más para alcanzar tu récord personal."
                  : "Cada día cuenta. Mantén la consistencia y verás resultados increíbles."
                }
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-500">🎯</span>
                <span className="text-gray-700">
                  {progressData.currentStreak >= 21 
                    ? "Próximo objetivo: 30 días consecutivos"
                    : "Próximo objetivo: 21 días consecutivos"
                  }
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 