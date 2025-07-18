"use client"
import { useState } from "react"
import { HabitCategory, TrackingType, EntryStatus } from "@prisma/client"

interface Habit {
  id: string
  name: string
  description?: string
  category: HabitCategory
  trackingType: TrackingType
  targetCount: number
  targetValue?: number
  targetUnit?: string
  points: number
  color: string
  icon?: string
  order: number
}

interface HabitEntry {
  id?: string
  habitId: string
  date: string
  status: EntryStatus
  value?: number
  textValue?: string
  note?: string
  timeSpent?: number
  difficulty?: number
  mood?: number
}

interface HabitCardProps {
  habit: Habit
  entry?: HabitEntry
  onLog: (habitId: string, entryData: Partial<HabitEntry>) => Promise<void>
  date: string
}

export default function HabitCard({ habit, entry, onLog, date }: HabitCardProps) {
  const [isLogging, setIsLogging] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [trackingValue, setTrackingValue] = useState<string>("")
  const [note, setNote] = useState("")

  const isCompleted = entry?.status === EntryStatus.COMPLETED
  const isSkipped = entry?.status === EntryStatus.SKIPPED

  const handleQuickComplete = async () => {
    if (isLogging) return
    
    setIsLogging(true)
    try {
      await onLog(habit.id, {
        status: EntryStatus.COMPLETED,
        date,
        value: habit.trackingType === TrackingType.BINARY ? 1 : undefined
      })
    } catch (error) {
      console.error("Error logging habit:", error)
    } finally {
      setIsLogging(false)
    }
  }

  const handleDetailedLog = async () => {
    if (isLogging) return
    
    setIsLogging(true)
    try {
      let value: number | undefined
      
      if (habit.trackingType === TrackingType.NUMERIC || habit.trackingType === TrackingType.DURATION) {
        value = parseFloat(trackingValue) || undefined
      } else if (habit.trackingType === TrackingType.RATING) {
        value = parseInt(trackingValue) || undefined
      }
      
      await onLog(habit.id, {
        status: EntryStatus.COMPLETED,
        date,
        value,
        textValue: habit.trackingType === TrackingType.TEXT ? trackingValue : undefined,
        note: note || undefined
      })
      
      setTrackingValue("")
      setNote("")
      setShowDetails(false)
    } catch (error) {
      console.error("Error logging habit:", error)
    } finally {
      setIsLogging(false)
    }
  }

  const handleSkip = async () => {
    if (isLogging) return
    
    setIsLogging(true)
    try {
      await onLog(habit.id, {
        status: EntryStatus.SKIPPED,
        date
      })
    } catch (error) {
      console.error("Error skipping habit:", error)
    } finally {
      setIsLogging(false)
    }
  }

  const getCategoryColor = (category: HabitCategory) => {
    const colors = {
      MORNING_ROUTINE: "bg-yellow-500",
      PHYSICAL_TRAINING: "bg-red-500", 
      NUTRITION: "bg-green-500",
      DEEP_WORK: "bg-blue-500",
      PERSONAL_DEVELOPMENT: "bg-purple-500",
      SOCIAL_CHARISMA: "bg-pink-500",
      REFLECTION: "bg-teal-500",
      SLEEP_RECOVERY: "bg-gray-500"
    }
    return colors[category] || "bg-gray-500"
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

  const getTrackingPlaceholder = () => {
    switch (habit.trackingType) {
      case TrackingType.NUMERIC:
        return `Valor (${habit.targetUnit || ""})`
      case TrackingType.DURATION:
        return `Tiempo (${habit.targetUnit || "minutos"})`
      case TrackingType.RATING:
        return "Calificación (1-10)"
      case TrackingType.TEXT:
        return "Texto o comentario"
      default:
        return "Valor"
    }
  }

  return (
    <div className={`bg-gray-900 rounded-xl border transition-all duration-200 ${
      isCompleted 
        ? "border-green-500 bg-green-500/10" 
        : isSkipped
        ? "border-gray-600 bg-gray-800/50"
        : "border-gray-700 hover:border-gray-600"
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{habit.icon || "📋"}</div>
            <div>
              <h3 className="font-semibold text-white">{habit.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(habit.category)}`}>
                  {getCategoryName(habit.category)}
                </span>
                <span className="text-xs text-gray-400">{habit.points} pts</span>
              </div>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {isCompleted && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
            {isSkipped && (
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">-</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {habit.description && (
          <p className="text-sm text-gray-400 mb-3">{habit.description}</p>
        )}

        {/* Target Info */}
        <div className="text-xs text-gray-500 mb-4">
          Meta: {habit.targetCount} {habit.targetUnit || "vez(es)"}
        </div>

        {/* Action Buttons */}
        {!isCompleted && !isSkipped && (
          <div className="space-y-2">
            {/* Quick Complete for Binary tracking */}
            {habit.trackingType === TrackingType.BINARY && (
              <button
                onClick={handleQuickComplete}
                disabled={isLogging}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {isLogging ? "Registrando..." : "✓ Completar"}
              </button>
            )}
            
            {/* Detailed tracking for other types */}
            {habit.trackingType !== TrackingType.BINARY && (
              <>
                {!showDetails ? (
                  <button
                    onClick={() => setShowDetails(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    📊 Registrar Progreso
                  </button>
                ) : (
                  <div className="space-y-3 p-3 bg-gray-800 rounded-lg">
                    <input
                      type={habit.trackingType === TrackingType.TEXT ? "text" : "number"}
                      value={trackingValue}
                      onChange={(e) => setTrackingValue(e.target.value)}
                      placeholder={getTrackingPlaceholder()}
                      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      min={habit.trackingType === TrackingType.RATING ? 1 : 0}
                      max={habit.trackingType === TrackingType.RATING ? 10 : undefined}
                    />
                    
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Nota opcional..."
                      className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleDetailedLog}
                        disabled={isLogging || !trackingValue}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white py-2 px-4 rounded font-medium transition-colors"
                      >
                        {isLogging ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Skip Button */}
            <button
              onClick={handleSkip}
              disabled={isLogging}
              className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
            >
              Saltar por hoy
            </button>
          </div>
        )}

        {/* Entry Info */}
        {entry && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              {isCompleted && entry.value && (
                <span>Valor: {entry.value} {habit.targetUnit}</span>
              )}
              {entry.note && (
                <div className="mt-1 text-gray-300">Nota: {entry.note}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 