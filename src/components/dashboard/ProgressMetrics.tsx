"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  BarChart3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react"

interface ProgressMetric {
  id?: string
  type: string
  label: string
  value: number
  unit: string
  date: string
  notes?: string
  photoUrl?: string
}

interface MetricType {
  type: string
  label: string
  unit: string
  min?: number
  max?: number
  step?: number
}

const METRIC_TYPES: MetricType[] = [
  { type: 'weight', label: 'Peso', unit: 'kg', min: 30, max: 200, step: 0.1 },
  { type: 'body_fat', label: 'Grasa Corporal', unit: '%', min: 3, max: 50, step: 0.1 },
  { type: 'muscle_mass', label: 'Masa Muscular', unit: 'kg', min: 20, max: 100, step: 0.1 },
  { type: 'waist', label: 'Cintura', unit: 'cm', min: 50, max: 150, step: 0.5 },
  { type: 'chest', label: 'Pecho', unit: 'cm', min: 60, max: 150, step: 0.5 },
  { type: 'biceps', label: 'Bíceps', unit: 'cm', min: 15, max: 60, step: 0.5 },
  { type: 'thigh', label: 'Muslo', unit: 'cm', min: 30, max: 100, step: 0.5 },
  { type: 'height', label: 'Altura', unit: 'cm', min: 120, max: 220, step: 0.1 }
]

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

export default function ProgressMetrics() {
  const [metrics, setMetrics] = useState<ProgressMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null)
  const [newMetric, setNewMetric] = useState<Partial<ProgressMetric>>({
    value: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchMetrics()
  }, [])

  // Auto-remove notifications after duration
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration) {
        setTimeout(() => {
          removeNotification(notification.id)
        }, notification.duration)
      }
    })
  }, [notifications])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const fetchMetrics = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true)
      }
      
      const token = localStorage.getItem("authToken") || localStorage.getItem("token")
      
      if (!token) {
        throw new Error('No se encontró token de autenticación')
      }
      
      console.log('Fetching metrics with token:', token.substring(0, 10) + '...')
      
      const response = await fetch("/api/user/metrics", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log('Metrics response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Metrics data received:', data)
        setMetrics(data.metrics || [])
        
        if (showRefreshIndicator) {
          addNotification({
            type: 'success',
            message: 'Métricas actualizadas correctamente',
            duration: 3000
          })
        }
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error(errorData.error || 'Error al cargar métricas')
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al cargar las métricas',
        duration: 5000
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [addNotification])

  const handleAddMetric = (metricType: MetricType) => {
    setSelectedMetric(metricType)
    setNewMetric({
      type: metricType.type,
      label: metricType.label,
      unit: metricType.unit,
      value: metricType.min || 0,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setShowAddModal(true)
  }

  const handleSaveMetric = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem("authToken") || localStorage.getItem("token")
      
      const response = await fetch("/api/user/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newMetric)
      })

      if (response.ok) {
        const data = await response.json()
        
        // Optimistic update - add the new metric immediately
        const newMetricWithId = {
          ...newMetric,
          id: data.id || Math.random().toString(36).substr(2, 9)
        } as ProgressMetric
        
        setMetrics(prev => [newMetricWithId, ...prev])
        
        // Show success notification
        addNotification({
          type: 'success',
          message: `${newMetric.label} registrado correctamente`,
          duration: 4000
        })
        
        // Close modal and reset form
        setShowAddModal(false)
        setSelectedMetric(null)
        setNewMetric({
          value: 0,
          date: new Date().toISOString().split('T')[0],
          notes: ''
        })
        
        // Refresh metrics to ensure data consistency
        await fetchMetrics(true)
        
        // Trigger profile stats refresh if available
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('metricsUpdated', { 
            detail: { metricType: newMetric.type, value: newMetric.value } 
          }))
        }
        
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar la métrica')
      }
    } catch (error) {
      console.error("Error saving metric:", error)
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al guardar la métrica',
        duration: 5000
      })
    } finally {
      setSaving(false)
    }
  }

  const calculateTrend = (metricType: string, currentValue: number) => {
    const metricHistory = metrics
      .filter(m => m.type === metricType)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    if (metricHistory.length < 2) return { trend: 'neutral', change: 0 }
    
    const previousValue = metricHistory[1].value
    const change = ((currentValue - previousValue) / previousValue) * 100
    
    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      change: Math.abs(change)
    }
  }

  const getLatestMetric = (metricType: string) => {
    const filtered = metrics.filter(m => m.type === metricType)
    console.log(`Looking for metric type: ${metricType}`)
    console.log(`Available metrics:`, metrics.map(m => ({ type: m.type, value: m.value })))
    console.log(`Filtered metrics for ${metricType}:`, filtered)
    return filtered
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        <p className="text-gray-600">Cargando métricas de progreso...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Métricas de Progreso</h1>
            <p className="text-gray-600 mt-2">Registra y visualiza tu evolución</p>
            <div className="mt-2 text-sm text-gray-500">
              {metrics.length > 0 ? (
                <span className="text-green-600">✓ {metrics.length} métricas cargadas</span>
              ) : (
                <span className="text-orange-600">⚠ No hay métricas registradas</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchMetrics(true)}
              disabled={refreshing}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Métrica</span>
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Message for Empty State */}
      {metrics.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 mb-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Comienza tu seguimiento de progreso!
            </h3>
            <p className="text-gray-600 mb-6">
              Registra tus primeras métricas para ver tu evolución y alcanzar tus objetivos.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Registrar Primera Métrica
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {METRIC_TYPES.map((metricType) => {
          const latestMetric = getLatestMetric(metricType.type)
          const trend = latestMetric ? calculateTrend(metricType.type, latestMetric.value) : { trend: 'neutral', change: 0 }
          
          return (
            <motion.div
              key={metricType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{metricType.label}</h3>
                <button
                  onClick={() => handleAddMetric(metricType)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold text-gray-900">
                  {latestMetric ? latestMetric.value.toFixed(metricType.step === 0.1 ? 1 : 0) : '--'}
                </div>
                <div className="text-sm text-gray-600">{metricType.unit}</div>
              </div>
              
              {latestMetric && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {trend.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : trend.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${
                      trend.trend === 'up' ? 'text-green-600' :
                      trend.trend === 'down' ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {trend.change.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(latestMetric.date).toLocaleDateString('es-ES')}
                  </div>
                </div>
              )}
              
              {!latestMetric && (
                <div className="text-center py-4">
                  <BarChart3 className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">Sin datos registrados</p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Progress Charts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Evolución de Métricas</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weight Chart */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Peso</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Gráfico de evolución del peso</p>
                <p className="text-sm">Próximamente con Chart.js</p>
              </div>
            </div>
          </div>
          
          {/* Body Fat Chart */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grasa Corporal</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Gráfico de evolución de grasa corporal</p>
                <p className="text-sm">Próximamente con Chart.js</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Metric Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedMetric ? `Registrar ${selectedMetric.label}` : 'Registrar Métrica'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {!selectedMetric && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Métrica
                  </label>
                  <select
                    value={newMetric.type || ''}
                    onChange={(e) => {
                      const metricType = METRIC_TYPES.find(m => m.type === e.target.value)
                      if (metricType) {
                        setNewMetric({
                          ...newMetric,
                          type: metricType.type,
                          label: metricType.label,
                          unit: metricType.unit,
                          value: metricType.min || 0
                        })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar métrica</option>
                    {METRIC_TYPES.map(metric => (
                      <option key={metric.type} value={metric.type}>
                        {metric.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor ({newMetric.unit || 'unidad'})
                </label>
                <input
                  type="number"
                  value={newMetric.value || 0}
                  onChange={(e) => setNewMetric({...newMetric, value: parseFloat(e.target.value)})}
                  min={selectedMetric?.min}
                  max={selectedMetric?.max}
                  step={selectedMetric?.step || 0.1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={newMetric.date || ''}
                  onChange={(e) => setNewMetric({...newMetric, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={newMetric.notes || ''}
                  onChange={(e) => setNewMetric({...newMetric, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Comentarios sobre esta medición..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMetric}
                disabled={!newMetric.type || !newMetric.value || !newMetric.date || saving}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Guardando...' : 'Guardar'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : notification.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <BarChart3 className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-white hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
