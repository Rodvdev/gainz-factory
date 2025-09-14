"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Dumbbell, 
  ChefHat, 
  FileText, 
  TrendingUp,
  Activity,
  Clock,
  Target,
  DollarSign,
  Eye
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalExercises: number
  totalRecipes: number
  totalMediaContent: number
  totalBlogPosts: number
  totalServices: number
  monthlyRevenue: number
  userGrowth: number
  habitCompletions: number
  averageStreak: number
  contentViews: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string
  user?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("/api/admin/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setRecentActivity(data.recentActivity || [])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Usuarios Totales",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "blue",
      change: stats?.userGrowth || 0,
      changeType: "positive"
    },
    {
      title: "Usuarios Activos",
      value: stats?.activeUsers || 0,
      icon: Activity,
      color: "green",
      change: 12,
      changeType: "positive"
    },
    {
      title: "Ejercicios",
      value: stats?.totalExercises || 0,
      icon: Dumbbell,
      color: "purple",
      change: 5,
      changeType: "positive"
    },
    {
      title: "Recetas",
      value: stats?.totalRecipes || 0,
      icon: ChefHat,
      color: "orange",
      change: 3,
      changeType: "positive"
    },
    {
      title: "Contenido Media",
      value: stats?.totalMediaContent || 0,
      icon: FileText,
      color: "indigo",
      change: 8,
      changeType: "positive"
    },
    {
      title: "Ingresos Mensuales",
      value: `$${stats?.monthlyRevenue || 0}`,
      icon: DollarSign,
      color: "emerald",
      change: 15,
      changeType: "positive"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">Gestiona todos los aspectos de Gainz Factory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">
                  +{stat.change}% desde el mes pasado
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* KPIs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">KPIs Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.habitCompletions || 0}</p>
            <p className="text-sm text-gray-600">Hábitos Completados Hoy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.averageStreak || 0}</p>
            <p className="text-sm text-gray-600">Racha Promedio (días)</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.contentViews || 0}</p>
            <p className="text-sm text-gray-600">Vistas de Contenido</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600">Retención 30 días</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay actividad reciente</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-center"
          >
            <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Gestionar Usuarios</p>
          </a>
          <a
            href="/admin/exercises"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-center"
          >
            <Dumbbell className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Ejercicios</p>
          </a>
          <a
            href="/admin/recipes"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-center"
          >
            <ChefHat className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Recetas</p>
          </a>
          <a
            href="/admin/content"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-center"
          >
            <FileText className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Contenido</p>
          </a>
        </div>
      </motion.div>
    </div>
  )
}
