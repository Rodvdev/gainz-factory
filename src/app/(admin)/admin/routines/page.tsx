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
  Clock,
  Users,
  Eye,
  User,
  CheckCircle
} from "lucide-react"
import { UserLevel, ExerciseType, IntensityLevel } from "@prisma/client"

interface Exercise {
  id: string
  name: string
  type: ExerciseType
  level: UserLevel
  intensity: IntensityLevel
  description?: string
  technique?: string
  videoUrl?: string
  imageUrl?: string
  targetMuscles: string[]
}

interface RoutineExercise {
  id: string
  order: number
  sets: number
  reps: number
  restSeconds: number
  exercise: Exercise
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface WorkoutRoutine {
  id: string
  title: string
  objective?: string
  level: UserLevel
  duration?: number
  isPublic: boolean
  createdAt: string
  user: User
  exercises: RoutineExercise[]
  _count: {
    exercises: number
  }
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<UserLevel | "ALL">("ALL")
  const [publicFilter, setPublicFilter] = useState<"ALL" | "PUBLIC" | "PRIVATE">("ALL")
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null)
  const [showRoutineModal, setShowRoutineModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    objective: "",
    level: "BEGINNER" as UserLevel,
    duration: 30,
    isPublic: false,
    exercises: [] as Array<{
      exerciseId: string
      sets: number
      reps: number
      restSeconds: number
    }>
  })
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        
        // Fetch routines
        const routinesResponse = await fetch("/api/admin/routines", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (routinesResponse.ok) {
          const routinesData = await routinesResponse.json()
          setRoutines(routinesData.routines || [])
        }

        // Fetch available exercises for the form
        const exercisesResponse = await fetch("/api/admin/exercises", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (exercisesResponse.ok) {
          const exercisesData = await exercisesResponse.json()
          setAvailableExercises(exercisesData.exercises || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredRoutines = routines.filter(routine => {
    const matchesSearch = 
      routine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.objective?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLevel = levelFilter === "ALL" || routine.level === levelFilter
    const matchesPublic = publicFilter === "ALL" || 
      (publicFilter === "PUBLIC" && routine.isPublic) ||
      (publicFilter === "PRIVATE" && !routine.isPublic)
    
    return matchesSearch && matchesLevel && matchesPublic
  })

  const handleCreateRoutine = () => {
    setSelectedRoutine(null)
    setIsEditing(false)
    setFormData({
      title: "",
      objective: "",
      level: "BEGINNER",
      duration: 30,
      isPublic: false,
      exercises: []
    })
    setShowRoutineModal(true)
  }

  const handleEditRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine)
    setIsEditing(true)
    setFormData({
      title: routine.title,
      objective: routine.objective || "",
      level: routine.level,
      duration: routine.duration || 30,
      isPublic: routine.isPublic,
      exercises: routine.exercises.map(re => ({
        exerciseId: re.exercise.id,
        sets: re.sets,
        reps: re.reps,
        restSeconds: re.restSeconds
      }))
    })
    setShowRoutineModal(true)
  }

  const handleUpdateRoutine = async () => {
    if (!formData.title.trim() || formData.exercises.length === 0) return

    try {
      const token = localStorage.getItem("authToken")
      
      const url = isEditing 
        ? `/api/admin/routines/${selectedRoutine?.id}`
        : "/api/admin/routines"
      
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        if (isEditing) {
          setRoutines(routines.map(r => r.id === selectedRoutine?.id ? data.routine : r))
        } else {
          setRoutines([data.routine, ...routines])
        }
        setShowRoutineModal(false)
        setSelectedRoutine(null)
      }
    } catch (error) {
      console.error("Error saving routine:", error)
    }
  }

  const handleDeleteRoutine = async (routineId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta rutina?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/routines/${routineId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setRoutines(routines.filter(r => r.id !== routineId))
      }
    } catch (error) {
      console.error("Error deleting routine:", error)
    }
  }

  const addExerciseToRoutine = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, {
        exerciseId: "",
        sets: 3,
        reps: 12,
        restSeconds: 60
      }]
    })
  }

  const removeExerciseFromRoutine = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    })
  }

  const updateExerciseInRoutine = (index: number, field: string, value: string | number) => {
    const newExercises = [...formData.exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setFormData({ ...formData, exercises: newExercises })
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Rutinas</h1>
          <p className="text-gray-600 mt-2">Administra las rutinas de entrenamiento</p>
        </div>
        <button 
          onClick={handleCreateRoutine}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Rutina</span>
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
              <p className="text-sm font-medium text-gray-600">Total Rutinas</p>
              <p className="text-2xl font-bold text-gray-900">{routines.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Públicas</p>
              <p className="text-2xl font-bold text-gray-900">
                {routines.filter(r => r.isPublic).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Principiante</p>
              <p className="text-2xl font-bold text-gray-900">
                {routines.filter(r => r.level === "BEGINNER").length}
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
              <p className="text-sm font-medium text-gray-600">Usuarios Únicos</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(routines.map(r => r.user.id)).size}
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
                placeholder="Título, objetivo, usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibilidad</label>
            <select
              value={publicFilter}
              onChange={(e) => setPublicFilter(e.target.value as "ALL" | "PUBLIC" | "PRIVATE")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todas</option>
              <option value="PUBLIC">Públicas</option>
              <option value="PRIVATE">Privadas</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("")
                setLevelFilter("ALL")
                setPublicFilter("ALL")
              }}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Routines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map((routine) => (
          <motion.div
            key={routine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Routine Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {routine.title}
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditRoutine(routine)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoutine(routine.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {routine.objective && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {routine.objective}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(routine.level)}`}>
                  {routine.level}
                </span>
                {routine.isPublic ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Público
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Privado
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>{routine.user.firstName} {routine.user.lastName}</span>
              </div>
            </div>

            {/* Routine Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  <span>{routine._count.exercises} ejercicios</span>
                </div>
                {routine.duration && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{routine.duration} min</span>
                  </div>
                )}
              </div>

              {/* Exercise Types Preview */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Tipos de ejercicios:</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(routine.exercises.map(re => re.exercise.type))).slice(0, 3).map((type, index) => (
                    <span
                      key={index}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(type)}`}
                    >
                      {type}
                    </span>
                  ))}
                  {Array.from(new Set(routine.exercises.map(re => re.exercise.type))).length > 3 && (
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      +{Array.from(new Set(routine.exercises.map(re => re.exercise.type))).length - 3} más
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(routine.createdAt).toLocaleDateString('es-ES')}
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

      {/* Routine Modal */}
      {showRoutineModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditing ? "Editar Rutina" : "Nueva Rutina"}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objetivo
                  </label>
                  <textarea
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                      Rutina pública
                    </label>
                  </div>
                </div>

                {/* Exercises Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Ejercicios ({formData.exercises.length})
                    </label>
                    <button
                      onClick={addExerciseToRoutine}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Ejercicio
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.exercises.map((exercise, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Ejercicio {index + 1}</span>
                          <button
                            onClick={() => removeExerciseFromRoutine(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Ejercicio
                            </label>
                            <select
                              value={exercise.exerciseId}
                              onChange={(e) => updateExerciseInRoutine(index, "exerciseId", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                              <option value="">Seleccionar ejercicio</option>
                              {availableExercises.map(ex => (
                                <option key={ex.id} value={ex.id}>
                                  {ex.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Series
                            </label>
                            <input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => updateExerciseInRoutine(index, "sets", parseInt(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Repeticiones
                            </label>
                            <input
                              type="number"
                              value={exercise.reps}
                              onChange={(e) => updateExerciseInRoutine(index, "reps", parseInt(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Descanso (seg)
                            </label>
                            <input
                              type="number"
                              value={exercise.restSeconds}
                              onChange={(e) => updateExerciseInRoutine(index, "restSeconds", parseInt(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRoutineModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleUpdateRoutine}
                  disabled={!formData.title.trim() || formData.exercises.length === 0}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg"
                >
                  {isEditing ? "Actualizar" : "Crear"} Rutina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
