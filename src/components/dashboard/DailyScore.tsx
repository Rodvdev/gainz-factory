"use client"
import { HabitCategory } from "@prisma/client"

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
  percentile?: number
  rank?: number
}

interface CategoryScore {
  category: HabitCategory
  score: number
  maxScore: number
  percentage: number
  icon: string
  name: string
  color: string
}

interface DailyScoreProps {
  score?: DailyScoreData
  date: string
}

export default function DailyScore({ score, date }: DailyScoreProps) {
  const today = new Date().toISOString().split('T')[0]
  const isToday = date === today

  // Calculate category scores
  const categoryScores: CategoryScore[] = [
    {
      category: HabitCategory.MORNING_ROUTINE,
      score: score?.morningScore || 0,
      maxScore: 15, // Estimated max points for category
      percentage: score?.morningScore ? (score.morningScore / 15) * 100 : 0,
      icon: "🌅",
      name: "Rutina Matutina",
      color: "bg-yellow-500"
    },
    {
      category: HabitCategory.PHYSICAL_TRAINING,
      score: score?.physicalScore || 0,
      maxScore: 20,
      percentage: score?.physicalScore ? (score.physicalScore / 20) * 100 : 0,
      icon: "💪",
      name: "Entrenamiento",
      color: "bg-red-500"
    },
    {
      category: HabitCategory.NUTRITION,
      score: score?.nutritionScore || 0,
      maxScore: 15,
      percentage: score?.nutritionScore ? (score.nutritionScore / 15) * 100 : 0,
      icon: "🥗",
      name: "Nutrición",
      color: "bg-green-500"
    },
    {
      category: HabitCategory.DEEP_WORK,
      score: score?.workScore || 0,
      maxScore: 20,
      percentage: score?.workScore ? (score.workScore / 20) * 100 : 0,
      icon: "🎯",
      name: "Trabajo Profundo",
      color: "bg-blue-500"
    },
    {
      category: HabitCategory.PERSONAL_DEVELOPMENT,
      score: score?.developmentScore || 0,
      maxScore: 15,
      percentage: score?.developmentScore ? (score.developmentScore / 15) * 100 : 0,
      icon: "📚",
      name: "Desarrollo Personal",
      color: "bg-purple-500"
    },
    {
      category: HabitCategory.SOCIAL_CHARISMA,
      score: score?.socialScore || 0,
      maxScore: 10,
      percentage: score?.socialScore ? (score.socialScore / 10) * 100 : 0,
      icon: "🤝",
      name: "Carisma Social",
      color: "bg-pink-500"
    },
    {
      category: HabitCategory.REFLECTION,
      score: score?.reflectionScore || 0,
      maxScore: 10,
      percentage: score?.reflectionScore ? (score.reflectionScore / 10) * 100 : 0,
      icon: "💭",
      name: "Reflexión",
      color: "bg-teal-500"
    },
    {
      category: HabitCategory.SLEEP_RECOVERY,
      score: score?.sleepScore || 0,
      maxScore: 15,
      percentage: score?.sleepScore ? (score.sleepScore / 15) * 100 : 0,
      icon: "😴",
      name: "Sueño y Recuperación",
      color: "bg-gray-500"
    }
  ]

  const totalPossiblePoints = categoryScores.reduce((sum, cat) => sum + cat.maxScore, 0)
  const overallPercentage = score?.totalPoints ? (score.totalPoints / totalPossiblePoints) * 100 : 0
  const completionRate = score?.totalHabits ? (score.completedHabits / score.totalHabits) * 100 : 0

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400"
    if (percentage >= 70) return "text-yellow-400"
    if (percentage >= 50) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreEmoji = (percentage: number) => {
    if (percentage >= 90) return "🔥"
    if (percentage >= 70) return "⭐"
    if (percentage >= 50) return "👍"
    return "💪"
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          {isToday ? "Score de Hoy" : "Score Diario"}
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-400">
            {new Date(date).toLocaleDateString('es-ES', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            })}
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300">Score Total</span>
          <span className={`text-2xl font-bold ${getScoreColor(overallPercentage)}`}>
            {score?.totalPoints || 0} pts {getScoreEmoji(overallPercentage)}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              overallPercentage >= 90 ? 'bg-green-500' :
              overallPercentage >= 70 ? 'bg-yellow-500' :
              overallPercentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-400">
          <span>{overallPercentage.toFixed(0)}% completado</span>
          <span>{score?.completedHabits || 0}/{score?.totalHabits || 0} hábitos</span>
        </div>
      </div>

      {/* Category Scores */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Puntuación por Categoría</h4>
        
        {categoryScores.map((category) => (
          <div key={category.category} className="flex items-center gap-3">
            {/* Icon */}
            <div className="text-xl w-8 text-center">{category.icon}</div>
            
            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-300 truncate">
                  {category.name}
                </span>
                <span className="text-sm text-gray-400">
                  {category.score}/{category.maxScore}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${category.color}`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      {score && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{completionRate.toFixed(0)}%</div>
              <div className="text-xs text-gray-400">Tasa de Completitud</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{score.totalPoints}</div>
              <div className="text-xs text-gray-400">Puntos Ganados</div>
            </div>
          </div>

          {score.rank && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-400">
                Ranking: #{score.rank} 
                {score.percentile && ` (Top ${(100 - score.percentile).toFixed(0)}%)`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!score && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📊</div>
          <h4 className="text-lg font-medium text-gray-300 mb-2">
            {isToday ? "¡Comienza tu día!" : "Sin datos para este día"}
          </h4>
          <p className="text-sm text-gray-400">
            {isToday 
              ? "Completa tus primeros hábitos para ver tu score"
              : "No se registraron hábitos en esta fecha"
            }
          </p>
        </div>
      )}
    </div>
  )
} 