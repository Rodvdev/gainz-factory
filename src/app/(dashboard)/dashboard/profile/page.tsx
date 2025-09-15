"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  UserIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  CameraIcon,
  TrophyIcon,
  FireIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CogIcon,
  HeartIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  createdAt: string;
}

interface ProfileStats {
  // Estadísticas principales
  totalDays: number;
  daysSinceRegistration: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  averageScore: number;
  completedHabits: number;
  
  // Programas y tareas
  completedProgrammes: number;
  activeProgrammes: number;
  completedTasks: number;
  
  // Logros y desafíos
  achievementsUnlocked: number;
  completedChallenges: number;
  recentAchievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: string;
    unlockedAt: string;
  }>;
  
  // Nivel y gamificación
  level: number;
  levelName: string;
  avatarEmoji: string;
  totalXP: number;
  
  // Progreso físico
  latestWeight?: {
    value: number;
    unit: string;
    date: string;
  } | null;
  latestBodyFat?: {
    value: number;
    unit: string;
    date: string;
  } | null;
  latestMuscleMass?: {
    value: number;
    unit: string;
    date: string;
  } | null;
  
  // Estadísticas de período
  last30Days: {
    points: number;
    averageScore: number;
    activeDays: number;
  };
  
  // Análisis detallado
  habitSuccessRates: Array<{
    id: string;
    name: string;
    category: string;
    successRate: number;
    totalEntries: number;
    completedEntries: number;
  }>;
  progressTrend: 'up' | 'down' | 'stable';
  
  // Satisfacción
  satisfaction: number;
}

type TabType = 'info' | 'stats' | 'goals' | 'preferences';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingStats, setRefreshingStats] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('info');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phoneNumber: ''
  });

  useEffect(() => {
    loadUserData();
    loadUserStats();

    // Listen for metrics updates to refresh stats
    const handleMetricsUpdate = () => {
      setRefreshingStats(true);
      loadUserStats().finally(() => {
        setRefreshingStats(false);
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('metricsUpdated', handleMetricsUpdate);
      
      return () => {
        window.removeEventListener('metricsUpdated', handleMetricsUpdate);
      };
    }
  }, []);

  const loadUserData = async () => {
    try {
      // In a real app, this would be an API call
      // For now, using localStorage to simulate user data
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          firstName: parsedUser.firstName || '',
          lastName: parsedUser.lastName || '',
          bio: parsedUser.bio || '',
          phoneNumber: parsedUser.phoneNumber || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to default stats if API fails
      setStats({
        totalDays: 0,
        daysSinceRegistration: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        averageScore: 0,
        completedHabits: 0,
        completedProgrammes: 0,
        activeProgrammes: 0,
        completedTasks: 0,
        achievementsUnlocked: 0,
        completedChallenges: 0,
        recentAchievements: [],
        level: 1,
        levelName: "Novato GF",
        avatarEmoji: "🥚",
        totalXP: 0,
        latestWeight: null,
        latestBodyFat: null,
        latestMuscleMass: null,
        last30Days: {
          points: 0,
          averageScore: 0,
          activeDays: 0
        },
        habitSuccessRates: [],
        progressTrend: 'stable' as const,
        satisfaction: 0
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!user) return;
      
      // In real app, this would be an API call
      const updatedUser: User = { 
        ...user, 
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        phoneNumber: formData.phoneNumber
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y revisa tu progreso</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'info', name: 'Información Personal', icon: UserIcon },
            { id: 'stats', name: 'Estadísticas', icon: ChartBarIcon },
            { id: 'goals', name: 'Objetivos', icon: TrophyIcon },
            { id: 'preferences', name: 'Preferencias', icon: CogIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-lg border shadow-sm">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
                </h2>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-400">
                  Miembro desde {user ? new Date(user.createdAt).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long' 
                  }) : 'Enero 2024'}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <PencilIcon className="h-4 w-4" />
                {editMode ? 'Cancelar' : 'Editar'}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.firstName || 'No especificado'}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.lastName || 'No especificado'}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+51 123 456 789"
                  />
                ) : (
                  <p className="text-gray-900">{user?.phoneNumber || 'No especificado'}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía
              </label>
              {editMode ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cuéntanos sobre ti, tus objetivos y motivaciones..."
                />
              ) : (
                <p className="text-gray-900">{user?.bio || 'No has añadido una biografía aún.'}</p>
              )}
            </div>

            {/* Save/Cancel Buttons */}
            {editMode && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckIcon className="h-4 w-4" />
                  Guardar Cambios
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {refreshingStats && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-700 text-sm font-medium">Actualizando estadísticas...</span>
            </div>
          )}
          {/* Nivel y Progreso */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{stats.avatarEmoji}</span>
                  <div>
                    <h3 className="text-xl font-bold">Nivel {stats.level}</h3>
                    <p className="text-blue-100">{stats.levelName}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>{stats.totalXP} XP</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((stats.totalXP % 1000) / 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.satisfaction}%</p>
                <p className="text-blue-100 text-sm">Satisfacción</p>
              </div>
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Racha Actual</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.currentStreak}</p>
                  <p className="text-xs text-gray-400">días consecutivos</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FireIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Puntos Totales</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">puntos acumulados</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Promedio Diario</p>
                  <p className="text-2xl font-bold text-green-600">{stats.averageScore}%</p>
                  <p className="text-xs text-gray-400">de completación</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Progreso Físico */}
          {(stats.latestWeight || stats.latestBodyFat || stats.latestMuscleMass) && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso Físico</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.latestWeight && (
                  <div className="text-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">⚖️</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.latestWeight.value} {stats.latestWeight.unit}</p>
                    <p className="text-sm text-gray-500">Peso</p>
                    <p className="text-xs text-gray-400">{new Date(stats.latestWeight.date).toLocaleDateString('es-ES')}</p>
                  </div>
                )}
                {stats.latestBodyFat && (
                  <div className="text-center">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.latestBodyFat.value} {stats.latestBodyFat.unit}</p>
                    <p className="text-sm text-gray-500">Grasa Corporal</p>
                    <p className="text-xs text-gray-400">{new Date(stats.latestBodyFat.date).toLocaleDateString('es-ES')}</p>
                  </div>
                )}
                {stats.latestMuscleMass && (
                  <div className="text-center">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">💪</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.latestMuscleMass.value} {stats.latestMuscleMass.unit}</p>
                    <p className="text-sm text-gray-500">Masa Muscular</p>
                    <p className="text-xs text-gray-400">{new Date(stats.latestMuscleMass.date).toLocaleDateString('es-ES')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estadísticas Detalladas */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros y Progreso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
                <p className="text-sm text-gray-500">Días activos</p>
                <p className="text-xs text-gray-400">de {stats.daysSinceRegistration} días</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrophyIcon className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.longestStreak}</p>
                <p className="text-sm text-gray-500">Racha máxima</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BoltIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedHabits}</p>
                <p className="text-sm text-gray-500">Hábitos completados</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <HeartIcon className="h-8 w-8 text-pink-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.achievementsUnlocked}</p>
                <p className="text-sm text-gray-500">Logros desbloqueados</p>
              </div>
            </div>
          </div>

          {/* Programas y Tareas */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Programas y Tareas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrophyIcon className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedProgrammes}</p>
                <p className="text-sm text-gray-500">Programas completados</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProgrammes}</p>
                <p className="text-sm text-gray-500">Programas activos</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckIcon className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                <p className="text-sm text-gray-500">Tareas completadas</p>
              </div>
            </div>
          </div>

          {/* Últimos 30 días */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos 30 Días</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.last30Days.points}</p>
                <p className="text-sm text-gray-500">Puntos obtenidos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.last30Days.averageScore}%</p>
                <p className="text-sm text-gray-500">Promedio de completación</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.last30Days.activeDays}</p>
                <p className="text-sm text-gray-500">Días activos</p>
              </div>
            </div>
          </div>

          {/* Logros Recientes */}
          {stats.recentAchievements.length > 0 && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros Recientes</h3>
              <div className="space-y-3">
                {stats.recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        achievement.rarity === 'LEGENDARY' ? 'bg-yellow-100 text-yellow-800' :
                        achievement.rarity === 'EPIC' ? 'bg-purple-100 text-purple-800' :
                        achievement.rarity === 'RARE' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {achievement.rarity}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hábitos más exitosos */}
          {stats.habitSuccessRates.length > 0 && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hábitos más Exitosos</h3>
              <div className="space-y-3">
                {stats.habitSuccessRates.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BoltIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{habit.name}</h4>
                        <p className="text-sm text-gray-500">{habit.category.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{habit.successRate}%</p>
                      <p className="text-xs text-gray-500">{habit.completedEntries}/{habit.totalEntries}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center py-12">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Objetivos Personales</h3>
            <p className="text-gray-500 mb-4">
              Define y sigue tus metas de transformación personal
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Crear Primer Objetivo
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center py-12">
            <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preferencias</h3>
            <p className="text-gray-500 mb-4">
              Personaliza tu experiencia en Gainz Factory
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Configurar Preferencias
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 