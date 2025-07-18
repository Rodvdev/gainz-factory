"use client"
import { CogIcon } from "@heroicons/react/24/outline"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuración</h1>
          <p className="text-gray-400">Personaliza tu experiencia en Gainz Factory</p>
        </div>

        {/* Coming Soon */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <CogIcon className="h-24 w-24 text-gray-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Configuración de la App</h2>
          <p className="text-gray-400 text-lg mb-6">
            Próximamente: Configuración de notificaciones, temas, 
            preferencias de privacidad y más opciones personalizables.
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-400 text-sm">
              🚧 Esta funcionalidad estará disponible en la próxima actualización
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 