'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import { Plus, CheckCircle, Target, Zap, Sun, Moon, TrendingUp, Calendar, Star, MoreVertical, Play, Pause, User, Loader2, Archive, RotateCcw, Clock, Award } from 'lucide-react';
import { GET_MY_HABITS, GET_TODAY_SCORE, LOG_HABIT_ENTRY, GET_CURRENT_USER, UPDATE_HABIT } from '@/lib/graphql/growth/client-queries';
import { getCurrentUser, getAllUsers, switchUser } from '@/lib/auth';
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
interface UIHabitEntry {
  id: string;
  date: string;
  status: string;
  value?: number;
  note?: string;
}

interface UIHabitStreak {
  id: string;
  length: number;
  isActive: boolean;
}

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  targetCount: number;
  currentStreak?: number;
  isActive: boolean;
  completedToday?: boolean;
  points: number;
  color: string;
  icon: string;
  entries?: UIHabitEntry[];
  streaks?: UIHabitStreak[];
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImageUrl?: string;
  isActive: boolean;
}

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

// Authentication component
function UserSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const [allUsers, current] = await Promise.all([
          getAllUsers(),
          getCurrentUser()
        ]);
        setUsers(allUsers);
        if (current) {
          setCurrentUser({
            ...current,
            bio: current.bio || undefined,
            profileImageUrl: current.profileImageUrl || undefined,
          });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, []);

  const handleSwitchUser = async (userId: string) => {
    try {
      await switchUser(userId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error switching user:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">{currentUser.firstName}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b dark:border-gray-700">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser.email}
            </div>
          </div>
          
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
              Cambiar usuario:
            </div>
            {users.filter(u => u.id !== currentUser.id).map((user) => (
              <button
                key={user.id}
                onClick={() => handleSwitchUser(user.id)}
                className="w-full text-left px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HabitDashboard() {
  const [isDark, setIsDark] = useDarkMode();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  // GraphQL queries
  const { data: habitsData, refetch: refetchHabits, loading: habitsLoading } = useQuery(GET_MY_HABITS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network' // Para obtener datos frescos
  });
  const { data: scoreData, refetch: refetchScore, loading: scoreLoading } = useQuery(GET_TODAY_SCORE, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });
  const { data: userData } = useQuery(GET_CURRENT_USER, {
    errorPolicy: 'all'
  });
  
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
  
  // Estado para manejar qué hábito se está procesando
  const [processingHabitId, setProcessingHabitId] = useState<string | null>(null);
  
  // Estado para mensajes de feedback
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // GraphQL mutations
  const [logHabitEntry] = useMutation(LOG_HABIT_ENTRY, {
    refetchQueries: [GET_MY_HABITS, GET_TODAY_SCORE],
    awaitRefetchQueries: true, // Esperar a que se actualicen las queries
    onCompleted: (data) => {
      // Refrescar datos manualmente para asegurar sincronización
      refetchHabits();
      refetchScore();
      setProcessingHabitId(null); // Limpiar estado de procesamiento
      
      // Mostrar mensaje de éxito
      const habitName = habits.find(h => h.id === data.logHabitEntry.habitId)?.name || 'Hábito';
      const status = data.logHabitEntry.status === 'COMPLETED' ? 'completado' : 'no completado';
      setMessage({ type: 'success', text: `${habitName} marcado como ${status}` });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      console.error('Error al registrar hábito:', error);
      setProcessingHabitId(null); // Limpiar estado de procesamiento en caso de error
      setMessage({ type: 'error', text: 'Error al actualizar el hábito' });
      setTimeout(() => setMessage(null), 3000);
    }
  });

  const [updateHabit] = useMutation(UPDATE_HABIT, {
    refetchQueries: [GET_MY_HABITS],
    onCompleted: (data) => {
      refetchHabits();
      const action = data.updateHabit.isActive ? 'reactivado' : 'archivado';
      setMessage({ type: 'success', text: `Hábito ${action} exitosamente` });
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      console.error('Error al actualizar hábito:', error);
      setMessage({ type: 'error', text: 'Error al archivar/desarchivar el hábito' });
      setTimeout(() => setMessage(null), 3000);
    }
  });

  // Process GraphQL data
  const habits: Habit[] = habitsData?.myHabits?.map((habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysEntry = habit.entries?.find((entry: UIHabitEntry) => 
      entry.date.split('T')[0] === today
    );
    const activeStreak = habit.streaks?.find((streak: UIHabitStreak) => streak.isActive);
    
    return {
      ...habit,
      completedToday: todaysEntry?.status === 'COMPLETED',
      currentStreak: activeStreak?.length || 0,
      // Ensure we have default values for UI
      color: habit.color || 'blue',
      icon: habit.icon || '⭐',
    };
  }) || [];

  const todayScore = scoreData?.todayScore;

  // Filtrar hábitos por estado (activos vs completados)
  const activeHabits = habits.filter(h => h.isActive);
  const completedHabits = habits.filter(h => !h.isActive);
  
  const completedToday = todayScore?.completedHabits || activeHabits.filter((h: Habit) => h.completedToday).length;
  const totalHabits = todayScore?.totalHabits || activeHabits.length;
  const totalPoints = todayScore?.totalPoints || activeHabits.filter((h: Habit) => h.completedToday).reduce((sum: number, h: Habit) => sum + h.points, 0);
  const maxPoints = activeHabits.reduce((sum: number, h: Habit) => sum + h.points, 0);
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleToggleHabit = async (habitId: string) => {
    if (processingHabitId) return; // Prevenir múltiples clicks mientras se procesa
    
    setProcessingHabitId(habitId); // Marcar como procesando
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const habit = habits.find(h => h.id === habitId);
      
      if (habit) {
        // Verificar si hay una entrada para hoy
        const todaysEntry = habit.entries?.find(entry => 
          entry.date.split('T')[0] === today
        );
        
        // Alternar entre COMPLETED y FAILED/SKIPPED
        let newStatus: 'COMPLETED' | 'FAILED' | 'SKIPPED';
        if (todaysEntry?.status === 'COMPLETED') {
          newStatus = 'FAILED';
        } else {
          newStatus = 'COMPLETED';
        }
        
        console.log(`Cambiando hábito ${habit.name} de ${todaysEntry?.status || 'sin entrada'} a ${newStatus}`);
        
        const result = await logHabitEntry({
          variables: {
            input: {
              habitId,
              date: today,
              status: newStatus,
            }
          }
        });
        
        console.log('Resultado de la mutación:', result);
      }
    } catch (error) {
      console.error('Error al cambiar estado del hábito:', error);
      // El mensaje de error se maneja en el onError del mutation
      setProcessingHabitId(null); // Limpiar estado en caso de error
    }
  };

  const handleArchiveHabit = async (habitId: string, currentStatus: boolean) => {
    if (processingHabitId) return;
    
    setProcessingHabitId(habitId);
    
    try {
      await updateHabit({
        variables: {
          id: habitId,
          input: {
            isActive: !currentStatus
          }
        }
      });
    } catch (error) {
      console.error('Error al archivar/desarchivar hábito:', error);
      setProcessingHabitId(null);
    }
  };

  // Aplicar filtro por categoría según la pestaña activa
  const currentHabits = activeTab === 'active' ? activeHabits : completedHabits;
  const filteredHabits = selectedCategory 
    ? currentHabits.filter(h => h.category === selectedCategory)
    : currentHabits;

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

  // Loading state
  if (habitsLoading || scoreLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Message Notification */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          message.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Target className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>
        </div>
      )}
      
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
          {userData?.currentUser && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Bienvenido, {userData.currentUser.firstName} {userData.currentUser.lastName}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Switcher */}
          <UserSwitcher />
          
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

      {/* Tabs for Active vs Completed Habits */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'active'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Hábitos Activos ({activeHabits.length})
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
            activeTab === 'completed'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Tareas Completadas ({completedHabits.length})
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
          )}
        </button>
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
                {activeHabits.length > 0 ? Math.max(...activeHabits.map(h => h.currentStreak || 0)) : 0} días
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
                {activeHabits.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Esta Semana</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {completionPercentage}%
              </p>
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
          Todas ({currentHabits.length})
        </button>
        {Object.entries(categories).map(([key, category]) => {
          const isSelected = selectedCategory === key;
          const categoryCount = currentHabits.filter(h => h.category === key).length;
          
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
              {category.name} ({categoryCount})
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {habit.name}
                    </h3>
                    {!habit.isActive && (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                        <Archive className="w-3 h-3" />
                        Archivado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {habit.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getColorClasses(habit.color, 'bg')} ${getColorClasses(habit.color, 'text')}`}>
                      {categories[habit.category as keyof typeof categories]?.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {habit.frequency}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Target className="w-3 h-3" />
                      Meta: {habit.targetCount}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Award className="w-3 h-3" />
                      {habit.points} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => handleArchiveHabit(habit.id, habit.isActive)}
                  disabled={processingHabitId === habit.id}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title={habit.isActive ? 'Archivar hábito' : 'Reactivar hábito'}
                >
                  {processingHabitId === habit.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : habit.isActive ? (
                    <Archive className="w-4 h-4" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {habit.currentStreak || 0}
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
                disabled={processingHabitId === habit.id || !habit.isActive}
                className={`p-3 rounded-full transition-all relative ${
                  !habit.isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                    : habit.completedToday
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                } ${processingHabitId === habit.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                title={!habit.isActive ? 'Reactiva el hábito para poder marcarlo' : ''}
              >
                {processingHabitId === habit.id ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <CheckCircle className="w-6 h-6" />
                )}
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
          {activeTab === 'completed' ? (
            <Archive className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          ) : (
            <Target className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          )}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {activeTab === 'completed' 
              ? (selectedCategory ? 'No hay hábitos archivados en esta categoría' : 'No tienes hábitos archivados')
              : (selectedCategory ? 'No hay hábitos activos en esta categoría' : 'No tienes hábitos activos')
            }
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {activeTab === 'completed'
              ? 'Los hábitos que archives aparecerán aquí'
              : (selectedCategory 
                  ? 'Crea tu primer hábito en esta categoría'
                  : 'Crea tu primer hábito para empezar tu viaje de crecimiento personal'
                )
            }
          </p>
          {activeTab === 'active' && (
            <Link
              href="/es/growth/habit/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Hábito
            </Link>
          )}
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