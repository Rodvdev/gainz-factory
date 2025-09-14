"use client"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { HabitCategory, TrackingType } from "@prisma/client"
import { 
  Plus, 
  BarChart3, 
  Flame, 
  Star, 
  CheckCircle,
  Target,
  Filter,
  RefreshCw,
  ArrowRight,
  Zap
} from "lucide-react"
import Link from "next/link"

interface Habit {
  id: string
  name: string
  description?: string
  category: HabitCategory
  trackingType: TrackingType
  targetCount: number
  points: number
  color: string
  icon?: string
  isActive: boolean
  order: number
  currentStreak: number
  completedToday: boolean
  schedule?: {
    timeSlot: string
    specificTime: string
    daysOfWeek: string[]
    reminderEnabled: boolean
  } | null  
  createdAt: string
  updatedAt: string
}

interface HabitsStats {
  totalCount: number
  activeCount: number
  completedTodayCount: number
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [stats, setStats] = useState<HabitsStats>({ totalCount: 0, activeCount: 0, completedTodayCount: 0 })
  const [activeCategory, setActiveCategory] = useState<HabitCategory | 'ALL'>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingHabits, setTogglingHabits] = useState<Set<string>>(new Set())


  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("authToken")
      if (!token) {
        setError("No autenticado")
        setLoading(false)
        return
      }

      const url = activeCategory === 'ALL' 
        ? '/api/habits'
        : `/api/habits?category=${activeCategory}`

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Error al obtener hábitos")
      }

      const data = await response.json()
      setHabits(data.habits)
      setStats({
        totalCount: data.totalCount,
        activeCount: data.activeCount,
        completedTodayCount: data.completedTodayCount
      })

    } catch (err) {
      console.error("Error fetching habits:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [activeCategory])

  
  // Fetch habits data
  useEffect(() => {
    fetchHabits()
  }, [activeCategory, fetchHabits])

  const handleToggleComplete = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    try {
      setTogglingHabits(prev => new Set(prev).add(habitId))

      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch(`/api/habits/${habitId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          completed: !habit.completedToday,
          value: habit.targetCount
        })
      })

      if (!response.ok) {
        throw new Error("Error al actualizar hábito")
      }

      // Update local state
      setHabits(prev => prev.map(h => 
        h.id === habitId 
          ? { ...h, completedToday: !h.completedToday, currentStreak: h.currentStreak + (habit.completedToday ? -1 : 1) }
          : h
      ))

      // Update stats
      setStats(prev => ({
        ...prev,
        completedTodayCount: prev.completedTodayCount + (habit.completedToday ? -1 : 1)
      }))

    } catch (err) {
      console.error("Error toggling habit:", err)
      setError(err instanceof Error ? err.message : "Error al actualizar hábito")
    } finally {
      setTogglingHabits(prev => {
        const newSet = new Set(prev)
        newSet.delete(habitId)
        return newSet
      })
    }
  }

  const categories = [
    { key: 'ALL', name: 'Todos', icon: '📊', color: 'bg-gray-600', hoverColor: 'hover:bg-gray-700' },
    { key: HabitCategory.MORNING_ROUTINE, name: 'Rutina Matutina', icon: '🌅', color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
    { key: HabitCategory.PHYSICAL_TRAINING, name: 'Entrenamiento', icon: '💪', color: 'bg-red-600', hoverColor: 'hover:bg-red-700' },
    { key: HabitCategory.NUTRITION, name: 'Nutrición', icon: '🥗', color: 'bg-green-600', hoverColor: 'hover:bg-green-700' },
    { key: HabitCategory.DEEP_WORK, name: 'Trabajo Profundo', icon: '🎯', color: 'bg-orange-600', hoverColor: 'hover:bg-orange-700' },
    { key: HabitCategory.PERSONAL_DEVELOPMENT, name: 'Desarrollo Personal', icon: '📚', color: 'bg-purple-600', hoverColor: 'hover:bg-purple-700' },
    { key: HabitCategory.SOCIAL_CHARISMA, name: 'Carisma Social', icon: '🤝', color: 'bg-pink-600', hoverColor: 'hover:bg-pink-700' },
    { key: HabitCategory.REFLECTION, name: 'Reflexión', icon: '💭', color: 'bg-indigo-600', hoverColor: 'hover:bg-indigo-700' },
    { key: HabitCategory.SLEEP_RECOVERY, name: 'Sueño y Descanso', icon: '😴', color: 'bg-slate-600', hoverColor: 'hover:bg-slate-700' },
  ]

  const filteredHabits = habits.filter(habit => habit.isActive)

  const getTrackingTypeText = (type: TrackingType) => {
    switch (type) {
      case TrackingType.BINARY: return 'Sí/No'
      case TrackingType.NUMERIC: return 'Numérico'
      case TrackingType.DURATION: return 'Duración'
      case TrackingType.RATING: return 'Puntuación'
      case TrackingType.TEXT: return 'Texto'
      default: return 'Desconocido'
    }
  }

  const getAverageStreak = () => {
    if (filteredHabits.length === 0) return 0
    return Math.round(filteredHabits.reduce((acc, h) => acc + h.currentStreak, 0) / filteredHabits.length)
  }

  const getTotalPointsToday = () => {
    return filteredHabits
      .filter(h => h.completedToday)
      .reduce((acc, h) => acc + h.points, 0)
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
          <p className="text-gray-600">Cargando tus hábitos...</p>
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
            <RefreshCw className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchHabits}
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
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">Mis Hábitos</h1>
              <p className="text-lg text-gray-600">Gestiona y realiza seguimiento de tus hábitos diarios</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Hábitos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="group p-6 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completados Hoy</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedTodayCount}</p>
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
                  <p className="text-gray-600 text-sm">Racha Promedio</p>
                  <p className="text-2xl font-bold text-orange-600">{getAverageStreak()}</p>
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
                  <p className="text-gray-600 text-sm">Puntos Hoy</p>
                  <p className="text-2xl font-bold text-purple-600">{getTotalPointsToday()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtrar por categoría</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key as HabitCategory | 'ALL')}
                className={`group flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeCategory === category.key
                    ? `${category.color} text-white shadow-lg`
                    : `bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 ${category.hoverColor} hover:text-white`
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeCategory === category.key
                    ? 'bg-white/20'
                    : 'bg-gray-100 group-hover:bg-white/20'
                }`}>
                  {category.key === 'ALL' 
                    ? stats.totalCount 
                    : habits.filter(h => h.category === category.key).length
                  }
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Habits Grid */}
        {filteredHabits.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${habit.color}20`, border: `2px solid ${habit.color}40` }}
                      >
                        {habit.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{habit.name}</h3>
                        <p className="text-gray-600 text-sm">{habit.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleComplete(habit.id)}
                      disabled={togglingHabits.has(habit.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        habit.completedToday
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      } ${togglingHabits.has(habit.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {togglingHabits.has(habit.id) ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : habit.completedToday ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : null}
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Racha Actual</p>
                      <p className="font-bold text-lg flex items-center gap-1 text-orange-600">
                        <Flame className="w-4 h-4" />
                        {habit.currentStreak} días
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Puntos</p>
                      <p className="font-bold text-lg flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4" />
                        {habit.points}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Tipo</p>
                      <p className="font-medium text-gray-900">{getTrackingTypeText(habit.trackingType)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Objetivo</p>
                      <p className="font-medium text-gray-900">
                        {habit.targetCount}{habit.trackingType === TrackingType.DURATION ? ' min' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/dashboard/habits/${habit.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Ver Detalles
                    </Link>
                    <button 
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors duration-200"
                    >
                      <Target className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add New Habit Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="group bg-white backdrop-blur-sm border-2 border-gray-200 border-dashed hover:border-red-300 rounded-2xl flex items-center justify-center min-h-[300px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <Plus className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Crear Nuevo Hábito</h3>
                <p className="text-gray-600 text-sm mb-6">Añade un nuevo hábito a tu rutina</p>
                <Link
                  href="/dashboard/habits/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Crear Hábito
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No tienes hábitos activos</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Comienza creando tu primer hábito para transformar tu vida día a día
            </p>
            <Link
              href="/dashboard/habits/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Crear mi primer hábito
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}