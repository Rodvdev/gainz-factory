'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Target, TrendingUp } from 'lucide-react';

// Mock data - esto se reemplazará con datos reales de GraphQL
const mockHabits = [
  {
    id: '1',
    name: 'Ejercicio diario',
    description: '30 minutos de actividad física',
    frequency: 'DAILY',
    targetCount: 1,
    isActive: true,
    completedToday: true,
    streak: 7,
  },
  {
    id: '2', 
    name: 'Meditar',
    description: '10 minutos de meditación',
    frequency: 'DAILY',
    targetCount: 1,
    isActive: true,
    completedToday: false,
    streak: 3,
  },
  {
    id: '3',
    name: 'Leer',
    description: 'Leer por 30 minutos',
    frequency: 'DAILY',
    targetCount: 1,
    isActive: true,
    completedToday: true,
    streak: 12,
  },
];

const frequencyLabels = {
  DAILY: 'Diario',
  WEEKLY: 'Semanal', 
  MONTHLY: 'Mensual',
};

export default function HabitTrackerPage() {
  const [habits] = useState(mockHabits);

  const activeHabits = habits.filter(habit => habit.isActive);
  const completedToday = activeHabits.filter(habit => habit.completedToday).length;
  const totalActive = activeHabits.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seguimiento de Hábitos</h1>
          <p className="text-gray-600 mt-1">
            Mantén el control de tus hábitos diarios
          </p>
        </div>
        <Link
          href="habit/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Hábito
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Completados Hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedToday}/{totalActive}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Hábitos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Progreso General</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalActive > 0 ? Math.round((completedToday / totalActive) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Tus Hábitos</h2>
        </div>
        
        <div className="divide-y">
          {activeHabits.map((habit) => (
            <div key={habit.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{habit.name}</h3>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {frequencyLabels[habit.frequency as keyof typeof frequencyLabels]}
                    </span>
                    {habit.completedToday && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        ✓ Completado
                      </span>
                    )}
                  </div>
                  {habit.description && (
                    <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Meta: {habit.targetCount}</span>
                    <span>Racha: {habit.streak} días</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      habit.completedToday
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {habit.completedToday ? 'Completado' : 'Marcar'}
                  </button>
                  <Link
                    href={`habit/${habit.id}`}
                    className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {activeHabits.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes hábitos activos
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando tu primer hábito para comenzar a hacer seguimiento
              </p>
              <Link
                href="habit/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear Primer Hábito
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 