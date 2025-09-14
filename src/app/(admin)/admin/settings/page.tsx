"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  CogIcon,
  GlobeAltIcon,
  BellIcon,
  ShieldCheckIcon,
  DatabaseIcon,
  CloudIcon,
  KeyIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline"

interface SystemSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  analyticsEnabled: boolean
  backupFrequency: string
  maxFileSize: number
  sessionTimeout: number
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Gainz Factory",
    siteDescription: "Tu plataforma integral para transformación física y mental",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    analyticsEnabled: true,
    backupFrequency: "daily",
    maxFileSize: 10,
    sessionTimeout: 30
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching settings:", error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("Configuración guardada exitosamente")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error al guardar la configuración")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const settingSections = [
    {
      title: "Configuración General",
      icon: GlobeAltIcon,
      settings: [
        {
          key: "siteName" as keyof SystemSettings,
          label: "Nombre del Sitio",
          type: "text",
          description: "Nombre que aparece en el header y títulos"
        },
        {
          key: "siteDescription" as keyof SystemSettings,
          label: "Descripción del Sitio",
          type: "textarea",
          description: "Descripción que aparece en meta tags y SEO"
        },
        {
          key: "maintenanceMode" as keyof SystemSettings,
          label: "Modo Mantenimiento",
          type: "checkbox",
          description: "Activar para mostrar página de mantenimiento"
        },
        {
          key: "registrationEnabled" as keyof SystemSettings,
          label: "Registro de Usuarios",
          type: "checkbox",
          description: "Permitir que nuevos usuarios se registren"
        }
      ]
    },
    {
      title: "Notificaciones",
      icon: BellIcon,
      settings: [
        {
          key: "emailNotifications" as keyof SystemSettings,
          label: "Notificaciones por Email",
          type: "checkbox",
          description: "Enviar notificaciones importantes por correo"
        },
        {
          key: "pushNotifications" as keyof SystemSettings,
          label: "Notificaciones Push",
          type: "checkbox",
          description: "Mostrar notificaciones en el navegador"
        }
      ]
    },
    {
      title: "Seguridad y Privacidad",
      icon: ShieldCheckIcon,
      settings: [
        {
          key: "sessionTimeout" as keyof SystemSettings,
          label: "Timeout de Sesión (minutos)",
          type: "number",
          description: "Tiempo antes de que expire la sesión del usuario"
        },
        {
          key: "maxFileSize" as keyof SystemSettings,
          label: "Tamaño Máximo de Archivo (MB)",
          type: "number",
          description: "Límite de tamaño para subida de archivos"
        }
      ]
    },
    {
      title: "Analytics y Datos",
      icon: DatabaseIcon,
      settings: [
        {
          key: "analyticsEnabled" as keyof SystemSettings,
          label: "Analytics Habilitado",
          type: "checkbox",
          description: "Recopilar datos de uso y estadísticas"
        },
        {
          key: "backupFrequency" as keyof SystemSettings,
          label: "Frecuencia de Backup",
          type: "select",
          description: "Con qué frecuencia hacer backup de la base de datos",
          options: [
            { value: "hourly", label: "Cada hora" },
            { value: "daily", label: "Diario" },
            { value: "weekly", label: "Semanal" },
            { value: "monthly", label: "Mensual" }
          ]
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-2">Administra la configuración general de Gainz Factory</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
        >
          <CogIcon className="h-5 w-5" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <section.icon className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.settings.map((setting) => (
                <div key={setting.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {setting.label}
                  </label>
                  
                  {setting.type === "text" && (
                    <input
                      type="text"
                      value={settings[setting.key] as string}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                  
                  {setting.type === "textarea" && (
                    <textarea
                      value={settings[setting.key] as string}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                  
                  {setting.type === "number" && (
                    <input
                      type="number"
                      value={settings[setting.key] as number}
                      onChange={(e) => handleInputChange(setting.key, Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                  
                  {setting.type === "checkbox" && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings[setting.key] as boolean}
                        onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {settings[setting.key] ? "Habilitado" : "Deshabilitado"}
                      </span>
                    </label>
                  )}
                  
                  {setting.type === "select" && (
                    <select
                      value={settings[setting.key] as string}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {setting.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <p className="text-xs text-gray-500">{setting.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900">Base de Datos</div>
              <div className="text-sm text-gray-600">Conectada</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900">API</div>
              <div className="text-sm text-gray-600">Funcionando</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900">Almacenamiento</div>
              <div className="text-sm text-gray-600">75% usado</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
