'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import { Plus, CheckCircle, Target, Zap, Sun, Moon, TrendingUp, Calendar, Star, MoreVertical, Play, Pause } from 'lucide-react';
import { GET_MY_HABITS, GET_TODAY_SCORE, LOG_HABIT_ENTRY } from '@/lib/graphql/growth/client-queries';
import ResetButton from '@/components/growth/ResetButton';
import { useDailyReset, useNewDayIndicator } from '@/hooks/useDailyReset';

// Dark mode hook
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setIsDark(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
}

// Types
interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  targetCount: number;
  currentStreak: number;
  isActive: boolean;
  completedToday: boolean;
  points: number;
  color: string;
  icon: string;
  timeSlot: string;
  entries?: Array<{
    id: string;
    date: string;
    status: string;
    value?: number;
    note?: string;
  }>;
}

// Mock data - será reemplazado con GraphQL
const mockHabits = [
  {
    id: '1',
    name: 'Despertar 5:00 AM',
    description: 'Levantarse temprano para aprovechar el día',
    category: 'MORNING_ROUTINE',
    frequency: 'DAILY',
    targetCount: 1,
    currentStreak: 7,
    isActive: true,
    completedToday: true,
    points: 15,
    color: 'purple',
    icon: '🌅',
    timeSlot: '05:00',
  },
  {
    id: '2',
    name: 'Ejercicio intenso',
    description: '45 minutos de entrenamiento físico',
    category: 'PHYSICAL_TRAINING',
    frequency: 'DAILY',
    targetCount: 1,
    currentStreak: 5,
    isActive: true,
    completedToday: false,
    points: 35,
    color: 'red',
    icon: '💪',
    timeSlot: '06:00',
  },
  {
    id: '3',
    name: 'Meditación',
    description: '15 minutos de mindfulness',
    category: 'PERSONAL_DEVELOPMENT',
    frequency: 'DAILY',
    targetCount: 1,
    currentStreak: 12,
    isActive: true,
    completedToday: false,
    points: 20,
    color: 'indigo',
    icon: '🧘',
    timeSlot: '07:00',
  },
  {
    id: '4',
    name: 'Deep Work',
    description: '2 horas de trabajo concentrado',
    category: 'DEEP_WORK',
    frequency: 'DAILY',
    targetCount: 2,
    currentStreak: 3,
    isActive: true,
    completedToday: false,
    points: 40,
    color: 'blue',
    icon: '💻',
    timeSlot: '09:00',
  },
  {
    id: '5',
    name: 'Lectura',
    description: '30 minutos de lectura técnica',
    category: 'PERSONAL_DEVELOPMENT',
    frequency: 'DAILY',
    targetCount: 1,
    currentStreak: 8,
    isActive: true,
    completedToday: true,
    points: 25,
    color: 'green',
    icon: '📚',
    timeSlot: '21:00',
  },
];

const categories = {
  MORNING_ROUTINE: { name: 'Rutina Matutina', color: 'purple' },
  PHYSICAL_TRAINING: { name: 'Entrenamiento', color: 'red' },
  PERSONAL_DEVELOPMENT: { name: 'Desarrollo Personal', color: 'indigo' },
  DEEP_WORK: { name: 'Deep Work', color: 'blue' },
  NUTRITION: { name: 'Nutrición', color: 'green' },
  SOCIAL_CHARISMA: { name: 'Social', color: 'yellow' },
  REFLECTION: { name: 'Reflexión', color: 'teal' },
  SLEEP_RECOVERY: { name: 'Descanso', color: 'slate' },
};

export default function HabitDashboard() {
  const [isDark, setIsDark] = useDarkMode();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // GraphQL queries
  const { data: habitsData, refetch: refetchHabits } = useQuery(GET_MY_HABITS);
  const { data: scoreData, refetch: refetchScore } = useQuery(GET_TODAY_SCORE);
  
  // Auto-reset diario (reinicia a las 6:00 AM)
  const { isNewDay } = useDailyReset({
    resetHour: 6, // 6:00 AM
    onReset: () => {
      // Refrescar datos cuando se resetea automáticamente
      refetchHabits();
      refetchScore();
    },
    enabled: true,
  });
  
  // Indicador de nuevo día
  const { isNewDay: showNewDayBanner, markAsViewed } = useNewDayIndicator();
  
  // GraphQL mutations
  const [logHabitEntry] = useMutation(LOG_HABIT_ENTRY, {
    refetchQueries: [GET_MY_HABITS, GET_TODAY_SCORE],
  });

  // Use GraphQL data
  const habits: Habit[] = habitsData?.myHabits || [];
  const todayScore = scoreData?.todayScore;

  const completedToday = todayScore?.completedHabits || habits.filter((h: Habit) => h.completedToday).length;
  const totalHabits = todayScore?.totalHabits || habits.length;
  const totalPoints = todayScore?.totalPoints || habits.filter((h: Habit) => h.completedToday).reduce((sum: number, h: Habit) => sum + h.points, 0);
  const maxPoints = habits.reduce((sum: number, h: Habit) => sum + h.points, 0);
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleToggleHabit = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const habit = habits.find(h => h.id === habitId);
      
      if (habit) {
        // Check if there's an entry for today
        const todaysEntry = habit.entries?.find(entry => 
          entry.date.split('T')[0] === today
        );
        
        const newStatus = todaysEntry?.status === 'COMPLETED' ? 'FAILED' : 'COMPLETED';
        
        await logHabitEntry({
          variables: {
            input: {
              habitId,
              date: today,
              status: newStatus,
            }
          }
        });
      }
    } catch (error) {
      console.error('Error logging habit entry:', error);
      // Fallback to local state for demo purposes
      setMockHabits(prev => prev.map(habit => 
        habit.id === habitId 
          ? { 
              ...habit, 
              completedToday: !habit.completedToday,
              currentStreak: !habit.completedToday ? habit.currentStreak + 1 : Math.max(0, habit.currentStreak - 1)
            }
          : habit
      ));
    }
  };

  // Local state for fallback
  const [, setMockHabits] = useState(mockHabits);

  const filteredHabits = selectedCategory 
    ? habits.filter(h => h.category === selectedCategory)
    : habits;

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' = 'bg') => {
    const colors = {
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700' },
      red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700' },
      indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-700' },
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700' },
      green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-700' },
      yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700' },
      teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-700' },
      slate: { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
    };
    return colors[color as keyof typeof colors]?.[type] || colors.blue[type];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Philosophy Banner */}
      <div className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-xl text-white shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            👁️ La Actitud Número Nueve 🧘‍♂️
          </h2>
          <p className="text-lg mb-4 leading-relaxed">
            <span className="font-semibold">Aquí comienza la verdadera mejora.</span> La mayoría pasa por alto este momento crucial: 
            la <span className="underline font-bold">presencia</span> - la capacidad de permanecer plenamente en el momento presente - 
            es la base más profunda de la inteligencia y la fortaleza.
          </p>
          <p className="text-base opacity-90 mb-4">
            Ya no se trata de acumular datos ni acelerar el procesamiento mental, sino de cultivar la 
            <span className="font-semibold"> actitud y el dominio interior</span>. 
            La inteligencia no florece en medio del ruido; surge cuando nos detenemos, observamos, 
            y vemos lo que normalmente pasamos por alto.
          </p>
          <p className="text-base font-medium border-t border-white/30 pt-4">
            🎯 Aprende a dar un paso atrás y mirarte desde fuera, sin estar atrapado en el flujo de emociones y pensamientos.
          </p>
        </div>
      </div>

      {/* New Day Banner */}
      {showNewDayBanner && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌅</div>
          <div>
              <h3 className="font-semibold">¡Nuevo día, nuevas oportunidades!</h3>
              <p className="text-sm opacity-90">
                {isNewDay ? 'Progreso reiniciado automáticamente a las 6:00 AM' : 'Es hora de empezar con tus hábitos de hoy'}
              </p>
            </div>
          </div>
          <button
            onClick={markAsViewed}
            className="text-white hover:text-gray-200 transition-colors p-1"
            title="Cerrar"
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard de Hábitos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* Quick Actions */}
          <ResetButton />
          
          <Link
            href="/es/growth/habit/quick-log"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Log Rápido</span>
          </Link>
          
          <Link
            href="/es/growth/habit/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo</span>
          </Link>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Progreso de Hoy</h2>
          <div className="text-right mt-2 sm:mt-0">
            <div className="text-2xl sm:text-3xl font-bold">{totalPoints}/{maxPoints}</div>
            <div className="text-sm opacity-90">puntos</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Hábitos completados</span>
            <span className="text-sm font-medium">{completedToday}/{totalHabits}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg sm:text-xl font-bold">{completedToday}</div>
            <div className="text-xs sm:text-sm opacity-90">Completados</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold">{totalHabits - completedToday}</div>
            <div className="text-xs sm:text-sm opacity-90">Pendientes</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold">{completionPercentage}%</div>
            <div className="text-xs sm:text-sm opacity-90">Progreso</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Racha Máxima</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.max(...habits.map(h => h.currentStreak))} días
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Puntos</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{totalPoints}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Activos</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {habits.filter(h => h.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Esta Semana</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
            selectedCategory === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700'
          }`}
        >
          Todas
        </button>
        {Object.entries(categories).map(([key, category]) => {
          const isSelected = selectedCategory === key;
          
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                isSelected 
                  ? 'bg-blue-600 text-white' 
                  : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700 ${getColorClasses(category.color, 'border')}`
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredHabits.map((habit) => (
          <div 
            key={habit.id} 
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6 transition-all hover:shadow-md ${
              habit.completedToday ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`text-2xl p-2 rounded-lg ${getColorClasses(habit.color, 'bg')}`}>
                  {habit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {habit.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {habit.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getColorClasses(habit.color, 'bg')} ${getColorClasses(habit.color, 'text')}`}>
                      {categories[habit.category as keyof typeof categories]?.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {habit.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="w-4 h-4" />
              </button>
                </div>
                
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {habit.currentStreak}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Racha</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    +{habit.points}
                    </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Puntos</div>
                </div>
                </div>

              <button
                onClick={() => handleToggleHabit(habit.id)}
                className={`p-3 rounded-full transition-all ${
                  habit.completedToday
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <CheckCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
                <Link
                href={`/es/growth/habit/${habit.id}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                Ver detalles
                </Link>
              
              <div className="flex items-center gap-2">
                {habit.isActive ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Play className="w-3 h-3" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Pause className="w-3 h-3" />
                    Pausado
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredHabits.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay hábitos en esta categoría
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Crea tu primer hábito para empezar tu viaje de crecimiento personal
          </p>
        <Link
            href="/es/growth/habit/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
            <Plus className="w-5 h-5" />
            Crear Hábito
        </Link>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
            href="/es/growth/habit/analytics"
            className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
            <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Analytics</span>
        </Link>
          
        <Link
            href="/es/growth/habit/calendar"
            className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Calendario</span>
        </Link>
          
          <Link
            href="/es/growth/habit/challenges"
            className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <Star className="w-5 h-5" />
            <span className="font-medium">Desafíos</span>
          </Link>
          
          <Link
            href="/es/growth/habit/quick-log"
            className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">Log Rápido</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 