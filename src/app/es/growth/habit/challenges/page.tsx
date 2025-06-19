'use client';

import { useState } from 'react';
import { Plus, Trophy, Target, Calendar, Users, Star, CheckCircle, XCircle } from 'lucide-react';

type DifficultyType = 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
type ChallengeType = 'STREAK' | 'FREQUENCY' | 'HABIT_COMBO' | 'AVOIDANCE';

// Mock data for challenges
const mockChallenges = {
  active: [
    {
      id: 1,
      title: "Navy SEAL Challenge",
      description: "Completa tu rutina matutina completa durante 30 días consecutivos",
      type: "STREAK" as ChallengeType,
      target: 30,
      current: 7,
      startDate: "2024-01-01",
      endDate: "2024-01-30",
      reward: 500,
      difficulty: "EXTREME" as DifficultyType,
      participants: 156,
      category: "MORNING_ROUTINE",
      isPublic: true,
    },
    {
      id: 2,
      title: "Stoic Discipline",
      description: "Medita 20 minutos diarios y lee filosofía durante 21 días",
      type: "HABIT_COMBO" as ChallengeType,
      target: 21,
      current: 5,
      startDate: "2024-01-10",
      endDate: "2024-01-30",
      reward: 300,
      difficulty: "HARD" as DifficultyType,
      participants: 89,
      category: "PERSONAL_DEVELOPMENT",
      isPublic: true,
    },
    {
      id: 3,
      title: "Beast Mode Training",
      description: "Entrena intensamente 6 días a la semana durante 4 semanas",
      type: "FREQUENCY" as ChallengeType,
      target: 24,
      current: 8,
      startDate: "2024-01-08",
      endDate: "2024-02-04",
      reward: 400,
      difficulty: "HARD" as DifficultyType,
      participants: 203,
      category: "PHYSICAL_TRAINING",
      isPublic: true,
    },
  ],
  completed: [
    {
      id: 4,
      title: "Digital Detox Warrior",
      description: "Sin redes sociales por 14 días consecutivos",
      type: "AVOIDANCE" as ChallengeType,
      target: 14,
      current: 14,
      completedDate: "2023-12-20",
      reward: 200,
      difficulty: "MEDIUM" as DifficultyType,
      category: "REFLECTION",
    },
    {
      id: 5,
      title: "Hydration Master",
      description: "Bebe 3 litros de agua diariamente durante 30 días",
      type: "STREAK" as ChallengeType,
      target: 30,
      current: 30,
      completedDate: "2023-12-15",
      reward: 250,
      difficulty: "EASY" as DifficultyType,
      category: "NUTRITION",
    },
  ],
  available: [
    {
      id: 6,
      title: "Spartan Endurance",
      description: "Corre 5km diarios durante 30 días seguidos",
      type: "STREAK" as ChallengeType,
      target: 30,
      reward: 600,
      difficulty: "EXTREME" as DifficultyType,
      estimatedDuration: "30 días",
      category: "PHYSICAL_TRAINING",
    },
    {
      id: 7,
      title: "Renaissance Mind",
      description: "Lee 1 hora diaria + practica un skill creativo por 21 días",
      type: "HABIT_COMBO" as ChallengeType,
      target: 21,
      reward: 350,
      difficulty: "MEDIUM" as DifficultyType,
      estimatedDuration: "21 días",
      category: "PERSONAL_DEVELOPMENT",
    },
    {
      id: 8,
      title: "Social Confidence",
      description: "Inicia 3 conversaciones nuevas cada día durante 14 días",
      type: "FREQUENCY" as ChallengeType,
      target: 42,
      reward: 300,
      difficulty: "HARD" as DifficultyType,
      estimatedDuration: "14 días",
      category: "SOCIAL_CHARISMA",
    },
  ]
};

const difficultyColors: Record<DifficultyType, string> = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-orange-100 text-orange-800',
  EXTREME: 'bg-red-100 text-red-800',
};

const typeIcons: Record<ChallengeType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  STREAK: Calendar,
  FREQUENCY: Target,
  HABIT_COMBO: Star,
  AVOIDANCE: XCircle,
};

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'completed'>('active');

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Desafíos</h1>
          <p className="text-gray-600 mt-1">
            Supera tus límites con desafíos épicos de crecimiento personal
          </p>
        </div>
        
        <button
          onClick={() => console.log('Create challenge')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Crear Desafío
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
        {[
          { key: 'active', label: `Activos (${mockChallenges.active.length})` },
          { key: 'available', label: `Disponibles (${mockChallenges.available.length})` },
          { key: 'completed', label: `Completados (${mockChallenges.completed.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'active' | 'available' | 'completed')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active Challenges */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {mockChallenges.active.map((challenge) => {
            const TypeIcon = typeIcons[challenge.type];
            const progress = getProgressPercentage(challenge.current, challenge.target);
            const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={challenge.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <TypeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                      <p className="text-gray-600 mt-1">{challenge.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
                          {challenge.difficulty}
                        </span>
                        {challenge.isPublic && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            {challenge.participants} participantes
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{challenge.reward}</div>
                    <div className="text-sm text-gray-600">puntos</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progreso: {challenge.current}/{challenge.target}
                    </span>
                    <span className="text-sm text-gray-600">
                      {daysLeft > 0 ? `${daysLeft} días restantes` : 'Finalizado'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Ver Detalles
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors">
                      Abandonar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Challenges */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockChallenges.available.map((challenge) => {
            const TypeIcon = typeIcons[challenge.type];
            
            return (
              <div key={challenge.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TypeIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${difficultyColors[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duración</span>
                    <span className="font-medium">{challenge.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Recompensa</span>
                    <span className="font-medium text-blue-600">{challenge.reward} puntos</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Objetivo</span>
                    <span className="font-medium">{challenge.target}</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Aceptar Desafío
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Challenges */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {mockChallenges.completed.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-lg shadow-sm border p-6 opacity-90">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                    <p className="text-gray-600 mt-1">{challenge.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-sm text-gray-600">
                        Completado el {new Date(challenge.completedDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-green-600">
                    <Trophy className="w-5 h-5" />
                    <span className="text-xl font-bold">+{challenge.reward}</span>
                  </div>
                  <div className="text-sm text-gray-600">puntos ganados</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Tu Progreso en Desafíos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">12</div>
            <div className="text-sm opacity-90">Desafíos Completados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">3,450</div>
            <div className="text-sm opacity-90">Puntos Ganados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">85%</div>
            <div className="text-sm opacity-90">Tasa de Éxito</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">7</div>
            <div className="text-sm opacity-90">Racha Actual</div>
          </div>
        </div>
      </div>
    </div>
  );
} 