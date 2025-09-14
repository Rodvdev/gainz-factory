"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Zap,
  CheckCircle,
  Plus,
  Minus
} from "lucide-react"

interface HabitSchedule {
  id: string
  name: string
  icon: string
  time: string
  days: string[]
  reminder: boolean
}

interface TimeSlot {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  suggestedTimes: string[]
}

const timeSlots: TimeSlot[] = [
  {
    id: "morning",
    label: "Mañana",
    icon: Sun,
    description: "6:00 AM - 12:00 PM",
    suggestedTimes: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"]
  },
  {
    id: "afternoon",
    label: "Tarde",
    icon: Coffee,
    description: "12:00 PM - 6:00 PM",
    suggestedTimes: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]
  },
  {
    id: "evening",
    label: "Noche",
    icon: Moon,
    description: "6:00 PM - 11:00 PM",
    suggestedTimes: ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
  }
]

const weekDays = [
  { id: "monday", label: "L", fullLabel: "Lunes" },
  { id: "tuesday", label: "M", fullLabel: "Martes" },
  { id: "wednesday", label: "X", fullLabel: "Miércoles" },
  { id: "thursday", label: "J", fullLabel: "Jueves" },
  { id: "friday", label: "V", fullLabel: "Viernes" },
  { id: "saturday", label: "S", fullLabel: "Sábado" },
  { id: "sunday", label: "D", fullLabel: "Domingo" }
]

const defaultHabits = [
  { id: "exercise", name: "Ejercicio", icon: "💪" },
  { id: "meditation", name: "Meditación", icon: "🧘" },
  { id: "reading", name: "Lectura", icon: "📚" },
  { id: "water", name: "Agua", icon: "💧" },
  { id: "sleep", name: "Sueño", icon: "😴" }
]

export default function OnboardingSchedule() {
  const [habits, setHabits] = useState<HabitSchedule[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize with default habits from previous step
    const initialHabits = defaultHabits.map(habit => ({
      ...habit,
      time: "7:00 AM",
      days: ["monday", "wednesday", "friday"],
      reminder: true
    }))
    setHabits(initialHabits)
  }, [])

  const updateHabitTime = (habitId: string, time: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, time } : habit
    ))
  }

  const updateHabitDays = (habitId: string, dayId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const days = habit.days.includes(dayId)
          ? habit.days.filter(d => d !== dayId)
          : [...habit.days, dayId]
        return { ...habit, days }
      }
      return habit
    }))
  }

  const updateHabitReminder = (habitId: string, reminder: boolean) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, reminder } : habit
    ))
  }

  const handleContinue = async () => {
    setLoading(true)
    
    try {
      const response = await fetch("/api/onboarding/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          schedule: habits,
          step: "schedule"
        }),
      })
      
      if (response.ok) {
        router.push("/onboarding/profile")
      }
    } catch (error) {
      console.error("Error saving schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeSlotForTime = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    const isPM = time.includes('PM')
    const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour)
    
    if (hour24 >= 6 && hour24 < 12) return "morning"
    if (hour24 >= 12 && hour24 < 18) return "afternoon"
    return "evening"
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory Logo"
              width={50}
              height={50}
              className="rounded-full border-2 border-red-500"
            />
            <div>
              <h1 className="text-xl font-bold text-white">GAINZ FACTORY</h1>
              <p className="text-red-500 text-sm">Transformation OS</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              ¿Cuándo quieres hacer tus hábitos?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Configura horarios y días para cada hábito
            </p>
          </motion.div>
        </div>

        {/* Schedule Configuration */}
        <div className="space-y-8 mb-8">
          {habits.map((habit, index) => {
            const timeSlot = timeSlots.find(slot => slot.id === getTimeSlotForTime(habit.time))
            const TimeIcon = timeSlot?.icon || Clock
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800"
              >
                {/* Habit Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl">{habit.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{habit.name}</h3>
                    <p className="text-gray-400">Configura cuándo y cómo quieres hacerlo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Time Selection */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-red-500" />
                      Hora
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {timeSlots.map((slot) => {
                        const SlotIcon = slot.icon
                        const isActive = timeSlot?.id === slot.id
                        
                        return (
                          <motion.button
                            key={slot.id}
                            onClick={() => {
                              const suggestedTime = slot.suggestedTimes[0]
                              updateHabitTime(habit.id, suggestedTime)
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              isActive
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                            }`}
                          >
                            <SlotIcon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-red-500' : 'text-gray-400'}`} />
                            <div className="text-sm font-medium text-white">{slot.label}</div>
                            <div className="text-xs text-gray-400">{slot.description}</div>
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Time Picker */}
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hora específica:
                      </label>
                      <select
                        value={habit.time}
                        onChange={(e) => updateHabitTime(habit.id, e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      >
                        {timeSlots.flatMap(slot => 
                          slot.suggestedTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Days Selection */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-red-500" />
                      Días de la semana
                    </h4>
                    
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {weekDays.map((day) => {
                        const isSelected = habit.days.includes(day.id)
                        
                        return (
                          <motion.button
                            key={day.id}
                            onClick={() => updateHabitDays(habit.id, day.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-red-500 bg-red-500/10 text-red-400'
                                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 text-gray-300'
                            }`}
                            title={day.fullLabel}
                          >
                            <div className="text-sm font-bold">{day.label}</div>
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Reminder Toggle */}
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-white">Recordatorio</h5>
                          <p className="text-xs text-gray-400">Notificación antes del hábito</p>
                        </div>
                        <button
                          onClick={() => updateHabitReminder(habit.id, !habit.reminder)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            habit.reminder ? 'bg-red-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                            habit.reminder ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Setup Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 mb-8"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-red-500" />
            Configuración rápida
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setHabits(prev => prev.map(habit => ({
                  ...habit,
                  time: "7:00 AM",
                  days: ["monday", "tuesday", "wednesday", "thursday", "friday"]
                })))
              }}
              className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-white font-medium">Solo días laborales</div>
              <div className="text-gray-400 text-sm">Lunes a Viernes</div>
            </button>
            
            <button
              onClick={() => {
                setHabits(prev => prev.map(habit => ({
                  ...habit,
                  time: "8:00 AM",
                  days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                })))
              }}
              className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-white font-medium">Todos los días</div>
              <div className="text-gray-400 text-sm">Lunes a Domingo</div>
            </button>
            
            <button
              onClick={() => {
                setHabits(prev => prev.map(habit => ({
                  ...habit,
                  time: "9:00 PM",
                  days: ["monday", "wednesday", "friday"]
                })))
              }}
              className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <Moon className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-white font-medium">Alternados</div>
              <div className="text-gray-400 text-sm">Lunes, Miércoles, Viernes</div>
            </button>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={handleContinue}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 group"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Guardando horarios...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Continuar con Perfil
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            La consistencia en horarios crea hábitos sólidos
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
