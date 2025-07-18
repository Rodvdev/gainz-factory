"use client"
import { useState } from "react"

interface DailyProgress {
  date: string
  totalPoints: number
  completedHabits: number
  totalHabits: number
}

interface ProgressChartProps {
  weeklyData: DailyProgress[]
  currentStreak?: number
}

export default function ProgressChart({ weeklyData, currentStreak = 0 }: ProgressChartProps) {
  const [viewMode, setViewMode] = useState<'points' | 'completion'>('points')

  // Generate last 7 days if no data provided
  const getLastSevenDays = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const lastSevenDays = getLastSevenDays()
  
  // Merge provided data with empty days
  const chartData = lastSevenDays.map(date => {
    const dayData = weeklyData.find(d => d.date === date)
    return {
      date,
      totalPoints: dayData?.totalPoints || 0,
      completedHabits: dayData?.completedHabits || 0,
      totalHabits: dayData?.totalHabits || 0,
      completionRate: dayData?.totalHabits ? (dayData.completedHabits / dayData.totalHabits) * 100 : 0
    }
  })

  const maxPoints = Math.max(...chartData.map(d => d.totalPoints), 50)
  const maxCompletion = 100

  const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { weekday: 'short' })
  }

  const isToday = (dateString: string) => {
    return dateString === new Date().toISOString().split('T')[0]
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Progreso Semanal</h3>
        
        {/* View Toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('points')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'points' 
                ? 'bg-red-500 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Puntos
          </button>
          <button
            onClick={() => setViewMode('completion')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'completion' 
                ? 'bg-red-500 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Completitud
          </button>
        </div>
      </div>

      {/* Current Streak */}
      <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <h4 className="text-lg font-bold text-white">Racha Actual</h4>
              <p className="text-sm text-gray-300">Días consecutivos completados</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-red-400">{currentStreak}</span>
            <div className="text-sm text-gray-400">días</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        <div className="flex items-end justify-between h-48 gap-2">
          {chartData.map((day) => {
            const value = viewMode === 'points' ? day.totalPoints : day.completionRate
            const maxValue = viewMode === 'points' ? maxPoints : maxCompletion
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                {/* Bar */}
                <div className="w-full flex flex-col justify-end h-40 mb-2">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isToday(day.date)
                        ? 'bg-red-500'
                        : value > 0
                        ? 'bg-gray-600'
                        : 'bg-gray-800'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                
                {/* Value Label */}
                <div className="text-xs text-gray-400 mb-1">
                  {viewMode === 'points' ? day.totalPoints : `${day.completionRate.toFixed(0)}%`}
                </div>
                
                {/* Day Label */}
                <div className={`text-xs font-medium ${
                  isToday(day.date) ? 'text-red-400' : 'text-gray-500'
                }`}>
                  {getDayName(day.date)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-t border-gray-700 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">
              {chartData.reduce((sum, day) => sum + day.totalPoints, 0)}
            </div>
            <div className="text-xs text-gray-400">Puntos Totales</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {chartData.reduce((sum, day) => sum + day.completedHabits, 0)}
            </div>
            <div className="text-xs text-gray-400">Hábitos Completados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {chartData.filter(day => day.completedHabits > 0).length}/7
            </div>
            <div className="text-xs text-gray-400">Días Activos</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h5 className="text-sm font-medium text-gray-400 mb-2">💡 Insights</h5>
        <div className="space-y-1">
          {(() => {
            const totalDaysWithActivity = chartData.filter(day => day.completedHabits > 0).length
            const avgCompletionRate = chartData.reduce((sum, day) => sum + day.completionRate, 0) / 7

            if (totalDaysWithActivity === 7) {
              return (
                <div className="text-sm text-green-400">
                  🎉 ¡Increíble! Has estado activo todos los días esta semana
                </div>
              )
            } else if (totalDaysWithActivity >= 5) {
              return (
                <div className="text-sm text-yellow-400">
                  ⭐ ¡Excelente consistencia! {totalDaysWithActivity}/7 días activos
                </div>
              )
            } else if (avgCompletionRate >= 70) {
              return (
                <div className="text-sm text-blue-400">
                  💪 Buena tasa de completitud: {avgCompletionRate.toFixed(0)}% promedio
                </div>
              )
            } else {
              return (
                <div className="text-sm text-orange-400">
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