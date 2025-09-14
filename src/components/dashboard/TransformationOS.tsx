"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle,
  Play,
  BookOpen,
  Users,
  Settings,
  Bell,
  Trophy,
  Flame,
  Star,
  Zap
} from "lucide-react"
import AnimatedEgg from "./AnimatedEgg"

interface UserProgress {
  totalXP: number
  currentLevel: number
  levelName: string
  avatarEmoji: string
  weeklyStreak: number
  completedProgrammes: number
  activeProgrammes: number
  totalWorkouts: number
  currentLevelXP?: number
  nextLevelXP?: number
  progress?: number
}

interface UserLevelData {
  userLevel: {
    currentLevel: number
    totalXP: number
    currentLevelXP: number
    nextLevelXP: number
    levelName: string
    avatarEmoji: string
  }
  nextLevelXP: number
  progress: number
}

interface ActiveProgramme {
  id: string
  title: string
  category: string
  progress: number
  currentWeek: number
  totalWeeks: number
  nextTask?: {
    title: string
    type: string
    dueDate: string
  }
}

interface TodayTask {
  id: string
  title: string
  type: string
  time: string
  isCompleted: boolean
  programmeId: string
}

interface ProgressMetric {
  type: string
  label: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'neutral'
}

export default function TransformationOS() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [userLevel, setUserLevel] = useState<UserLevelData | null>(null)
  const [activeProgrammes, setActiveProgrammes] = useState<ActiveProgramme[]>([])
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>([])
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        
        // Fetch user progress
        const progressResponse = await fetch("/api/user/progress", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        // Fetch active programmes
        const programmesResponse = await fetch("/api/user/programmes", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        // Fetch today's tasks
        const tasksResponse = await fetch("/api/user/today-tasks", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        // Fetch progress metrics
        const metricsResponse = await fetch("/api/user/metrics", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        // Fetch user level data
        const levelResponse = await fetch("/api/user/level", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          setUserProgress(progressData.progress)
        }

        if (programmesResponse.ok) {
          const programmesData = await programmesResponse.json()
          setActiveProgrammes(programmesData.programmes || [])
        }

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json()
          setTodayTasks(tasksData.tasks || [])
        }

        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json()
          setProgressMetrics(metricsData.metrics || [])
        }

        if (levelResponse.ok) {
          const levelData = await levelResponse.json()
          setUserLevel(levelData)
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getTaskTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'workout': return <Target className="w-4 h-4" />
      case 'cardio': return <Zap className="w-4 h-4" />
      case 'nutrition': return <BookOpen className="w-4 h-4" />
      case 'mindset': return <Star className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const getTaskTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'workout': return 'bg-red-100 text-red-600'
      case 'cardio': return 'bg-orange-100 text-orange-600'
      case 'nutrition': return 'bg-green-100 text-green-600'
      case 'mindset': return 'bg-purple-100 text-purple-600'
      default: return 'bg-blue-100 text-blue-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {userProgress?.currentLevel === 1 ? (
                  <AnimatedEgg
                    currentLevel={userProgress.currentLevel}
                    nextLevelXP={userLevel?.nextLevelXP || 100}
                    currentLevelXP={userLevel?.userLevel?.currentLevelXP || 0}
                    isActive={true}
                    onAttempt={() => console.log("¡El huevo fue tocado!")}
                  />
                ) : (
                  <div className="text-3xl">{userProgress?.avatarEmoji || "🥚"}</div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Hola, Bienvenido a tu Transformación
                  </h1>
                  <p className="text-gray-600">
                    {userProgress?.levelName || "Novato GF"} • {userProgress?.totalXP || 0} XP
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Tu Progreso</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{userProgress?.weeklyStreak || 0} días seguidos</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userProgress?.totalWorkouts || 0}
                  </div>
                  <div className="text-sm text-gray-600">Entrenamientos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userProgress?.completedProgrammes || 0}
                  </div>
                  <div className="text-sm text-gray-600">Programas Completados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userProgress?.activeProgrammes || 0}
                  </div>
                  <div className="text-sm text-gray-600">Programas Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userProgress?.totalXP || 0}
                  </div>
                  <div className="text-sm text-gray-600">XP Total</div>
                </div>
              </div>
            </motion.div>

            {/* Active Programmes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Programas Activos</h2>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Ver todos
                </button>
              </div>
              
              <div className="space-y-4">
                {activeProgrammes.map((programme) => (
                  <div key={programme.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{programme.title}</h3>
                      <span className="text-sm text-gray-600">
                        Semana {programme.currentWeek} de {programme.totalWeeks}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>{programme.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${programme.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {programme.nextTask && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Próxima tarea:</span>
                        <span className="font-medium text-gray-900">{programme.nextTask.title}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {activeProgrammes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No tienes programas activos</p>
                    <button className="mt-2 text-red-600 hover:text-red-700 font-medium">
                      Explorar programas
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Tareas de Hoy</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div key={task.id} className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    task.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`p-2 rounded-lg ${getTaskTypeColor(task.type)}`}>
                      {getTaskTypeIcon(task.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium ${task.isCompleted ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600">{task.time}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {task.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {todayTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>¡No tienes tareas programadas para hoy!</p>
                    <p className="text-sm">Disfruta de tu día libre o explora nuevos programas.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Progress Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Progreso</h2>
              
              <div className="space-y-4">
                {progressMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                      <p className="text-xs text-gray-600">{metric.value} {metric.unit}</p>
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${
                        metric.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                ))}
                
                {progressMetrics.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Comienza a registrar tu progreso</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Logros Recientes</h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Primera Semana</p>
                    <p className="text-xs text-gray-600">Completaste tu primera semana</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consistencia</p>
                    <p className="text-xs text-gray-600">7 días seguidos entrenando</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Star className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Programa Completado</p>
                    <p className="text-xs text-gray-600">Tu primer programa terminado</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Target className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium">Iniciar Entrenamiento</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Registrar Comida</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Registrar Progreso</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Ver Comunidad</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
