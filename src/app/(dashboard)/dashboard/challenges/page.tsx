"use client"
import { useState } from "react"
import { HabitCategory } from "@prisma/client"
import { PlusIcon, TrophyIcon, CalendarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import ChallengeCard from "@/components/challenges/ChallengeCard"
import CreateModal from "@/components/dashboard/CreateModal"
import { useCreateModal } from "@/hooks/useCreateModal"
import { useChallenges, type CreateChallengeData } from "@/hooks/useChallenges"

export default function ChallengesPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('active')
  
  // Modal hook
  const { isOpen, modalType, loading: modalLoading, openModal, closeModal, setLoading: setModalLoading, getModalConfig } = useCreateModal()
  
  // Challenges hook
  const { 
    challenges, 
    loading: challengesLoading, 
    error: challengesError, 
    createChallenge, 
    updateChallengeProgress 
  } = useChallenges(activeFilter)

  const handleCreateChallenge = async (data: Record<string, string | number | boolean | File | null>) => {
    try {
      setModalLoading(true)
      
      const challengeData: CreateChallengeData = {
        name: data.name as string,
        description: data.description as string,
        category: data.category as HabitCategory,
        targetValue: data.targetValue as number,
        startDate: data.startDate as string,
        endDate: data.endDate as string,
        reward: data.reward as string
      }

      await createChallenge(challengeData)
      closeModal()
    } catch (error) {
      console.error("Error creating challenge:", error)
      throw error
    } finally {
      setModalLoading(false)
    }
  }

  const handleUpdateProgress = async (challengeId: string, progress: number) => {
    try {
      await updateChallengeProgress(challengeId, progress)
    } catch (error) {
      console.error("Error updating challenge progress:", error)
    }
  }

  // Calculate stats from real data
  const stats = {
    total: challenges.length,
    active: challenges.filter(c => !c.isCompleted).length,
    completed: challenges.filter(c => c.isCompleted).length,
    completionRate: challenges.length > 0 
      ? Math.round((challenges.filter(c => c.isCompleted).length / challenges.length) * 100)
      : 0
  }

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


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-gray-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 leading-tight">
            Desafíos
            <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              {" "}Personales
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Supera tus límites con desafíos personalizados y alcanza tus objetivos
          </p>
        </div>

        {/* Error Message */}
        {challengesError && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Error al cargar desafíos</h3>
                <p className="text-red-600 text-sm">{challengesError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-yellow-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Total Desafíos</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {challengesLoading ? "..." : stats.total}
            </p>
          </div>

          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Activos</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {challengesLoading ? "..." : stats.active}
            </p>
          </div>

          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Completados</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {challengesLoading ? "..." : stats.completed}
            </p>
          </div>

          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-lg">📊</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Tasa de Éxito</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {challengesLoading ? "..." : `${stats.completionRate}%`}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-12">
          <div className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'active', label: 'Activos', count: stats.active },
                { key: 'completed', label: 'Completados', count: stats.completed },
                { key: 'all', label: 'Todos', count: stats.total }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeFilter === filter.key
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeFilter === filter.key
                      ? 'bg-white/20'
                      : 'bg-gray-200 group-hover:bg-gray-300'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Challenges List */}
          <div className="xl:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Mis Desafíos</h2>
            <div className="space-y-6">
              {challengesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-xl p-6 animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : challenges.length > 0 ? (
                challenges.map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge}
                    onUpdate={handleUpdateProgress}
                  />
                ))
              ) : (
                <div className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-12 text-center shadow-lg">
                  <div className="p-4 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <TrophyIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No hay desafíos {activeFilter === 'active' ? 'activos' : activeFilter === 'completed' ? 'completados' : ''}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {activeFilter === 'active' && "Crea un nuevo desafío para comenzar tu próximo objetivo"}
                    {activeFilter === 'completed' && "Completa algunos desafíos para ver tus logros aquí"}
                    {activeFilter === 'all' && "Crea tu primer desafío para empezar"}
                  </p>
                  <button 
                    onClick={() => openModal('challenge')}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Crear Desafío
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Challenge Templates */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Plantillas de Desafíos</h2>
            <div className="space-y-6">
              {challengeTemplates.map((template, index) => {
                const categoryInfo = getCategoryInfo(template.category)
                return (
                  <div key={index} className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${categoryInfo.color} flex items-center justify-center text-lg`}>
                          {categoryInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600">{categoryInfo.name}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getDifficultyColor(template.difficulty)} bg-gray-100`}>
                        {template.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.description}</p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-gray-500 text-sm font-medium">Duración: {template.duration} días</span>
                      <span className="text-yellow-600 text-sm font-medium">{template.reward}</span>
                    </div>
                    
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Comenzar Desafío
                    </button>
                  </div>
                )
              })}

              {/* Custom Challenge */}
              <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 border-dashed hover:border-red-300 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <PlusIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Desafío Personalizado</h3>
                <p className="text-gray-600 text-sm mb-6">Crea tu propio desafío único</p>
                <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Crear Personalizado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {modalType && getModalConfig && (
        <CreateModal
          isOpen={isOpen}
          onClose={closeModal}
          onSubmit={handleCreateChallenge}
          title={getModalConfig.title}
          description={getModalConfig.description}
          fields={getModalConfig.fields}
          submitText={getModalConfig.submitText}
          loading={modalLoading}
          icon={getModalConfig.icon}
        />
      )}
    </div>
  )
} 