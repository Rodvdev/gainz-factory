"use client"
import { useState, useEffect } from "react"

interface DailyProgress {
  date: string
  totalPoints: number
  completedHabits: number
  totalHabits: number
  completionRate?: number
  morningScore?: number
  physicalScore?: number
  nutritionScore?: number
  workScore?: number
  developmentScore?: number
  socialScore?: number
  reflectionScore?: number
  sleepScore?: number
}

interface SummaryStats {
  totalPoints: number
  totalCompletedHabits: number
  activeDays: number
  averageCompletionRate: number
  bestDay: DailyProgress
  currentStreak: number
}

interface ProgressChartProps {
  weeklyData?: DailyProgress[]
  currentStreak?: number
}

export default function ProgressChart({ weeklyData, currentStreak = 0 }: ProgressChartProps) {
  const [viewMode, setViewMode] = useState<'points' | 'completion'>('points')
  const [chartData, setChartData] = useState<DailyProgress[]>([])
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch weekly progress data from API
  useEffect(() => {
    const fetchWeeklyProgress = async () => {
      try {
        setLoading(true)
        setError(null)

        // If weeklyData is provided as prop, use it
        if (weeklyData && weeklyData.length > 0) {
          const processedData = weeklyData.map(day => ({
            ...day,
            completionRate: day.totalHabits > 0 ? (day.completedHabits / day.totalHabits) * 100 : 0
          }))
          setChartData(processedData)
          setLoading(false)
          return
        }

        // Otherwise, fetch from API
        const token = localStorage.getItem("authToken")
        if (!token) {
          setError("No autenticado")
          setLoading(false)
          return
        }

        const response = await fetch("/api/progress/weekly", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Error al obtener datos de progreso")
        }

        const data = await response.json()
        
        const processedData = data.weeklyData.map((day: DailyProgress) => ({
          ...day,
          completionRate: day.totalHabits > 0 ? (day.completedHabits / day.totalHabits) * 100 : 0
        }))

        setChartData(processedData)
        setSummaryStats(data.summaryStats)
        
      } catch (err) {
        console.error("Error fetching weekly progress:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchWeeklyProgress()
  }, [weeklyData])

  const maxPoints = Math.max(...chartData.map(d => d.totalPoints), 50)
  const maxCompletion = 100

  const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { weekday: 'short' })
  }

  const isToday = (dateString: string) => {
    return dateString === new Date().toISOString().split('T')[0]
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Cargando progreso...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos de progreso</h3>
          <p className="text-gray-600">Comienza a registrar tus hábitos para ver tu progreso semanal</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Progreso Semanal</h3>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('points')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'points' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Puntos
          </button>
          <button
            onClick={() => setViewMode('completion')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'completion' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completitud
          </button>
        </div>
      </div>

      {/* Current Streak */}
      <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Racha Actual</h4>
              <p className="text-sm text-gray-600">Días consecutivos completados</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-red-600">{summaryStats?.currentStreak || currentStreak}</span>
            <div className="text-sm text-gray-500">días</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        <div className="flex items-end justify-between h-48 gap-2">
          {chartData.map((day) => {
            const value = viewMode === 'points' ? day.totalPoints : (day.completionRate || 0)
            const maxValue = viewMode === 'points' ? maxPoints : maxCompletion
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                {/* Bar */}
                <div className="w-full flex flex-col justify-end h-40 mb-2">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isToday(day.date)
                        ? 'bg-red-600'
                        : value > 0
                        ? 'bg-red-400'
                        : 'bg-gray-300'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                
                {/* Value Label */}
                <div className="text-xs text-gray-600 mb-1">
                  {viewMode === 'points' ? day.totalPoints : `${(day.completionRate || 0).toFixed(0)}%`}
                </div>
                
                {/* Day Label */}
                <div className={`text-xs font-medium ${
                  isToday(day.date) ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {getDayName(day.date)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {summaryStats?.totalPoints || chartData.reduce((sum, day) => sum + day.totalPoints, 0)}
            </div>
            <div className="text-xs text-gray-600">Puntos Totales</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {summaryStats?.totalCompletedHabits || chartData.reduce((sum, day) => sum + day.completedHabits, 0)}
            </div>
            <div className="text-xs text-gray-600">Hábitos Completados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {summaryStats?.activeDays || chartData.filter(day => day.completedHabits > 0).length}/7
            </div>
            <div className="text-xs text-gray-600">Días Activos</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-600 mb-2">💡 Insights</h5>
        <div className="space-y-1">
          {(() => {
            const totalDaysWithActivity = summaryStats?.activeDays || chartData.filter(day => day.completedHabits > 0).length
            const avgCompletionRate = summaryStats?.averageCompletionRate || chartData.reduce((sum, day) => sum + (day.completionRate || 0), 0) / 7

            if (totalDaysWithActivity === 7) {
              return (
                <div className="text-sm text-green-600">
                  🎉 ¡Increíble! Has estado activo todos los días esta semana
                </div>
              )
            } else if (totalDaysWithActivity >= 5) {
              return (
                <div className="text-sm text-yellow-600">
                  ⭐ ¡Excelente consistencia! {totalDaysWithActivity}/7 días activos
                </div>
              )
            } else if (avgCompletionRate >= 70) {
              return (
                <div className="text-sm text-blue-600">
                  💪 Buena tasa de completitud: {avgCompletionRate.toFixed(0)}% promedio
                </div>
              )
            } else {
              return (
                <div className="text-sm text-orange-600">
                  🚀 ¡Oportunidad de mejora! Intenta ser más consistente
                </div>
              )
            }
          })()}
        </div>
      </div>
    </div>
  )
} 