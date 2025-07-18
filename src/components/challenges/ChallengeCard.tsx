"use client"
import { HabitCategory } from "@prisma/client"

interface Challenge {
  id: string
  userId: string
  name: string
  description?: string
  category?: HabitCategory
  startDate: string
  endDate: string
  targetValue: number
  currentValue: number
  isCompleted: boolean
  reward?: string
}

interface ChallengeCardProps {
  challenge: Challenge
  onUpdate?: (challengeId: string, progress: number) => Promise<void>
}

export default function ChallengeCard({ challenge, onUpdate }: ChallengeCardProps) {
  const progressPercentage = (challenge.currentValue / challenge.targetValue) * 100
  
  const startDate = new Date(challenge.startDate)
  const endDate = new Date(challenge.endDate)
  const today = new Date()
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysPassed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  
  const isActive = today >= startDate && today <= endDate
  const isExpired = today > endDate && !challenge.isCompleted

  const getCategoryIcon = (category?: HabitCategory) => {
    if (!category) return "🎯"
    
    const icons = {
      MORNING_ROUTINE: "🌅",
      PHYSICAL_TRAINING: "💪",
      NUTRITION: "🥗",
      DEEP_WORK: "🎯",
      PERSONAL_DEVELOPMENT: "📚",
      SOCIAL_CHARISMA: "🤝",
      REFLECTION: "💭",
      SLEEP_RECOVERY: "😴"
    }
    return icons[category] || "🎯"
  }

  const getCategoryName = (category?: HabitCategory) => {
    if (!category) return "General"
    
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
    return names[category] || "General"
  }

  const getStatusColor = () => {
    if (challenge.isCompleted) return "border-green-500 bg-green-500/10"
    if (isExpired) return "border-red-500 bg-red-500/10"
    if (isActive) return "border-blue-500 bg-blue-500/10"
    return "border-gray-500 bg-gray-500/10"
  }

  const getStatusText = () => {
    if (challenge.isCompleted) return "🏆 Completado"
    if (isExpired) return "⏰ Expirado"
    if (isActive) return `⏳ ${daysRemaining} días restantes`
    return "📅 Próximamente"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className={`bg-gray-900 rounded-xl border p-6 transition-all duration-200 ${getStatusColor()}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getCategoryIcon(challenge.category)}</div>
          <div>
            <h3 className="font-bold text-white text-lg">{challenge.name}</h3>
            {challenge.category && (
              <span className="text-sm text-gray-400">{getCategoryName(challenge.category)}</span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">{getStatusText()}</div>
        </div>
      </div>

      {/* Description */}
      {challenge.description && (
        <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progreso</span>
          <span className="text-sm font-medium text-white">
            {challenge.currentValue} / {challenge.targetValue}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              challenge.isCompleted 
                ? 'bg-green-500' 
                : isExpired 
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{progressPercentage.toFixed(0)}% completado</span>
          <span>{challenge.targetValue - challenge.currentValue} restantes</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-400">Inicio: </span>
            <span className="text-white">{formatDate(challenge.startDate)}</span>
          </div>
          <div>
            <span className="text-gray-400">Fin: </span>
            <span className="text-white">{formatDate(challenge.endDate)}</span>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-gray-500 h-1 rounded-full"
              style={{ width: `${(daysPassed / totalDays) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Día {daysPassed}/{totalDays}</span>
            <span>{totalDays} días total</span>
          </div>
        </div>
      </div>

      {/* Reward */}
      {challenge.reward && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎁</span>
            <div>
              <div className="text-sm font-medium text-yellow-400">Recompensa</div>
              <div className="text-sm text-gray-300">{challenge.reward}</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {isActive && !challenge.isCompleted && onUpdate && (
        <button
          onClick={() => onUpdate(challenge.id, challenge.currentValue + 1)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          + Registrar Progreso
        </button>
      )}

      {/* Status Messages */}
      {challenge.isCompleted && (
        <div className="text-center py-2">
          <span className="text-green-400 font-medium">🎉 ¡Desafío completado!</span>
        </div>
      )}

      {isExpired && (
        <div className="text-center py-2">
          <span className="text-red-400 font-medium">😔 Desafío no completado</span>
        </div>
      )}
    </div>
  )
} 