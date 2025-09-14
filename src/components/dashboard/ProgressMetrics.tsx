"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  BarChart3,
  Save,
  X
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

export default function ProgressMetrics() {
  const [metrics, setMetrics] = useState<ProgressMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null)
  const [newMetric, setNewMetric] = useState<Partial<ProgressMetric>>({
    value: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/user/metrics", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics || [])
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setLoading(false)
    }
  }

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
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/user/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newMetric)
      })

      if (response.ok) {
        setShowAddModal(false)
        fetchMetrics() // Refresh metrics
      }
    } catch (error) {
      console.error("Error saving metric:", error)
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
    return metrics
      .filter(m => m.type === metricType)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
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
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Métrica</span>
          </button>
        </div>
      </div>

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
                disabled={!newMetric.type || !newMetric.value || !newMetric.date}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
