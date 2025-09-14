"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Camera, 
  ArrowRight, 
  Sparkles,
  Heart,
  Target,
  Zap,
  CheckCircle,
  Upload,
  X
} from "lucide-react"

interface ManifestoOption {
  id: string
  text: string
  category: string
  icon: React.ComponentType<{ className?: string }>
}

const manifestoOptions: ManifestoOption[] = [
  {
    id: "commitment",
    text: "Me comprometo a dar mi 100% cada día",
    category: "commitment",
    icon: Target
  },
  {
    id: "growth",
    text: "Cada día es una oportunidad de crecer",
    category: "growth",
    icon: Sparkles
  },
  {
    id: "consistency",
    text: "La consistencia es mi superpoder",
    category: "consistency",
    icon: Zap
  },
  {
    id: "self_love",
    text: "Me amo y me cuido como mi mayor tesoro",
    category: "self_love",
    icon: Heart
  },
  {
    id: "discipline",
    text: "La disciplina me lleva donde la motivación no puede",
    category: "discipline",
    icon: Target
  },
  {
    id: "transformation",
    text: "Hoy empiezo la transformación de mi vida",
    category: "transformation",
    icon: Sparkles
  }
]

const notificationPreferences = [
  { id: "daily_reminders", label: "Recordatorios diarios", description: "Notificaciones para tus hábitos" },
  { id: "progress_updates", label: "Actualizaciones de progreso", description: "Logros y rachas" },
  { id: "motivational_quotes", label: "Frases motivacionales", description: "Inspiración diaria" },
  { id: "weekly_reports", label: "Reportes semanales", description: "Resumen de tu semana" }
]

export default function OnboardingProfile() {
  const [profileData, setProfileData] = useState({
    bio: "",
    manifesto: "",
    customManifesto: "",
    profileImage: null as File | null,
    notifications: ["daily_reminders", "progress_updates"]
  })
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const router = useRouter()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileData(prev => ({ ...prev, profileImage: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileData(prev => ({ ...prev, profileImage: null }))
    setPreviewImage(null)
  }

  const selectManifesto = (manifesto: string) => {
    setProfileData(prev => ({ ...prev, manifesto, customManifesto: "" }))
  }

  const toggleNotification = (notificationId: string) => {
    setProfileData(prev => ({
      ...prev,
      notifications: prev.notifications.includes(notificationId)
        ? prev.notifications.filter(id => id !== notificationId)
        : [...prev.notifications, notificationId]
    }))
  }

  const handleContinue = async () => {
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('bio', profileData.bio)
      formData.append('manifesto', profileData.manifesto || profileData.customManifesto)
      formData.append('notifications', JSON.stringify(profileData.notifications))
      if (profileData.profileImage) {
        formData.append('profileImage', profileData.profileImage)
      }

      const response = await fetch("/api/onboarding/profile", {
        method: "POST",
        body: formData,
      })
      
      if (response.ok) {
        router.push("/onboarding/complete")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = profileData.manifesto || profileData.customManifesto

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory Logo"
              width={50}
              height={50}
              className="rounded-full border-2 border-red-500"
            />
            <div>
              <h1 className="text-xl font-bold text-white">GAINZ FACTORY</h1>
              <p className="text-red-500 text-sm">Transformation OS</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              Completa tu perfil
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Personaliza tu experiencia y crea tu manifiesto personal
            </p>
          </motion.div>
        </div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-2xl space-y-8"
        >
          {/* Profile Image */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <Camera className="w-6 h-6 text-red-500" />
              Foto de perfil (opcional)
            </h3>
            
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                {previewImage && (
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
            
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200">
              <Upload className="w-5 h-5" />
              Subir foto
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Bio personal (opcional)
            </h3>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Cuéntanos un poco sobre ti, tus objetivos, o lo que te motiva..."
              className="w-full p-4 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:border-red-500 focus:outline-none transition-all duration-200 backdrop-blur-sm h-24 resize-none"
              maxLength={200}
            />
            <p className="text-gray-400 text-sm mt-2">
              {profileData.bio.length}/200 caracteres
            </p>
          </div>

          {/* Personal Manifesto */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-red-500" />
              Tu manifiesto personal
            </h3>
            <p className="text-gray-400 mb-4">
              Escribe una frase que te inspire y aparecerá en tu dashboard como recordatorio diario
            </p>
            
            {/* Manifesto Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {manifestoOptions.map((option, index) => {
                const Icon = option.icon
                const isSelected = profileData.manifesto === option.text
                
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    onClick={() => selectManifesto(option.text)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-red-500' : 'text-gray-400'}`} />
                      <span className="text-white font-medium">{option.text}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Custom Manifesto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                O escribe tu propio manifiesto:
              </label>
              <textarea
                value={profileData.customManifesto}
                onChange={(e) => setProfileData(prev => ({ 
                  ...prev, 
                  customManifesto: e.target.value,
                  manifesto: "" // Clear selected option when typing custom
                }))}
                placeholder="Ej: Cada día es una nueva oportunidad de ser mejor que ayer"
                className="w-full p-4 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:border-red-500 focus:outline-none transition-all duration-200 backdrop-blur-sm h-20 resize-none"
                maxLength={150}
              />
              <p className="text-gray-400 text-sm mt-2">
                {profileData.customManifesto.length}/150 caracteres
              </p>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-red-500" />
              Preferencias de notificaciones
            </h3>
            <div className="space-y-3">
              {notificationPreferences.map((pref) => {
                const isSelected = profileData.notifications.includes(pref.id)
                
                return (
                  <label
                    key={pref.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200"
                  >
                    <div>
                      <div className="text-white font-medium">{pref.label}</div>
                      <div className="text-gray-400 text-sm">{pref.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification(pref.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        isSelected ? 'bg-red-500' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        isSelected ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </label>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={handleContinue}
            disabled={!isFormValid || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 group"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Guardando perfil...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Finalizar Onboarding
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </motion.button>
          
          {!isFormValid && (
            <p className="text-gray-500 text-sm mt-4">
              Escribe tu manifiesto personal para continuar
            </p>
          )}
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            Tu manifiesto será tu guía diaria hacia la transformación
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
