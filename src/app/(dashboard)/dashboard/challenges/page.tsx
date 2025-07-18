"use client"
import { useState } from "react"
import { HabitCategory } from "@prisma/client"
import { PlusIcon, TrophyIcon, CalendarIcon } from "@heroicons/react/24/outline"
import ChallengeCard from "@/components/challenges/ChallengeCard"

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

export default function ChallengesPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('active')

  // Sample data - will be replaced with real data
  const sampleChallenges: Challenge[] = [
    {
      id: "1",
      userId: "user-1",
      name: "30 Días de Meditación",
      description: "Medita al menos 10 minutos cada día durante 30 días consecutivos para desarrollar el hábito de mindfulness",
      category: HabitCategory.MORNING_ROUTINE,
      startDate: "2024-01-01",
      endDate: "2024-01-30",
      targetValue: 30,
      currentValue: 21,
      isCompleted: false,
      reward: "🏆 Insignia de Mindfulness Master + 100 puntos bonus"
    },
    {
      id: "2",
      userId: "user-1",
      name: "Semana de Fuerza",
      description: "Completa 5 entrenamientos de fuerza esta semana para construir músculo y resistencia",
      category: HabitCategory.PHYSICAL_TRAINING,
      startDate: "2024-01-15",
      endDate: "2024-01-21",
      targetValue: 5,
      currentValue: 3,
      isCompleted: false,
      reward: "💪 Insignia de Guerrero + 50 puntos"
    },
    {
      id: "3",
      userId: "user-1",
      name: "14 Días de Lectura",
      description: "Lee al menos 30 páginas cada día durante 2 semanas para expandir tu conocimiento",
      category: HabitCategory.PERSONAL_DEVELOPMENT,
      startDate: "2024-01-01",
      endDate: "2024-01-14",
      targetValue: 14,
      currentValue: 14,
      isCompleted: true,
      reward: "📚 Insignia de Sabio + 75 puntos"
    },
    {
      id: "4",
      userId: "user-1",
      name: "Hidratación Perfecta",
      description: "Bebe 8 vasos de agua cada día durante una semana completa",
      category: HabitCategory.NUTRITION,
      startDate: "2024-01-10",
      endDate: "2024-01-16",
      targetValue: 7,
      currentValue: 7,
      isCompleted: true,
      reward: "💧 Insignia de Hidratación + 30 puntos"
    },
    {
      id: "5",
      userId: "user-1",
      name: "Trabajo Profundo",
      description: "Dedica 2 horas de trabajo profundo sin distracciones durante 10 días",
      category: HabitCategory.DEEP_WORK,
      startDate: "2024-01-18",
      endDate: "2024-01-27",
      targetValue: 10,
      currentValue: 2,
      isCompleted: false,
      reward: "🎯 Insignia de Concentración + 80 puntos"
    }
  ]

  const filteredChallenges = sampleChallenges.filter(challenge => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'active') return !challenge.isCompleted
    if (activeFilter === 'completed') return challenge.isCompleted
    return true
  })

  const challengeTemplates = [
    {
      name: "7 Días de Ejercicio",
      description: "Entrena 7 días consecutivos",
      category: HabitCategory.PHYSICAL_TRAINING,
      duration: 7,
      reward: "💪 Badge de Constancia",
      difficulty: "Intermedio"
    },
    {
      name: "Rutina Matutina Perfecta",
      description: "Completa tu rutina matutina 14 días seguidos",
      category: HabitCategory.MORNING_ROUTINE,
      duration: 14,
      reward: "🌅 Badge de Madrugador",
      difficulty: "Fácil"
    },
    {
      name: "Mes de Lectura",
      description: "Lee al menos 30 páginas cada día durante un mes",
      category: HabitCategory.PERSONAL_DEVELOPMENT,
      duration: 30,
      reward: "📚 Badge de Erudito",
      difficulty: "Avanzado"
    },
    {
      name: "Semana de Reflexión",
      description: "Escribe en tu diario cada día durante una semana",
      category: HabitCategory.REFLECTION,
      duration: 7,
      reward: "💭 Badge de Introspección",
      difficulty: "Fácil"
    }
  ]

  const getCategoryInfo = (category?: HabitCategory) => {
    const categoryMap = {
      [HabitCategory.MORNING_ROUTINE]: { name: 'Rutina Matutina', icon: '🌅', color: 'bg-blue-600' },
      [HabitCategory.PHYSICAL_TRAINING]: { name: 'Entrenamiento', icon: '💪', color: 'bg-red-600' },
      [HabitCategory.NUTRITION]: { name: 'Nutrición', icon: '🥗', color: 'bg-green-600' },
      [HabitCategory.DEEP_WORK]: { name: 'Trabajo Profundo', icon: '🎯', color: 'bg-orange-600' },
      [HabitCategory.PERSONAL_DEVELOPMENT]: { name: 'Desarrollo Personal', icon: '📚', color: 'bg-purple-600' },
      [HabitCategory.SOCIAL_CHARISMA]: { name: 'Carisma Social', icon: '🤝', color: 'bg-pink-600' },
      [HabitCategory.REFLECTION]: { name: 'Reflexión', icon: '💭', color: 'bg-indigo-600' },
      [HabitCategory.SLEEP_RECOVERY]: { name: 'Sueño y Descanso', icon: '😴', color: 'bg-slate-600' },
    }
    return category ? categoryMap[category] : { name: 'General', icon: '🎯', color: 'bg-gray-600' }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-500'
      case 'Intermedio': return 'text-yellow-500'
      case 'Avanzado': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const stats = {
    total: sampleChallenges.length,
    active: sampleChallenges.filter(c => !c.isCompleted).length,
    completed: sampleChallenges.filter(c => c.isCompleted).length,
    completionRate: Math.round((sampleChallenges.filter(c => c.isCompleted).length / sampleChallenges.length) * 100)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Desafíos</h1>
          <p className="text-gray-400">Supera tus límites con desafíos personalizados</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Desafíos</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Activos</p>
                <p className="text-2xl font-bold text-blue-500">{stats.active}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completados</p>
                <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
              </div>
              <span className="text-green-500 text-2xl">✓</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-purple-500">{stats.completionRate}%</p>
              </div>
              <span className="text-purple-500 text-2xl">📊</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex gap-4">
            {[
              { key: 'active', label: 'Activos', count: stats.active },
              { key: 'completed', label: 'Completados', count: stats.completed },
              { key: 'all', label: 'Todos', count: stats.total }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{filter.label}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Challenges List */}
          <div className="xl:col-span-2">
            <h2 className="text-xl font-bold mb-6">Mis Desafíos</h2>
            <div className="space-y-6">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge}
                  />
                ))
              ) : (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                  <TrophyIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-300 mb-2">
                    No hay desafíos {activeFilter === 'active' ? 'activos' : activeFilter === 'completed' ? 'completados' : ''}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {activeFilter === 'active' && "Crea un nuevo desafío para comenzar tu próximo objetivo"}
                    {activeFilter === 'completed' && "Completa algunos desafíos para ver tus logros aquí"}
                    {activeFilter === 'all' && "Crea tu primer desafío para empezar"}
                  </p>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Crear Desafío
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Challenge Templates */}
          <div>
            <h2 className="text-xl font-bold mb-6">Plantillas de Desafíos</h2>
            <div className="space-y-4">
              {challengeTemplates.map((template, index) => {
                const categoryInfo = getCategoryInfo(template.category)
                return (
                  <div key={index} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${categoryInfo.color} flex items-center justify-center`}>
                          {categoryInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-bold">{template.name}</h3>
                          <p className="text-sm text-gray-400">{categoryInfo.name}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-sm">Duración: {template.duration} días</span>
                      <span className="text-yellow-500 text-sm">{template.reward}</span>
                    </div>
                    
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Comenzar Desafío
                    </button>
                  </div>
                )
              })}

              {/* Custom Challenge */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 border-dashed p-6 text-center">
                <PlusIcon className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-300 mb-2">Desafío Personalizado</h3>
                <p className="text-gray-400 text-sm mb-4">Crea tu propio desafío único</p>
                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Crear Personalizado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 