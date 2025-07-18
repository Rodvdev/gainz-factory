"use client"
import { useState } from "react"
import ProgressChart from "@/components/dashboard/ProgressChart"
import { HabitCategory } from "@prisma/client"
import { ChartBarIcon, ArrowTrendingUpIcon, CalendarIcon } from "@heroicons/react/24/outline"

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  // Sample data - will be replaced with real data
  const weeklyData = [
    { date: "2024-01-15", totalPoints: 78, completedHabits: 12, totalHabits: 15 },
    { date: "2024-01-16", totalPoints: 82, completedHabits: 13, totalHabits: 15 },
    { date: "2024-01-17", totalPoints: 65, completedHabits: 10, totalHabits: 15 },
    { date: "2024-01-18", totalPoints: 91, completedHabits: 14, totalHabits: 15 },
    { date: "2024-01-19", totalPoints: 88, completedHabits: 13, totalHabits: 15 },
    { date: "2024-01-20", totalPoints: 75, completedHabits: 11, totalHabits: 15 },
    { date: "2024-01-21", totalPoints: 85, completedHabits: 12, totalHabits: 15 },
  ]

  const monthlyStats = [
    { category: HabitCategory.MORNING_ROUTINE, name: "Rutina Matutina", icon: "🌅", completed: 28, total: 31, percentage: 90 },
    { category: HabitCategory.PHYSICAL_TRAINING, name: "Entrenamiento", icon: "💪", completed: 25, total: 31, percentage: 81 },
    { category: HabitCategory.NUTRITION, name: "Nutrición", icon: "🥗", completed: 30, total: 31, percentage: 97 },
    { category: HabitCategory.DEEP_WORK, name: "Trabajo Profundo", icon: "🎯", completed: 22, total: 31, percentage: 71 },
    { category: HabitCategory.PERSONAL_DEVELOPMENT, name: "Desarrollo Personal", icon: "📚", completed: 26, total: 31, percentage: 84 },
    { category: HabitCategory.SOCIAL_CHARISMA, name: "Carisma Social", icon: "🤝", completed: 18, total: 31, percentage: 58 },
    { category: HabitCategory.REFLECTION, name: "Reflexión", icon: "💭", completed: 24, total: 31, percentage: 77 },
    { category: HabitCategory.SLEEP_RECOVERY, name: "Sueño y Descanso", icon: "😴", completed: 20, total: 31, percentage: 65 },
  ]

  const totalStats = {
    totalPoints: 2650,
    averageDaily: 85.5,
    bestStreak: 21,
    currentStreak: 14,
    totalHabits: 15,
    completionRate: 78.5
  }

  const milestones = [
    { name: "Primera semana completada", date: "2024-01-07", icon: "🎯", achieved: true },
    { name: "100 puntos en un día", date: "2024-01-12", icon: "💯", achieved: true },
    { name: "Racha de 14 días", date: "2024-01-18", icon: "🔥", achieved: true },
    { name: "Racha de 21 días", date: "2024-01-25", icon: "⭐", achieved: false },
    { name: "Racha de 30 días", date: "2024-02-03", icon: "🏆", achieved: false },
  ]

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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Progreso y Estadísticas</h1>
          <p className="text-gray-400">Analiza tu evolución y rendimiento a lo largo del tiempo</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Puntos Totales</p>
                <p className="text-2xl font-bold text-yellow-500">{totalStats.totalPoints.toLocaleString()}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Promedio Diario</p>
                <p className="text-2xl font-bold text-blue-500">{totalStats.averageDaily}</p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Mejor Racha</p>
                <p className="text-2xl font-bold text-orange-500">{totalStats.bestStreak} días</p>
              </div>
              <span className="text-orange-500 text-2xl">🔥</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tasa de Completación</p>
                <p className="text-2xl font-bold text-green-500">{totalStats.completionRate}%</p>
              </div>
              <span className="text-green-500 text-2xl">✓</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <div className="xl:col-span-2">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Evolución Temporal</h2>
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
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              <ProgressChart 
                weeklyData={weeklyData}
                currentStreak={totalStats.currentStreak}
              />
            </div>

            {/* Category Performance */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mt-8">
              <h2 className="text-xl font-bold mb-6">Rendimiento por Categoría</h2>
              <div className="space-y-4">
                {monthlyStats.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${getCategoryColor(stat.category)} flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="font-medium">{stat.name}</p>
                        <p className="text-sm text-gray-400">{stat.completed}/{stat.total} días</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-800 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getCategoryColor(stat.category)}`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{stat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Milestones */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Hitos y Logros
              </h2>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                    milestone.achieved ? 'bg-green-500/10 border border-green-500/20' : 'bg-gray-800'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.achieved ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      {milestone.achieved ? '✓' : milestone.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${milestone.achieved ? 'text-green-400' : 'text-gray-300'}`}>
                        {milestone.name}
                      </p>
                      <p className="text-xs text-gray-400">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Estadísticas Rápidas</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Días activos</span>
                  <span className="font-bold">31</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hábitos únicos</span>
                  <span className="font-bold">{totalStats.totalHabits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mejor día</span>
                  <span className="font-bold">95 puntos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Categoría favorita</span>
                  <span className="font-bold">Nutrición</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tiempo total</span>
                  <span className="font-bold">45h 30m</span>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl border border-red-500/30 p-6">
              <h3 className="text-lg font-bold mb-3">¡Sigue así! 🔥</h3>
              <p className="text-gray-300 text-sm mb-4">
                Estás en una excelente racha. Solo necesitas 7 días más para alcanzar tu récord personal.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-500">🎯</span>
                <span>Próximo objetivo: 21 días consecutivos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 