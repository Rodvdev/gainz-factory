"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import DailyScore from "@/components/dashboard/DailyScore"
import ProgressChart from "@/components/dashboard/ProgressChart"
import ActiveStreaks from "@/components/dashboard/ActiveStreaks"
import ChallengeCard from "@/components/challenges/ChallengeCard"
import { HabitCategory } from "@prisma/client"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl?: string
  bio?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("user")
      
      if (!token || !userData) {
        router.push("/signin")
        return
      }
      
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        router.push("/signin")
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory Logo"
              width={40}
              height={40}
              className="rounded-full border-2 border-red-500"
            />
            <div>
              <h1 className="text-xl font-bold">GAINZ FACTORY</h1>
              <p className="text-red-500 text-sm">Transformation OS</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            ¡Bienvenido, {user.firstName}! 🔥
          </h2>
          <p className="text-gray-400 text-lg">
            Es hora de trabajar en tu transformación. Vamos por esos gainz.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Score */}
          <div className="lg:col-span-1">
            <DailyScore 
              score={undefined} // Will be populated with real data
              date={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          {/* Progress Chart */}
          <div className="lg:col-span-2">
            <ProgressChart 
              weeklyData={[]} // Will be populated with real data
              currentStreak={0}
            />
          </div>
        </div>

        {/* Habits and Streaks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Habits */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-bold mb-4">📅 Hábitos de Hoy</h3>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚡</div>
              <p className="text-gray-400">
                Aquí aparecerán tus hábitos diarios
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Próximamente: Seguimiento completo de hábitos
              </p>
              <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                Configurar Hábitos
              </button>
            </div>
          </div>
          
          {/* Active Streaks */}
          <div>
            <ActiveStreaks streaks={[]} />
          </div>
        </div>

        {/* Challenges Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-white">🏆 Desafíos Activos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Challenges */}
            <ChallengeCard 
              challenge={{
                id: "sample-1",
                userId: user.id,
                name: "Entrenamiento de 7 días",
                description: "Entrena durante 7 días consecutivos para formar el hábito",
                category: HabitCategory.PHYSICAL_TRAINING,
                startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                targetValue: 7,
                currentValue: 3,
                isCompleted: false,
                reward: "Badge de Warrior + 50 puntos bonus"
              }}
            />
            
            <ChallengeCard 
              challenge={{
                id: "sample-2", 
                userId: user.id,
                name: "Meditación matutina",
                description: "Medita 10 minutos cada mañana por 2 semanas",
                category: HabitCategory.MORNING_ROUTINE,
                startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
                targetValue: 14,
                currentValue: 5,
                isCompleted: false,
                reward: "Badge de Zen Master"
              }}
            />
            
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3">➕</div>
                <h4 className="text-lg font-medium text-gray-300 mb-2">
                  Crear Desafío
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  Establece metas personalizadas
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Nuevo Desafío
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-red-500/10 to-red-600/10 p-6 rounded-xl border border-red-500/20">
          <h3 className="text-xl font-bold mb-4">🚀 Próximos Pasos</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-green-500">✅</span>
              <span>Cuenta creada y verificada</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-yellow-500">🔄</span>
              <span>Configurar tus primeros hábitos (próximamente)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-gray-500">⏳</span>
              <span>Definir objetivos de transformación (próximamente)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-gray-500">⏳</span>
              <span>Conectar con la comunidad (próximamente)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 