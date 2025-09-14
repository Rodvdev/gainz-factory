"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, CheckCircle, RefreshCw, ArrowRight } from "lucide-react"

export default function OnboardingVerify() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleResendEmail = async () => {
    if (!email) return
    
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResendSuccess(true)
        setTimeout(() => setResendSuccess(false), 5000)
      } else {
        setError(data.error || "Error al reenviar el email")
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckVerification = async () => {
    if (!email) return
    
    setLoading(true)
    
    try {
      const response = await fetch("/api/auth/check-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.verified) {
        router.push("/onboarding/objectives")
      } else {
        setError("El email aún no ha sido verificado. Revisa tu bandeja de entrada.")
      }
    } catch {
      setError("Error al verificar el estado. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
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
              width={60}
              height={60}
              className="rounded-full border-2 border-red-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">GAINZ FACTORY</h1>
              <p className="text-red-500 text-sm">Transformation OS</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              ¡Casi listo!
            </h2>
            <p className="text-gray-400">
              Activa tu cuenta y comienza tu camino
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-2xl text-center"
        >
          {/* Email Icon Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-red-500" />
            </div>
          </motion.div>

          <h3 className="text-xl font-bold mb-4">
            🚀 Activa tu cuenta y comienza tu camino en Gainz Factory
          </h3>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            Hemos enviado un email de verificación a:
          </p>
          
          {email && (
            <div className="bg-gray-800/50 p-4 rounded-xl mb-6 border border-gray-700">
              <p className="text-red-400 font-medium">{email}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-400 mb-2">📧 Revisa tu bandeja de entrada</h4>
              <p className="text-sm text-gray-300">
                Busca el email de &quot;Gainz Factory&quot; y haz clic en el botón &quot;Confirmar mi cuenta&quot;
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
              <h4 className="font-semibold text-yellow-400 mb-2">📁 ¿No ves el email?</h4>
              <p className="text-sm text-gray-300">
                Revisa tu carpeta de spam o correo no deseado. A veces los emails llegan ahí.
              </p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mt-4"
            >
              {error}
            </motion.div>
          )}

          {resendSuccess && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm mt-4 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Email reenviado exitosamente
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <motion.button
              onClick={handleCheckVerification}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white p-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Ya verifiqué mi email
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <motion.button
              onClick={handleResendEmail}
              disabled={loading || resendSuccess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-800/50 hover:bg-gray-700/50 disabled:bg-gray-800/30 text-white p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700"
            >
              <RefreshCw className="w-5 h-5" />
              Reenviar email
            </motion.button>
          </div>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            Cada paso te acerca más a tu transformación
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
