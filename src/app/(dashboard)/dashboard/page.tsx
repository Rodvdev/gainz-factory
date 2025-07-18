"use client"
import DailyScore from "@/components/dashboard/DailyScore"
import ProgressChart from "@/components/dashboard/ProgressChart"
import ActiveStreaks from "@/components/dashboard/ActiveStreaks"
import ChallengeCard from "@/components/challenges/ChallengeCard"
import { HabitCategory } from "@prisma/client"

export default function DashboardPage() {
  // Sample data - will be replaced with real data from database
  const sampleDailyScore = {
    id: "sample-daily-score",
    totalPoints: 85,
    completedHabits: 12,
    totalHabits: 15,
    morningScore: 12,
    physicalScore: 18,
    nutritionScore: 13,
    workScore: 16,
    developmentScore: 10,
    socialScore: 8,
    reflectionScore: 8,
    sleepScore: 0,
    percentile: 78.5,
    rank: 42
  }

  const sampleProgressData = [
    { date: "2024-01-15", totalPoints: 78, completedHabits: 12, totalHabits: 15 },
    { date: "2024-01-16", totalPoints: 82, completedHabits: 13, totalHabits: 15 },
    { date: "2024-01-17", totalPoints: 65, completedHabits: 10, totalHabits: 15 },
    { date: "2024-01-18", totalPoints: 91, completedHabits: 14, totalHabits: 15 },
    { date: "2024-01-19", totalPoints: 88, completedHabits: 13, totalHabits: 15 },
    { date: "2024-01-20", totalPoints: 75, completedHabits: 11, totalHabits: 15 },
    { date: "2024-01-21", totalPoints: 85, completedHabits: 12, totalHabits: 15 },
  ]

  const sampleStreaks = [
    {
      id: "streak-1",
      habitId: "habit-1",
      length: 21,
      startDate: "2024-01-01",
      habit: {
        id: "habit-1",
        name: "Meditación Matutina",
        icon: "🧘",
        color: "#3B82F6",
        category: HabitCategory.MORNING_ROUTINE
      }
    },
    {
      id: "streak-2",
      habitId: "habit-2",
      length: 14,
      startDate: "2024-01-08",
      habit: {
        id: "habit-2",
        name: "Ejercicio",
        icon: "💪",
        color: "#EF4444",
        category: HabitCategory.PHYSICAL_TRAINING
      }
    },
    {
      id: "streak-3",
      habitId: "habit-3",
      length: 8,
      startDate: "2024-01-14",
      habit: {
        id: "habit-3",
        name: "Lectura",
        icon: "📚",
        color: "#8B5CF6",
        category: HabitCategory.PERSONAL_DEVELOPMENT
      }
    },
    {
      id: "streak-4",
      habitId: "habit-4",
      length: 5,
      startDate: "2024-01-17",
      habit: {
        id: "habit-4",
        name: "Planificación del día",
        icon: "📋",
        color: "#F59E0B",
        category: HabitCategory.DEEP_WORK
      }
    }
  ]

  const sampleChallenges = [
    {
      id: "1",
      userId: "user-1",
      name: "30 Días de Meditación",
      description: "Medita al menos 10 minutos cada día durante 30 días consecutivos",
      category: HabitCategory.MORNING_ROUTINE,
      startDate: "2024-01-01",
      endDate: "2024-01-30",
      targetValue: 30,
      currentValue: 21,
      isCompleted: false,
      reward: "🏆 Insignia de Mindfulness Master"
    },
    {
      id: "2",
      userId: "user-1", 
      name: "Semana de Fuerza",
      description: "Completa 5 entrenamientos de fuerza esta semana",
      category: HabitCategory.PHYSICAL_TRAINING,
      startDate: "2024-01-15",
      endDate: "2024-01-21",
      targetValue: 5,
      currentValue: 3,
      isCompleted: false,
      reward: "💪 Insignia de Guerrero"
    }
  ]

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, <span className="text-red-500">Transformer</span>! 🔥
            </h1>
            <p className="text-gray-400 text-lg capitalize">{currentDate}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Puntos Hoy</p>
                <p className="text-2xl font-bold text-red-500">{sampleDailyScore.totalPoints}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Hábitos Completados</p>
                <p className="text-2xl font-bold text-green-500">
                  {sampleDailyScore.completedHabits}/{sampleDailyScore.totalHabits}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-500 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Racha Actual</p>
                <p className="text-2xl font-bold text-orange-500">21 días</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-500 text-xl">🔥</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Desafíos Activos</p>
                <p className="text-2xl font-bold text-purple-500">{sampleChallenges.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-500 text-xl">🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Daily Score */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Puntuación Diaria</h2>
                <p className="text-gray-400">Tu rendimiento de hoy por categorías</p>
              </div>
                             <div className="p-6">
                 <DailyScore 
                   score={sampleDailyScore}
                   date={new Date().toISOString().split('T')[0]}
                 />
               </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Progreso Semanal</h2>
                <p className="text-gray-400">Tu evolución en los últimos 7 días</p>
              </div>
                             <div className="p-6">
                 <ProgressChart 
                   weeklyData={sampleProgressData}
                   currentStreak={21}
                 />
               </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Active Streaks */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Rachas Activas</h2>
                <p className="text-gray-400">Mantén el impulso</p>
              </div>
              <div className="p-6">
                <ActiveStreaks streaks={sampleStreaks} />
              </div>
            </div>

            {/* Active Challenges */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Desafíos Activos</h2>
                <p className="text-gray-400">Completa tus objetivos</p>
              </div>
                             <div className="p-6 space-y-4">
                 {sampleChallenges.map((challenge) => (
                   <ChallengeCard key={challenge.id} challenge={challenge} />
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                📝 Log Rápido
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                ➕ Nuevo Hábito
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                🏆 Ver Desafíos
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                📊 Estadísticas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 