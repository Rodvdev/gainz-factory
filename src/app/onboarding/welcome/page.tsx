"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, Zap, Target } from "lucide-react"

export default function OnboardingWelcome() {
  const [currentMessage, setCurrentMessage] = useState(0)
  
  const messages = [
    "¿Listo para transformar tu vida?",
    "Tu nueva vida comienza aquí",
    "Cada gran cambio empieza con un paso",
    "Es hora de ser quien siempre quisiste ser"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          
          {/* Subtle background elements */}
          <motion.circle cx="200" cy="100" r="3" fill="url(#redGradient)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 20,-30; 0,0"
              dur="8s"
              repeatCount="indefinite"
            />
          </motion.circle>
          <motion.circle cx="800" cy="150" r="2" fill="url(#redGradient)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -15,25; 0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </motion.circle>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <Image
                src="/logo.jpeg"
                alt="Gainz Factory Logo"
                width={100}
                height={100}
                className="rounded-full border-4 border-red-600 shadow-2xl"
              />
              <div className="text-left">
                <h1 className="text-5xl font-bold text-gray-900">GAINZ</h1>
                <h1 className="text-5xl font-bold text-red-600">FACTORY</h1>
                <p className="text-gray-600 text-lg">Transformation OS</p>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Message */}
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              {messages[currentMessage]}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Descubre el plan perfecto para alcanzar tus objetivos de fitness, nutrición y mindset
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
          >
            <div className="group p-8 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Objetivos Claros</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Define tus metas y crea un plan personalizado</p>
              </div>
            </div>
            
            <div className="group p-8 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Hábitos Poderosos</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Construye rutinas que transformen tu vida</p>
              </div>
            </div>
            
            <div className="group p-8 bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Gamificación</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Puntos, rachas y desafíos que te motivan</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mb-16"
          >
            <Link
              href="/onboarding/register"
              className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              Comenzar mi Transformación
              <Sparkles className="w-5 h-5" />
            </Link>
            
            <p className="text-sm text-gray-500 mt-4">
              Solo te tomará 5 minutos configurar tu plan personalizado
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">100%</div>
              <div className="text-sm text-gray-500">Personalizado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">24/7</div>
              <div className="text-sm text-gray-500">Soporte</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">∞</div>
              <div className="text-sm text-gray-500">Resultados</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
