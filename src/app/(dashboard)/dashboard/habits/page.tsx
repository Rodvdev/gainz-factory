"use client"
import { useState } from "react"
import { HabitCategory, TrackingType } from "@prisma/client"
import { PlusIcon, ChartBarIcon, FireIcon } from "@heroicons/react/24/outline"

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
  currentStreak: number
  completedToday: boolean
}

export default function HabitsPage() {
  const [activeCategory, setActiveCategory] = useState<HabitCategory | 'ALL'>('ALL')

  // Sample data - will be replaced with real data
  const sampleHabits: Habit[] = [
    {
      id: "1",
      name: "Meditación Matutina",
      description: "10 minutos de meditación al despertar",
      category: HabitCategory.MORNING_ROUTINE,
      trackingType: TrackingType.DURATION,
      targetCount: 10,
      points: 5,
      color: "#3B82F6",
      icon: "🧘",
      isActive: true,
      currentStreak: 21,
      completedToday: true
    },
    {
      id: "2",
      name: "Ejercicio de Fuerza",
      description: "Entrenamiento con pesas",
      category: HabitCategory.PHYSICAL_TRAINING,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 10,
      color: "#EF4444",
      icon: "💪",
      isActive: true,
      currentStreak: 14,
      completedToday: false
    },
    {
      id: "3",
      name: "Lectura Diaria",
      description: "Leer al menos 30 páginas",
      category: HabitCategory.PERSONAL_DEVELOPMENT,
      trackingType: TrackingType.NUMERIC,
      targetCount: 30,
      points: 5,
      color: "#8B5CF6",
      icon: "📚",
      isActive: true,
      currentStreak: 8,
      completedToday: true
    },
    {
      id: "4",
      name: "Hidratación",
      description: "Beber 8 vasos de agua",
      category: HabitCategory.NUTRITION,
      trackingType: TrackingType.NUMERIC,
      targetCount: 8,
      points: 3,
      color: "#06B6D4",
      icon: "💧",
      isActive: true,
      currentStreak: 5,
      completedToday: false
    }
  ]

  const categories = [
    { key: 'ALL', name: 'Todos', icon: '📊', color: 'bg-gray-600' },
    { key: HabitCategory.MORNING_ROUTINE, name: 'Rutina Matutina', icon: '🌅', color: 'bg-blue-600' },
    { key: HabitCategory.PHYSICAL_TRAINING, name: 'Entrenamiento', icon: '💪', color: 'bg-red-600' },
    { key: HabitCategory.NUTRITION, name: 'Nutrición', icon: '🥗', color: 'bg-green-600' },
    { key: HabitCategory.DEEP_WORK, name: 'Trabajo Profundo', icon: '🎯', color: 'bg-orange-600' },
    { key: HabitCategory.PERSONAL_DEVELOPMENT, name: 'Desarrollo Personal', icon: '📚', color: 'bg-purple-600' },
    { key: HabitCategory.SOCIAL_CHARISMA, name: 'Carisma Social', icon: '🤝', color: 'bg-pink-600' },
    { key: HabitCategory.REFLECTION, name: 'Reflexión', icon: '💭', color: 'bg-indigo-600' },
    { key: HabitCategory.SLEEP_RECOVERY, name: 'Sueño y Descanso', icon: '😴', color: 'bg-slate-600' },
  ]

  const filteredHabits = activeCategory === 'ALL' 
    ? sampleHabits 
    : sampleHabits.filter(habit => habit.category === activeCategory)

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

  const handleToggleComplete = (habitId: string) => {
    // TODO: Implement habit completion toggle
    console.log('Toggle habit completion:', habitId)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Hábitos</h1>
          <p className="text-gray-400">Gestiona y realiza seguimiento de tus hábitos diarios</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Hábitos</p>
                <p className="text-2xl font-bold text-white">{sampleHabits.length}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completados Hoy</p>
                <p className="text-2xl font-bold text-green-500">
                  {sampleHabits.filter(h => h.completedToday).length}
                </p>
              </div>
              <span className="text-green-500 text-2xl">✓</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Racha Promedio</p>
                <p className="text-2xl font-bold text-orange-500">
                  {Math.round(sampleHabits.reduce((acc, h) => acc + h.currentStreak, 0) / sampleHabits.length)}
                </p>
              </div>
              <FireIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Puntos Totales</p>
                <p className="text-2xl font-bold text-purple-500">
                  {sampleHabits.filter(h => h.completedToday).reduce((acc, h) => acc + h.points, 0)}
                </p>
              </div>
              <span className="text-purple-500 text-2xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Filtrar por categoría</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key as HabitCategory | 'ALL')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category.key
                    ? `${category.color} text-white`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {category.key === 'ALL' 
                    ? sampleHabits.length 
                    : sampleHabits.filter(h => h.category === category.key).length
                  }
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => (
            <div key={habit.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${habit.color}20`, border: `1px solid ${habit.color}40` }}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{habit.name}</h3>
                      <p className="text-gray-400 text-sm">{habit.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleComplete(habit.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      habit.completedToday
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {habit.completedToday && '✓'}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Racha Actual</p>
                    <p className="font-bold text-lg flex items-center gap-1">
                      🔥 {habit.currentStreak} días
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Puntos</p>
                    <p className="font-bold text-lg text-yellow-500">⭐ {habit.points}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Tipo</p>
                    <p className="font-medium">{getTrackingTypeText(habit.trackingType)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Objetivo</p>
                    <p className="font-medium">{habit.targetCount}{habit.trackingType === TrackingType.DURATION ? ' min' : ''}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    📊 Ver Detalles
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  >
                    ⚙️
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Habit Card */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 border-dashed flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <PlusIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Crear Nuevo Hábito</h3>
              <p className="text-gray-400 text-sm mb-4">Añade un nuevo hábito a tu rutina</p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Crear Hábito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 