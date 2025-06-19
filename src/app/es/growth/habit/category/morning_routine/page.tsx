'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Brain, CheckCircle, Circle, Clock, Target, TrendingUp } from 'lucide-react';

// Mock morning routine habits
const mockMorningHabits = [
  { id: 1, name: 'Despertar 5:00 AM', points: 15, streak: 7, completed: true, targetTime: '5:00 AM' },
  { id: 2, name: 'Agua fría (3 vasos)', points: 10, streak: 5, completed: true, targetAmount: 3 },
  { id: 3, name: 'Respiración Wim Hof', points: 20, streak: 4, completed: false, targetDuration: 10 },
  { id: 4, name: 'Meditación visualización', points: 25, streak: 3, completed: false, targetDuration: 15 },
  { id: 5, name: 'Journaling matutino', points: 15, streak: 6, completed: true, targetDuration: 5 },
  { id: 6, name: 'Afirmaciones', points: 10, streak: 8, completed: true, targetCount: 5 },
];

const timeBlocks = [
  { time: '5:00 AM', activity: 'Despertar + Agua fría', completed: true },
  { time: '5:10 AM', activity: 'Respiración Wim Hof', completed: false },
  { time: '5:20 AM', activity: 'Meditación', completed: false },
  { time: '5:35 AM', activity: 'Journaling', completed: true },
  { time: '5:40 AM', activity: 'Afirmaciones', completed: true },
];

export default function MorningRoutinePage() {
  const [habits, setHabits] = useState(mockMorningHabits);

  const handleToggleHabit = (habitId: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    ));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalPoints = habits.filter(h => h.completed).reduce((sum, h) => sum + h.points, 0);
  const maxPoints = habits.reduce((sum, h) => sum + h.points, 0);
  const completionPercentage = Math.round((completedCount / habits.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/es/growth/habit"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rutina Matutina</h1>
              <p className="text-gray-600 mt-1">
                La fundación de un día de alto rendimiento - 5:00 AM - 6:00 AM
              </p>
            </div>
          </div>
        </div>
        
        <Link 
          href="/es/growth/habit/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir Hábito
        </Link>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Progreso de Hoy</h2>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalPoints}/{maxPoints}</div>
            <div className="text-sm opacity-90">puntos</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Rutina completada</span>
              <span className="text-sm font-medium">{completedCount}/{habits.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {completionPercentage}%
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-lg font-bold">{completedCount}</div>
            <div className="text-sm opacity-90">Completados</div>
          </div>
          <div>
            <div className="text-lg font-bold">{habits.filter(h => h.streak >= 5).length}</div>
            <div className="text-sm opacity-90">Rachas 5+</div>
          </div>
          <div>
            <div className="text-lg font-bold">60 min</div>
            <div className="text-sm opacity-90">Duración total</div>
          </div>
        </div>
      </div>

      {/* Time Schedule */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cronograma Matutino</h3>
        <div className="space-y-3">
          {timeBlocks.map((block, index) => (
            <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${
              block.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                {block.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-mono text-sm font-medium text-gray-900">{block.time}</span>
              </div>
              <div className="flex-1">
                <span className={`${block.completed ? 'text-green-900' : 'text-gray-700'}`}>
                  {block.activity}
                </span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Habits List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hábitos de la Rutina</h3>
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleHabit(habit.id)}
                  className="flex-shrink-0"
                >
                  {habit.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${habit.completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                      {habit.name}
                    </span>
                    <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                      +{habit.points}pts
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{habit.streak} días</span>
                    </div>
                    {habit.targetTime && (
                      <span>Meta: {habit.targetTime}</span>
                    )}
                    {habit.targetDuration && (
                      <span>Meta: {habit.targetDuration} min</span>
                    )}
                    {habit.targetAmount && (
                      <span>Meta: {habit.targetAmount} vasos</span>
                    )}
                    {habit.targetCount && (
                      <span>Meta: {habit.targetCount} veces</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  href={`/es/growth/habit/${habit.id}`}
                  className="px-3 py-1 text-purple-700 hover:bg-purple-100 rounded-md transition-colors text-sm"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">95%</div>
          <div className="text-sm text-gray-600 mt-1">Tasa de completitud</div>
          <div className="text-xs text-gray-500 mt-1">Últimos 30 días</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-green-600">14</div>
          <div className="text-sm text-gray-600 mt-1">Mejor racha</div>
          <div className="text-xs text-gray-500 mt-1">Despertar 5:00 AM</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">1,250</div>
          <div className="text-sm text-gray-600 mt-1">Puntos ganados</div>
          <div className="text-xs text-gray-500 mt-1">Este mes</div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights de la Rutina</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Fortalezas
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Excelente consistencia despertando temprano</li>
              <li>• Buena adherencia a la hidratación matutina</li>
              <li>• Journaling se ha vuelto automático</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Oportunidades
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Mejorar consistencia en respiración Wim Hof</li>
              <li>• Aumentar duración de meditación gradualmente</li>
              <li>• Optimizar tiempo entre actividades</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 