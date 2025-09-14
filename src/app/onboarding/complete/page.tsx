"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  ArrowRight,
  Target,
  Zap,
  Heart,
  Trophy,
  Star,
  Flame,
  Rocket
} from "lucide-react"

interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  size: number
  velocity: { x: number; y: number }
  rotation: number
}

export default function OnboardingComplete() {
  const [currentStep, setCurrentStep] = useState(0)
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([])
  const router = useRouter()

  const steps = [
    {
      id: "celebration",
      title: "¡Felicitaciones!",
      subtitle: "Tu cuenta está lista",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "plan_ready",
      title: "Tu plan está listo",
      subtitle: "Personalizado para tus objetivos",
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "habits_set",
      title: "Hábitos configurados",
      subtitle: "Con horarios y recordatorios",
      icon: Zap,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "manifesto",
      title: "Manifiesto creado",
      subtitle: "Tu motivación diaria",
      icon: Heart,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "ready",
      title: "¡Listo para transformarte!",
      subtitle: "Cada hábito cuenta para tu evolución",
      icon: Rocket,
      color: "from-red-500 to-red-700"
    }
  ]

  useEffect(() => {
    // Generate confetti particles
    const generateConfetti = () => {
      const particles: ConfettiParticle[] = []
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
      
      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -50,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: Math.random() * 3 + 2
          },
          rotation: Math.random() * 360
        })
      }
      setConfetti(particles)
    }

    generateConfetti()

    // Auto-advance steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1
        } else {
          clearInterval(stepInterval)
          return prev
        }
      })
    }, 1500)

    return () => clearInterval(stepInterval)
  }, [])

  useEffect(() => {
    // Animate confetti
    const animateConfetti = () => {
      setConfetti(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.velocity.x,
        y: particle.y + particle.velocity.y,
        rotation: particle.rotation + 2
      })).filter(particle => particle.y < window.innerHeight + 100))
    }

    const confettiInterval = setInterval(animateConfetti, 50)
    return () => clearInterval(confettiInterval)
  }, [])

  const handleEnterDashboard = () => {
    router.push("/dashboard")
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData?.icon

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {confetti.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              rotate: particle.rotation
            }}
          />
        ))}
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-red-900/10"></div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10"
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-red-500 opacity-60" />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20"
          animate={{ 
            y: [20, -20, 20],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Star className="w-12 h-12 text-red-500 opacity-40" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-40 left-20"
          animate={{ 
            y: [-15, 15, -15],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Flame className="w-10 h-10 text-red-500 opacity-50" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Image
                src="/logo.jpeg"
                alt="Gainz Factory Logo"
                width={80}
                height={80}
                className="rounded-full border-4 border-red-500 shadow-2xl"
              />
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white">GAINZ</h1>
                <h1 className="text-4xl font-bold text-red-500">FACTORY</h1>
                <p className="text-gray-400 text-sm">Transformation OS</p>
              </div>
            </div>
          </motion.div>

          {/* Step Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-8">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStep ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                    animate={{
                      scale: index === currentStep ? 1.2 : 1,
                      opacity: index <= currentStep ? 1 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>

              {/* Step Content */}
              {currentStepData && (
                <>
                  <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500/20 to-red-700/20 rounded-full mb-6 mx-auto">
                    <Icon className="w-12 h-12 text-red-500" />
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent">
                    {currentStepData.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    {currentStepData.subtitle}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Final Message */}
          {currentStep === steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-12"
            >
              <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-red-400">
                  ¡Rodrigo, tu plan está listo! 🎉
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Desde hoy, cada hábito cuenta para tu transformación. Tu manifiesto personal te guiará cada día, 
                  y tus objetivos están perfectamente alineados con tu plan de acción.
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                    <div className="text-green-400 font-semibold">✅ Objetivos</div>
                    <div className="text-gray-400">Fitness, Nutrición, Mindset</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                    <div className="text-blue-400 font-semibold">✅ Hábitos</div>
                    <div className="text-gray-400">5 hábitos personalizados</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                    <div className="text-purple-400 font-semibold">✅ Horarios</div>
                    <div className="text-gray-400">Rutina optimizada</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                    <div className="text-red-400 font-semibold">✅ Manifiesto</div>
                    <div className="text-gray-400">Motivación diaria</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA Button */}
          {currentStep === steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.button
                onClick={handleEnterDashboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-2 transition-all duration-300 group"
              >
                <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Entrar a mi Dashboard
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </motion.div>
          )}

          {/* Motivational Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-12"
          >
            <p className="text-gray-500 text-sm">
              La transformación comienza con el primer paso
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
