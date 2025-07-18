"use client"
import { useState, useEffect } from "react"
import { ExerciseType, IntensityLevel, UserLevel } from "@prisma/client"
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlayIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline"
import Image from "next/image"

interface Exercise {
  id: string
  name: string
  description?: string
  type: ExerciseType
  intensity: IntensityLevel
  level: UserLevel
  technique?: string
  videoUrl?: string
  imageUrl?: string
  targetMuscles: string[]
  createdAt: string
}

export default function WorkoutsPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<ExerciseType | 'ALL'>('ALL')
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel | 'ALL'>('ALL')
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | 'ALL'>('ALL')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedType !== 'ALL') params.set('type', selectedType)
        if (selectedIntensity !== 'ALL') params.set('intensity', selectedIntensity)
        if (selectedLevel !== 'ALL') params.set('level', selectedLevel)
        if (searchTerm) params.set('search', searchTerm)

        const response = await fetch(`/api/exercises?${params}`)
        const data = await response.json()
        
        if (data.exercises) {
          setExercises(data.exercises)
        }
      } catch (error) {
        console.error('Error fetching exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [selectedType, selectedIntensity, selectedLevel, searchTerm])

  const getTypeIcon = (type: ExerciseType) => {
    switch (type) {
      case 'STRENGTH': return '💪'
      case 'CARDIO': return '🏃'
      case 'MOBILITY': return '🤸'
      case 'FLEXIBILITY': return '🧘'
      default: return '🏋️'
    }
  }

  const getTypeColor = (type: ExerciseType) => {
    switch (type) {
      case 'STRENGTH': return 'bg-red-500'
      case 'CARDIO': return 'bg-blue-500'
      case 'MOBILITY': return 'bg-green-500'
      case 'FLEXIBILITY': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getIntensityColor = (intensity: IntensityLevel) => {
    switch (intensity) {
      case 'LOW': return 'bg-green-500'
      case 'MEDIUM': return 'bg-yellow-500'
      case 'HIGH': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getLevelColor = (level: UserLevel) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-500'
      case 'INTERMEDIATE': return 'bg-yellow-500'
      case 'ADVANCED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeText = (type: ExerciseType) => {
    switch (type) {
      case 'STRENGTH': return 'Fuerza'
      case 'CARDIO': return 'Cardio'
      case 'MOBILITY': return 'Movilidad'
      case 'FLEXIBILITY': return 'Flexibilidad'
      default: return 'Desconocido'
    }
  }

  const getIntensityText = (intensity: IntensityLevel) => {
    switch (intensity) {
      case 'LOW': return 'Baja'
      case 'MEDIUM': return 'Media'
      case 'HIGH': return 'Alta'
      default: return 'Desconocida'
    }
  }

  const getLevelText = (level: UserLevel) => {
    switch (level) {
      case 'BEGINNER': return 'Principiante'
      case 'INTERMEDIATE': return 'Intermedio'
      case 'ADVANCED': return 'Avanzado'
      default: return 'Desconocido'
    }
  }

  const stats = {
    total: exercises.length,
    strength: exercises.filter(e => e.type === 'STRENGTH').length,
    cardio: exercises.filter(e => e.type === 'CARDIO').length,
    mobility: exercises.filter(e => e.type === 'MOBILITY').length,
    flexibility: exercises.filter(e => e.type === 'FLEXIBILITY').length
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Entrenamientos</h1>
            <p className="text-gray-400">Administra ejercicios y rutinas de entrenamiento</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo Ejercicio
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Ejercicios</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Fuerza</p>
            <p className="text-2xl font-bold text-red-500">{stats.strength}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Cardio</p>
            <p className="text-2xl font-bold text-blue-500">{stats.cardio}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Movilidad</p>
            <p className="text-2xl font-bold text-green-500">{stats.mobility}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Flexibilidad</p>
            <p className="text-2xl font-bold text-purple-500">{stats.flexibility}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExerciseType | 'ALL')}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="STRENGTH">Fuerza</option>
              <option value="CARDIO">Cardio</option>
              <option value="MOBILITY">Movilidad</option>
              <option value="FLEXIBILITY">Flexibilidad</option>
            </select>

            {/* Intensity Filter */}
            <select
              value={selectedIntensity}
              onChange={(e) => setSelectedIntensity(e.target.value as IntensityLevel | 'ALL')}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="ALL">Todas las intensidades</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as UserLevel | 'ALL')}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="ALL">Todos los niveles</option>
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>
          </div>
        </div>

        {/* Exercises Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                {/* Exercise Image/Video */}
                <div className="relative h-48 bg-gray-800">
                  {exercise.imageUrl ? (
                    <Image
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">{getTypeIcon(exercise.type)}</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`${getTypeColor(exercise.type)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {getTypeText(exercise.type)}
                    </span>
                    <span className={`${getIntensityColor(exercise.intensity)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {getIntensityText(exercise.intensity)}
                    </span>
                  </div>

                  {/* Video Icon */}
                  {exercise.videoUrl && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/60 rounded-full p-2">
                        <PlayIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Level Badge */}
                  <div className="absolute bottom-4 right-4">
                    <span className={`${getLevelColor(exercise.level)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {getLevelText(exercise.level)}
                    </span>
                  </div>
                </div>

                {/* Exercise Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{exercise.name}</h3>
                  
                  {exercise.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{exercise.description}</p>
                  )}

                  {/* Target Muscles */}
                  {exercise.targetMuscles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-500 text-sm mb-2">Músculos trabajados:</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.targetMuscles.slice(0, 3).map((muscle, index) => (
                          <span key={index} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {muscle}
                          </span>
                        ))}
                        {exercise.targetMuscles.length > 3 && (
                          <span className="text-gray-500 text-xs">+{exercise.targetMuscles.length - 3} más</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <ClockIcon className="h-4 w-4" />
                    <span>Creado: {new Date(exercise.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Ver Detalle
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors">
                      ⚙️
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {exercises.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <ChartBarIcon className="h-24 w-24 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No se encontraron ejercicios</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || selectedType !== 'ALL' || selectedIntensity !== 'ALL' || selectedLevel !== 'ALL'
                    ? 'Intenta ajustar los filtros para ver más ejercicios.'
                    : 'Comienza creando tu primer ejercicio.'
                  }
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Crear Primer Ejercicio
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Section */}
        <div className="mt-12 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Crear Ejercicio
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5" />
              Crear Rutina
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-2">
              <FireIcon className="h-5 w-5" />
              Ver Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Create Exercise Modal - Placeholder */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Crear Nuevo Ejercicio</h3>
            <p className="text-gray-400 mb-6">
              El formulario de creación estará disponible en la próxima actualización.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors">
                Próximamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 