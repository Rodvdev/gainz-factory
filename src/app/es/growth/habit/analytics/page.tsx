'use client';

import { useState } from 'react';
import { TrendingUp, Target, Calendar, Award, Clock, Brain, Dumbbell, Utensils, Code, BookOpen, Users, FileText, Moon } from 'lucide-react';

const categories = {
  MORNING_ROUTINE: { name: 'Rutina Matutina', icon: Brain, color: 'bg-purple-500' },
  PHYSICAL_TRAINING: { name: 'Entrenamiento Físico', icon: Dumbbell, color: 'bg-red-500' },
  NUTRITION: { name: 'Nutrición', icon: Utensils, color: 'bg-green-500' },
  DEEP_WORK: { name: 'Deep Work', icon: Code, color: 'bg-blue-500' },
  PERSONAL_DEVELOPMENT: { name: 'Desarrollo Personal', icon: BookOpen, color: 'bg-indigo-500' },
  SOCIAL_CHARISMA: { name: 'Social & Carisma', icon: Users, color: 'bg-yellow-500' },
  REFLECTION: { name: 'Reflexión', icon: FileText, color: 'bg-teal-500' },
  SLEEP_RECOVERY: { name: 'Sueño & Recuperación', icon: Moon, color: 'bg-slate-500' },
};

// Mock data for analytics
const mockStats = {
  totalHabits: 30,
  activeHabits: 22,
  completionRate: 74,
  currentStreak: 7,
  totalPoints: 8450,
  weeklyProgress: [
    { day: 'L', completion: 85, points: 340 },
    { day: 'M', completion: 78, points: 315 },
    { day: 'X', completion: 92, points: 385 },
    { day: 'J', completion: 67, points: 280 },
    { day: 'V', completion: 88, points: 365 },
    { day: 'S', completion: 45, points: 195 },
    { day: 'D', completion: 72, points: 305 },
  ],
  categoryStats: [
    { category: 'MORNING_ROUTINE', completion: 95, points: 1200, streak: 14 },
    { category: 'PHYSICAL_TRAINING', completion: 78, points: 980, streak: 3 },
    { category: 'NUTRITION', completion: 82, points: 1150, streak: 5 },
    { category: 'DEEP_WORK', completion: 85, points: 2100, streak: 7 },
    { category: 'PERSONAL_DEVELOPMENT', completion: 65, points: 780, streak: 2 },
    { category: 'SOCIAL_CHARISMA', completion: 55, points: 440, streak: 1 },
    { category: 'REFLECTION', completion: 88, points: 650, streak: 6 },
    { category: 'SLEEP_RECOVERY', completion: 92, points: 920, streak: 8 },
  ],
  monthlyTrend: [
    { month: 'Ene', points: 6800, completion: 68 },
    { month: 'Feb', points: 7200, completion: 72 },
    { month: 'Mar', points: 7800, completion: 78 },
    { month: 'Abr', points: 8200, completion: 82 },
    { month: 'May', points: 8450, completion: 84 },
  ],
  bestPerformingHabits: [
    { name: 'Despertar 5:00 AM', completion: 100, streak: 30 },
    { name: 'Meditación matutina', completion: 96, streak: 22 },
    { name: 'Ejercicio intenso', completion: 91, streak: 8 },
    { name: 'Leer filosofía', completion: 87, streak: 5 },
  ],
  timeAnalysis: {
    mostProductiveHour: '6:00 AM',
    averageCompletionTime: '85%',
    bestDay: 'Miércoles',
    totalHoursTracked: 1240,
  }
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado de tu progreso y rendimiento
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
          {[
            { key: '7d', label: '7 días' },
            { key: '30d', label: '30 días' },
            { key: '90d', label: '90 días' },
            { key: '1y', label: '1 año' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeRange(key as '7d' | '30d' | '90d' | '1y')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hábitos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.activeHabits}/{mockStats.totalHabits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasa de Completitud</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Racha Actual</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.currentStreak} días</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mejor Hora</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.timeAnalysis.mostProductiveHour}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Progreso Semanal</h2>
        <div className="grid grid-cols-7 gap-4">
          {mockStats.weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-600">{day.day}</div>
              </div>
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-lg transition-all duration-500"
                  style={{ height: `${day.completion}%` }}
                />
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <span className="text-xs font-medium text-white">{day.completion}%</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">{day.points} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Rendimiento por Categoría</h2>
          <div className="space-y-4">
            {mockStats.categoryStats.map((stat) => {
              const category = categories[stat.category as keyof typeof categories];
              const Icon = category.icon;
              
              return (
                <div key={stat.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{stat.completion}% completado</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{stat.points} pts</p>
                    <p className="text-sm text-gray-600">{stat.streak} días racha</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Mejores Hábitos</h2>
          <div className="space-y-4">
            {mockStats.bestPerformingHabits.map((habit, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{habit.name}</p>
                    <p className="text-sm text-gray-600">{habit.completion}% completado</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{habit.streak} días</p>
                  <p className="text-sm text-gray-600">racha actual</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Tendencia Mensual</h2>
        <div className="grid grid-cols-5 gap-4">
          {mockStats.monthlyTrend.map((month, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-600">{month.month}</div>
              </div>
              <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                  style={{ height: `${(month.points / 10000) * 100}%` }}
                />
              </div>
              <div className="text-sm font-semibold text-gray-900">{month.points}</div>
              <div className="text-xs text-gray-500">{month.completion}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Insights & Recomendaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">🔥 Fortalezas</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Excelente consistencia en rutina matutina (95%)</li>
              <li>• Fuerte racha en hábitos de sueño (8 días)</li>
              <li>• Mejora constante en los últimos 5 meses</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">💡 Oportunidades</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Mejorar consistencia en hábitos sociales</li>
              <li>• Enfocarse en fines de semana (45% vs 80%)</li>
              <li>• Aumentar frecuencia de desarrollo personal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 