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
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-gray-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              Entrenamientos
              <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                {" "}y Ejercicios
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Administra ejercicios y rutinas de entrenamiento personalizadas
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            Nuevo Ejercicio
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Total Ejercicios</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 text-lg">💪</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Fuerza</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.strength}</p>
          </div>

          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-lg">🏃</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Cardio</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.cardio}</p>
          </div>

          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-lg">🤸</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Movilidad</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.mobility}</p>
          </div>

          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-lg">🧘</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Flexibilidad</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.flexibility}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-8 mb-12 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <FunnelIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Filtros de Búsqueda</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExerciseType | 'ALL')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-gray-900 bg-white"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-gray-900 bg-white"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-gray-900 bg-white"
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
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              <p className="text-gray-600 font-medium">Cargando ejercicios...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                {/* Exercise Image/Video */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {exercise.imageUrl ? (
                    <Image
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-8xl">{getTypeIcon(exercise.type)}</span>
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`${getTypeColor(exercise.type)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                      {getTypeText(exercise.type)}
                    </span>
                    <span className={`${getIntensityColor(exercise.intensity)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                      {getIntensityText(exercise.intensity)}
                    </span>
                  </div>

                  {/* Video Icon */}
                  {exercise.videoUrl && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full p-3 group-hover:bg-red-600 transition-colors duration-200">
                        <PlayIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Level Badge */}
                  <div className="absolute bottom-4 right-4">
                    <span className={`${getLevelColor(exercise.level)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                      {getLevelText(exercise.level)}
                    </span>
                  </div>
                </div>

                {/* Exercise Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                    {exercise.name}
                  </h3>
                  
                  {exercise.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{exercise.description}</p>
                  )}

                  {/* Target Muscles */}
                  {exercise.targetMuscles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm font-medium mb-2">Músculos trabajados:</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.targetMuscles.slice(0, 3).map((muscle, index) => (
                          <span key={index} className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
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
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <ClockIcon className="h-4 w-4" />
                    <span>Creado: {new Date(exercise.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Ver Detalle
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-all duration-200 group-hover:bg-red-50 group-hover:text-red-600">
                      ⚙️
                    </button>
                    <button className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 px-4 py-3 rounded-lg transition-all duration-200">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {exercises.length === 0 && !loading && (
              <div className="col-span-full text-center py-20">
                <div className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-12 max-w-md mx-auto">
                  <div className="p-4 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <ChartBarIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No se encontraron ejercicios</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {searchTerm || selectedType !== 'ALL' || selectedIntensity !== 'ALL' || selectedLevel !== 'ALL'
                      ? 'Intenta ajustar los filtros para ver más ejercicios.'
                      : 'Comienza creando tu primer ejercicio para tu rutina.'
                    }
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Crear Primer Ejercicio
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Section */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="group bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
              Crear Ejercicio
            </button>
            <button className="group bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3">
              <ChartBarIcon className="h-5 w-5" />
              Crear Rutina
            </button>
            <button className="group bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3">
              <FireIcon className="h-5 w-5" />
              Ver Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Create Exercise Modal - Placeholder */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ChartBarIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Crear Nuevo Ejercicio</h3>
              <p className="text-gray-600 leading-relaxed">
                El formulario de creación estará disponible en la próxima actualización.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Cerrar
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Próximamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 