"use client"
import { HabitCategory } from "@prisma/client"

interface HabitStreak {
  id: string
  habitId: string
  length: number
  startDate: string
  habit: {
    id: string
    name: string
    icon?: string
    color: string
    category: HabitCategory
  }
}

interface ActiveStreaksProps {
  streaks: HabitStreak[]
}

export default function ActiveStreaks({ streaks }: ActiveStreaksProps) {
  const sortedStreaks = [...streaks].sort((a, b) => b.length - a.length)

  const getStreakEmoji = (length: number) => {
    if (length >= 30) return "🏆"
    if (length >= 21) return "💎"
    if (length >= 14) return "🔥"
    if (length >= 7) return "⭐"
    if (length >= 3) return "🚀"
    return "💪"
  }

  const getStreakColor = (length: number) => {
    if (length >= 30) return "text-yellow-400"
    if (length >= 21) return "text-purple-400" 
    if (length >= 14) return "text-red-400"
    if (length >= 7) return "text-orange-400"
    if (length >= 3) return "text-blue-400"
    return "text-green-400"
  }

  const getStreakMessage = (length: number) => {
    if (length >= 30) return "¡Leyenda!"
    if (length >= 21) return "¡Diamante!"
    if (length >= 14) return "¡En llamas!"
    if (length >= 7) return "¡Una semana!"
    if (length >= 3) return "¡Ganando impulso!"
    return "¡Empezando fuerte!"
  }

  const getCategoryName = (category: HabitCategory) => {
    const names = {
      MORNING_ROUTINE: "Rutina Matutina",
      PHYSICAL_TRAINING: "Entrenamiento",
      NUTRITION: "Nutrición",
      DEEP_WORK: "Trabajo Profundo", 
      PERSONAL_DEVELOPMENT: "Desarrollo Personal",
      SOCIAL_CHARISMA: "Carisma Social",
      REFLECTION: "Reflexión",
      SLEEP_RECOVERY: "Sueño y Recuperación"
    }
    return names[category] || category
  }

  const getDaysAgo = (dateString: string) => {
    const startDate = new Date(dateString)
    const today = new Date()
    const diffTime = today.getTime() - startDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Rachas Activas</h3>
        <div className="text-sm text-gray-400">
          {streaks.length} racha{streaks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Streaks List */}
      {streaks.length > 0 ? (
        <div className="space-y-4">
          {sortedStreaks.map((streak) => (
            <div 
              key={streak.id}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              {/* Habit Icon */}
              <div className="text-2xl">
                {streak.habit.icon || "📋"}
              </div>

              {/* Habit Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">
                  {streak.habit.name}
                </h4>
                <p className="text-sm text-gray-400">
                  {getCategoryName(streak.habit.category)}
                </p>
              </div>

              {/* Streak Info */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getStreakEmoji(streak.length)}</span>
                  <span className={`text-xl font-bold ${getStreakColor(streak.length)}`}>
                    {streak.length}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {getStreakMessage(streak.length)}
                </div>
              </div>
            </div>
          ))}

          {/* Best Streak Highlight */}
          {sortedStreaks.length > 0 && sortedStreaks[0].length >= 7 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👑</span>
                <div>
                  <h4 className="font-bold text-yellow-400">¡Tu Mejor Racha!</h4>
                  <p className="text-sm text-gray-300">
                    {sortedStreaks[0].habit.name} - {sortedStreaks[0].length} días consecutivos
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🔥</div>
          <h4 className="text-lg font-medium text-gray-300 mb-2">
            ¡Construye tu primera racha!
          </h4>
          <p className="text-sm text-gray-400">
            Completa un hábito varios días seguidos para crear una racha
          </p>
        </div>
      )}

      {/* Streak Tips */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h5 className="text-sm font-medium text-gray-400 mb-3">💡 Tips para Rachas</h5>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>3 días: Empiezas a formar el hábito</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>7 días: Una semana completa de consistencia</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">•</span>
            <span>21 días: El hábito se vuelve automático</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 mt-0.5">•</span>
            <span>30+ días: Transformación profunda</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {streaks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                {Math.max(...streaks.map(s => s.length))}
              </div>
              <div className="text-xs text-gray-400">Racha Más Larga</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {Math.round(streaks.reduce((sum, s) => sum + s.length, 0) / streaks.length)}
              </div>
              <div className="text-xs text-gray-400">Promedio</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 