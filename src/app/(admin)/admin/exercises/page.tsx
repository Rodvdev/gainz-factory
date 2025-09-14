"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Dumbbell, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Target,
  Zap,
  Users,
  Eye,
  Play
} from "lucide-react"
import { ExerciseType, IntensityLevel, UserLevel } from "@prisma/client"
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

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<ExerciseType | "ALL">("ALL")
  const [levelFilter, setLevelFilter] = useState<UserLevel | "ALL">("ALL")
  const [intensityFilter, setIntensityFilter] = useState<IntensityLevel | "ALL">("ALL")
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "STRENGTH" as ExerciseType,
    intensity: "LOW" as IntensityLevel,
    level: "BEGINNER" as UserLevel,
    technique: "",
    videoUrl: "",
    imageUrl: "",
    targetMuscles: ""
  })

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("/api/admin/exercises", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setExercises(data.exercises || [])
        }
      } catch (error) {
        console.error("Error fetching exercises:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.targetMuscles.some(muscle => 
        muscle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesType = typeFilter === "ALL" || exercise.type === typeFilter
    const matchesLevel = levelFilter === "ALL" || exercise.level === levelFilter
    const matchesIntensity = intensityFilter === "ALL" || exercise.intensity === intensityFilter
    
    return matchesSearch && matchesType && matchesLevel && matchesIntensity
  })

  const handleCreateExercise = () => {
    setSelectedExercise(null)
    setIsEditing(false)
    setFormData({
      name: "",
      description: "",
      type: "STRENGTH",
      intensity: "LOW",
      level: "BEGINNER",
      technique: "",
      videoUrl: "",
      imageUrl: "",
      targetMuscles: ""
    })
    setShowExerciseModal(true)
  }

  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setIsEditing(true)
    setFormData({
      name: exercise.name,
      description: exercise.description || "",
      type: exercise.type,
      intensity: exercise.intensity,
      level: exercise.level,
      technique: exercise.technique || "",
      videoUrl: exercise.videoUrl || "",
      imageUrl: exercise.imageUrl || "",
      targetMuscles: exercise.targetMuscles.join(", ")
    })
    setShowExerciseModal(true)
  }

  const handleUpdateExercise = async () => {
    if (!formData.name.trim()) return

    try {
      const token = localStorage.getItem("authToken")
      const exerciseData = {
        ...formData,
        targetMuscles: formData.targetMuscles.split(",").map(m => m.trim()).filter(m => m)
      }

      const url = isEditing 
        ? `/api/admin/exercises/${selectedExercise?.id}`
        : "/api/admin/exercises"
      
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(exerciseData)
      })

      if (response.ok) {
        const data = await response.json()
        if (isEditing) {
          setExercises(exercises.map(ex => ex.id === selectedExercise?.id ? data.exercise : ex))
        } else {
          setExercises([data.exercise, ...exercises])
        }
        setShowExerciseModal(false)
        setSelectedExercise(null)
      }
    } catch (error) {
      console.error("Error saving exercise:", error)
    }
  }

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este ejercicio?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/exercises/${exerciseId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setExercises(exercises.filter(ex => ex.id !== exerciseId))
      }
    } catch (error) {
      console.error("Error deleting exercise:", error)
    }
  }

  const getTypeBadgeColor = (type: ExerciseType) => {
    switch (type) {
      case "STRENGTH":
        return "bg-red-100 text-red-800"
      case "CARDIO":
        return "bg-blue-100 text-blue-800"
      case "MOBILITY":
        return "bg-green-100 text-green-800"
      case "FLEXIBILITY":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelBadgeColor = (level: UserLevel) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800"
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800"
      case "ADVANCED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIntensityBadgeColor = (intensity: IntensityLevel) => {
    switch (intensity) {
      case "LOW":
        return "bg-green-100 text-green-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "HIGH":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Ejercicios</h1>
          <p className="text-gray-600 mt-2">Administra la biblioteca de ejercicios</p>
        </div>
        <button 
          onClick={handleCreateExercise}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Ejercicio</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Dumbbell className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ejercicios</p>
              <p className="text-2xl font-bold text-gray-900">{exercises.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fuerza</p>
              <p className="text-2xl font-bold text-gray-900">
                {exercises.filter(e => e.type === "STRENGTH").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cardio</p>
              <p className="text-2xl font-bold text-gray-900">
                {exercises.filter(e => e.type === "CARDIO").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Principiante</p>
              <p className="text-2xl font-bold text-gray-900">
                {exercises.filter(e => e.level === "BEGINNER").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nombre, músculos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ExerciseType | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="STRENGTH">Fuerza</option>
              <option value="CARDIO">Cardio</option>
              <option value="MOBILITY">Movilidad</option>
              <option value="FLEXIBILITY">Flexibilidad</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as UserLevel | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todos los niveles</option>
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Intensidad</label>
            <select
              value={intensityFilter}
              onChange={(e) => setIntensityFilter(e.target.value as IntensityLevel | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todas las intensidades</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Exercise Image/Video */}
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {exercise.videoUrl ? (
                <div className="relative w-full h-full">
                  <video
                    src={exercise.videoUrl}
                    className="w-full h-full object-cover"
                    poster={exercise.imageUrl}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              ) : exercise.imageUrl ? (
                <Image
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  width={400}
                  height={192}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Dumbbell className="w-16 h-16 text-gray-400" />
              )}
            </div>

            {/* Exercise Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {exercise.name}
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditExercise(exercise)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {exercise.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {exercise.description}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(exercise.type)}`}>
                  {exercise.type}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(exercise.level)}`}>
                  {exercise.level}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIntensityBadgeColor(exercise.intensity)}`}>
                  {exercise.intensity}
                </span>
              </div>

              {/* Target Muscles */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Músculos objetivo:</p>
                <div className="flex flex-wrap gap-1">
                  {exercise.targetMuscles.slice(0, 3).map((muscle, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {muscle}
                    </span>
                  ))}
                  {exercise.targetMuscles.length > 3 && (
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      +{exercise.targetMuscles.length - 3} más
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(exercise.createdAt).toLocaleDateString('es-ES')}
                </span>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver detalles
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Exercise Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditing ? "Editar Ejercicio" : "Nuevo Ejercicio"}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ExerciseType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="STRENGTH">Fuerza</option>
                      <option value="CARDIO">Cardio</option>
                      <option value="MOBILITY">Movilidad</option>
                      <option value="FLEXIBILITY">Flexibilidad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as UserLevel })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="BEGINNER">Principiante</option>
                      <option value="INTERMEDIATE">Intermedio</option>
                      <option value="ADVANCED">Avanzado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intensidad
                    </label>
                    <select
                      value={formData.intensity}
                      onChange={(e) => setFormData({ ...formData, intensity: e.target.value as IntensityLevel })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="LOW">Baja</option>
                      <option value="MEDIUM">Media</option>
                      <option value="HIGH">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Técnica
                  </label>
                  <textarea
                    value={formData.technique}
                    onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Instrucciones técnicas del ejercicio..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Video
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la Imagen
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Músculos Objetivo (separados por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.targetMuscles}
                    onChange={(e) => setFormData({ ...formData, targetMuscles: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Pecho, Tríceps, Hombros..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleUpdateExercise}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  {isEditing ? "Actualizar" : "Crear"} Ejercicio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
