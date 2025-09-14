"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ChartBarIcon,
  UsersIcon,
  EyeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline"

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  newUsers: number
  totalSessions: number
  averageSessionDuration: number
  pageViews: number
  bounceRate: number
  conversionRate: number
  revenue: number
  userGrowth: number
  sessionGrowth: number
  revenueGrowth: number
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else {
        // Mock data for development
        setAnalytics({
          totalUsers: 1247,
          activeUsers: 892,
          newUsers: 156,
          totalSessions: 3456,
          averageSessionDuration: 12.5,
          pageViews: 15678,
          bounceRate: 34.2,
          conversionRate: 8.7,
          revenue: 12450,
          userGrowth: 12.5,
          sessionGrowth: 8.3,
          revenueGrowth: 15.2
        })
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }


  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const metricCards = [
    {
      title: "Usuarios Totales",
      value: analytics?.totalUsers || 0,
      change: analytics?.userGrowth || 0,
      icon: UsersIcon,
      color: "blue"
    },
    {
      title: "Usuarios Activos",
      value: analytics?.activeUsers || 0,
      change: 8.2,
      icon: EyeIcon,
      color: "green"
    },
    {
      title: "Nuevos Usuarios",
      value: analytics?.newUsers || 0,
      change: 15.3,
      icon: ArrowTrendingUpIcon,
      color: "purple"
    },
    {
      title: "Sesiones",
      value: analytics?.totalSessions || 0,
      change: analytics?.sessionGrowth || 0,
      icon: ClockIcon,
      color: "orange"
    },
    {
      title: "Páginas Vistas",
      value: analytics?.pageViews || 0,
      change: 12.1,
      icon: ChartBarIcon,
      color: "indigo"
    },
    {
      title: "Ingresos",
      value: analytics?.revenue || 0,
      change: analytics?.revenueGrowth || 0,
      icon: ArrowTrendingUpIcon,
      color: "emerald",
      isCurrency: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analíticas</h1>
          <p className="text-gray-600 mt-2">Métricas y estadísticas de Gainz Factory</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {metric.isCurrency ? formatCurrency(metric.value) : formatNumber(metric.value)}
                </p>
                <div className="flex items-center mt-2">
                  {metric.change > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crecimiento de Usuarios</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Gráfico de crecimiento próximamente</p>
            </div>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <ArrowTrendingUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Gráfico de ingresos próximamente</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Métricas de Rendimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {analytics?.averageSessionDuration || 0}m
            </div>
            <div className="text-sm text-gray-600">Duración Promedio de Sesión</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {analytics?.bounceRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Tasa de Rebote</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {analytics?.conversionRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Tasa de Conversión</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Actividad Reciente</h3>
        <div className="space-y-4">
          {[
            { action: "Nuevo usuario registrado", user: "Juan Pérez", time: "Hace 5 minutos" },
            { action: "Compra completada", user: "María García", time: "Hace 12 minutos" },
            { action: "Post publicado", user: "Admin", time: "Hace 1 hora" },
            { action: "Usuario eliminado", user: "Carlos López", time: "Hace 2 horas" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
