"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Clock,
  Target,
  CheckCircle,
  X
} from "lucide-react"
import { ContentCategory, UserLevel, TaskType } from "@prisma/client"

interface DailyTask {
  id: string
  dayOfWeek: number
  taskType: TaskType
  title: string
  description?: string
  taskData?: any
  isRequired: boolean
  estimatedDuration?: number
  order: number
}

interface WeeklyPlan {
  id: string
  weekNumber: number
  title?: string
  description?: string
  dailyTasks: DailyTask[]
}

interface Programme {
  id: string
  title: string
  description?: string
  category: ContentCategory
  level?: UserLevel
  duration?: number
  isActive: boolean
  isPublic: boolean
  createdAt: string
  weeklyPlans: WeeklyPlan[]
}

const DAYS_OF_WEEK = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
]

const TASK_TYPE_LABELS = {
  WORKOUT: "Entrenamiento",
  CARDIO: "Cardio",
  VIDEO: "Video",
  NUTRITION: "Nutrición",
  RECORD_PROGRESS: "Registrar Progreso",
  PHOTO: "Foto",
  SESSION: "Sesión",
  MESSAGE: "Mensaje",
  FORM: "Formulario"
}

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<ContentCategory | "ALL">("ALL")
  const [levelFilter, setLevelFilter] = useState<UserLevel | "ALL">("ALL")
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)
  const [showProgrammeModal, setShowProgrammeModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "EXERCISE" as ContentCategory,
    level: "BEGINNER" as UserLevel,
    duration: 4,
    isPublic: false,
    autoStart: false,
    weeklyPlans: [] as Array<{
      weekNumber: number
      title: string
      description: string
      dailyTasks: Array<{
        dayOfWeek: number
        taskType: TaskType
        title: string
        description: string
        taskData: any
        isRequired: boolean
        estimatedDuration: number
        order: number
      }>
    }>
  })

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("/api/admin/programmes", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProgrammes(data.programmes || [])
        }
      } catch (error) {
        console.error("Error fetching programmes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgrammes()
  }, [])

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = 
      programme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "ALL" || programme.category === categoryFilter
    const matchesLevel = levelFilter === "ALL" || programme.level === levelFilter
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const handleCreateProgramme = () => {
    setSelectedProgramme(null)
    setIsEditing(false)
    setFormData({
      title: "",
      description: "",
      category: "EXERCISE",
      level: "BEGINNER",
      duration: 4,
      isPublic: false,
      autoStart: false,
      weeklyPlans: []
    })
    setShowProgrammeModal(true)
  }

  const handleEditProgramme = (programme: Programme) => {
    setSelectedProgramme(programme)
    setIsEditing(true)
    setFormData({
      title: programme.title,
      description: programme.description || "",
      category: programme.category,
      level: programme.level || "BEGINNER",
      duration: programme.duration || 4,
      isPublic: programme.isPublic,
      autoStart: (programme as any).autoStart || false,
      weeklyPlans: programme.weeklyPlans.map(plan => ({
        weekNumber: plan.weekNumber,
        title: plan.title || "",
        description: plan.description || "",
        dailyTasks: plan.dailyTasks.map(task => ({
          dayOfWeek: task.dayOfWeek,
          taskType: task.taskType,
          title: task.title,
          description: task.description || "",
          taskData: task.taskData,
          isRequired: task.isRequired,
          estimatedDuration: task.estimatedDuration || 30,
          order: task.order
        }))
      }))
    })
    setShowProgrammeModal(true)
  }

  const handleSubmitProgramme = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const url = isEditing 
        ? `/api/admin/programmes/${selectedProgramme?.id}`
        : "/api/admin/programmes"
      
      const method = isEditing ? "PATCH" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowProgrammeModal(false)
        // Refrescar la lista
        window.location.reload()
      } else {
        console.error("Error saving programme")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDeleteProgramme = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este programa?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/programmes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setProgrammes(programmes.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error("Error deleting programme:", error)
    }
  }

  const addWeekPlan = () => {
    const newWeekNumber = formData.weeklyPlans.length + 1
    setFormData({
      ...formData,
      weeklyPlans: [
        ...formData.weeklyPlans,
        {
          weekNumber: newWeekNumber,
          title: `Semana ${newWeekNumber}`,
          description: "",
          dailyTasks: []
        }
      ]
    })
  }

  const addDailyTask = (weekIndex: number) => {
    const updatedWeeklyPlans = [...formData.weeklyPlans]
    updatedWeeklyPlans[weekIndex].dailyTasks.push({
      dayOfWeek: 0,
      taskType: "WORKOUT" as TaskType,
      title: "",
      description: "",
      taskData: {},
      isRequired: true,
      estimatedDuration: 30,
      order: updatedWeeklyPlans[weekIndex].dailyTasks.length
    })
    setFormData({ ...formData, weeklyPlans: updatedWeeklyPlans })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Programas</h1>
          <p className="text-gray-600 mt-2">Administra los programas semanales de entrenamiento</p>
        </div>
        <button 
          onClick={handleCreateProgramme}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Programa</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programas</p>
              <p className="text-2xl font-bold text-gray-900">{programmes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ejercicios</p>
              <p className="text-2xl font-bold text-gray-900">
                {programmes.filter(p => p.category === "EXERCISE").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {programmes.filter(p => p.isActive).length}
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
              <p className="text-sm font-medium text-gray-600">Públicos</p>
              <p className="text-2xl font-bold text-gray-900">
                {programmes.filter(p => p.isPublic).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar programas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ContentCategory | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="ALL">Todas las categorías</option>
              <option value="EXERCISE">Ejercicios</option>
              <option value="ROUTINE">Rutinas</option>
              <option value="DIET">Dieta</option>
              <option value="MINDSET">Mindset</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as UserLevel | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="ALL">Todos los niveles</option>
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Programmes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProgrammes.map((programme) => (
          <motion.div
            key={programme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {programme.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {programme.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {programme.isActive && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  )}
                  {programme.isPublic && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Público
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {programme.duration} semanas
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {programme.category}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {programme.level}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                <strong>Planes semanales:</strong> {programme.weeklyPlans.length}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditProgramme(programme)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProgramme(programme.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Programme Modal */}
      {showProgrammeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Editar Programa" : "Nuevo Programa"}
                </h2>
                <button
                  onClick={() => setShowProgrammeModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as ContentCategory})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="EXERCISE">Ejercicios</option>
                    <option value="ROUTINE">Rutinas</option>
                    <option value="DIET">Dieta</option>
                    <option value="MINDSET">Mindset</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value as UserLevel})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="BEGINNER">Principiante</option>
                    <option value="INTERMEDIATE">Intermedio</option>
                    <option value="ADVANCED">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duración (semanas)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                    Programa público
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoStart"
                    checked={formData.autoStart}
                    onChange={(e) => setFormData({...formData, autoStart: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="autoStart" className="text-sm font-medium text-gray-700">
                    Inicio automático (programme en cascada)
                  </label>
                </div>
              </div>
              
              {/* Weekly Plans */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Planes Semanales</h3>
                  <button
                    onClick={addWeekPlan}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Agregar Semana
                  </button>
                </div>
                
                {formData.weeklyPlans.map((plan, weekIndex) => (
                  <div key={weekIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título de la Semana</label>
                        <input
                          type="text"
                          value={plan.title}
                          onChange={(e) => {
                            const updatedPlans = [...formData.weeklyPlans]
                            updatedPlans[weekIndex].title = e.target.value
                            setFormData({...formData, weeklyPlans: updatedPlans})
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Semana</label>
                        <input
                          type="number"
                          value={plan.weekNumber}
                          onChange={(e) => {
                            const updatedPlans = [...formData.weeklyPlans]
                            updatedPlans[weekIndex].weekNumber = parseInt(e.target.value)
                            setFormData({...formData, weeklyPlans: updatedPlans})
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => addDailyTask(weekIndex)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Agregar Tarea
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <textarea
                        value={plan.description}
                        onChange={(e) => {
                          const updatedPlans = [...formData.weeklyPlans]
                          updatedPlans[weekIndex].description = e.target.value
                          setFormData({...formData, weeklyPlans: updatedPlans})
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Daily Tasks */}
                    {plan.dailyTasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="bg-gray-50 rounded-lg p-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Día</label>
                            <select
                              value={task.dayOfWeek}
                              onChange={(e) => {
                                const updatedPlans = [...formData.weeklyPlans]
                                updatedPlans[weekIndex].dailyTasks[taskIndex].dayOfWeek = parseInt(e.target.value)
                                setFormData({...formData, weeklyPlans: updatedPlans})
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              {DAYS_OF_WEEK.map((day, index) => (
                                <option key={index} value={index}>{day}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Tarea</label>
                            <select
                              value={task.taskType}
                              onChange={(e) => {
                                const updatedPlans = [...formData.weeklyPlans]
                                updatedPlans[weekIndex].dailyTasks[taskIndex].taskType = e.target.value as TaskType
                                setFormData({...formData, weeklyPlans: updatedPlans})
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => {
                                const updatedPlans = [...formData.weeklyPlans]
                                updatedPlans[weekIndex].dailyTasks[taskIndex].title = e.target.value
                                setFormData({...formData, weeklyPlans: updatedPlans})
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duración (min)</label>
                            <input
                              type="number"
                              value={task.estimatedDuration}
                              onChange={(e) => {
                                const updatedPlans = [...formData.weeklyPlans]
                                updatedPlans[weekIndex].dailyTasks[taskIndex].estimatedDuration = parseInt(e.target.value)
                                setFormData({...formData, weeklyPlans: updatedPlans})
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                          <textarea
                            value={task.description}
                            onChange={(e) => {
                              const updatedPlans = [...formData.weeklyPlans]
                              updatedPlans[weekIndex].dailyTasks[taskIndex].description = e.target.value
                              setFormData({...formData, weeklyPlans: updatedPlans})
                            }}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`required-${weekIndex}-${taskIndex}`}
                              checked={task.isRequired}
                              onChange={(e) => {
                                const updatedPlans = [...formData.weeklyPlans]
                                updatedPlans[weekIndex].dailyTasks[taskIndex].isRequired = e.target.checked
                                setFormData({...formData, weeklyPlans: updatedPlans})
                              }}
                              className="mr-2"
                            />
                            <label htmlFor={`required-${weekIndex}-${taskIndex}`} className="text-sm font-medium text-gray-700">
                              Tarea requerida
                            </label>
                          </div>
                          <button
                            onClick={() => {
                              const updatedPlans = [...formData.weeklyPlans]
                              updatedPlans[weekIndex].dailyTasks.splice(taskIndex, 1)
                              setFormData({...formData, weeklyPlans: updatedPlans})
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar Tarea
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowProgrammeModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitProgramme}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                {isEditing ? "Actualizar" : "Crear"} Programa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
