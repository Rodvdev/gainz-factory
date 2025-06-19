'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, TrendingUp, Target, Edit, Trash, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';

// Mock habit data
const mockHabit = {
  id: 1,
  name: 'Despertar 5:00 AM',
  description: 'Levantarse todos los días a las 5:00 AM para comenzar la rutina matutina y maximizar la productividad.',
  category: 'MORNING_ROUTINE',
  frequency: 'DAILY',
  trackingType: 'BINARY',
  targetCount: 1,
  points: 15,
  color: '#8B5CF6',
  isActive: true,
  createdAt: '2024-01-01',
  streak: 7,
  longestStreak: 21,
  totalEntries: 95,
  completionRate: 87,
};

// Mock entries data
const mockEntries = [
  { id: 1, date: '2024-01-15', status: 'COMPLETED', note: 'Perfecto inicio de semana' },
  { id: 2, date: '2024-01-14', status: 'COMPLETED', note: '' },
  { id: 3, date: '2024-01-13', status: 'COMPLETED', note: 'Un poco difícil pero lo logré' },
  { id: 4, date: '2024-01-12', status: 'FAILED', note: 'Me quedé dormido, alarma no sonó' },
  { id: 5, date: '2024-01-11', status: 'COMPLETED', note: '' },
  { id: 6, date: '2024-01-10', status: 'COMPLETED', note: 'Excelente energía toda la mañana' },
  { id: 7, date: '2024-01-09', status: 'COMPLETED', note: '' },
  { id: 8, date: '2024-01-08', status: 'COMPLETED', note: 'Domingo pero mantuve la disciplina' },
  { id: 9, date: '2024-01-07', status: 'SKIPPED', note: 'Fin de semana libre' },
  { id: 10, date: '2024-01-06', status: 'COMPLETED', note: '' },
];



const statusColors = {
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  SKIPPED: 'bg-yellow-100 text-yellow-800',
  PARTIAL: 'bg-blue-100 text-blue-800',
};

const statusIcons = {
  COMPLETED: CheckCircle,
  FAILED: XCircle,
  SKIPPED: Clock,
  PARTIAL: Target,
};

export default function HabitDetailPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'entries' | 'stats'>('overview');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mock calendar data for the month
  const generateCalendarData = () => {
    const data: Record<string, { status: string; note?: string }> = {};
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      // Simulate completion pattern
      const random = Math.random();
      if (random > 0.8) {
        data[dateKey] = { status: 'FAILED' };
      } else if (random > 0.7) {
        data[dateKey] = { status: 'SKIPPED' };
      } else {
        data[dateKey] = { status: 'COMPLETED' };
      }
    }
    
    return data;
  };

  const calendarData = generateCalendarData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'FAILED': return 'bg-red-500';
      case 'SKIPPED': return 'bg-yellow-500';
      case 'PARTIAL': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/es/growth/habit"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{mockHabit.name}</h1>
          <p className="text-gray-600 mt-1">{mockHabit.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors">
            <Trash className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{mockHabit.streak}</div>
          <div className="text-sm text-gray-600 mt-1">Racha Actual</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{mockHabit.longestStreak}</div>
          <div className="text-sm text-gray-600 mt-1">Mejor Racha</div>
            </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{mockHabit.completionRate}%</div>
          <div className="text-sm text-gray-600 mt-1">Tasa de Completitud</div>
          </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">{mockHabit.totalEntries}</div>
          <div className="text-sm text-gray-600 mt-1">Total Registros</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
        {[
          { key: 'overview', label: 'Resumen', icon: BarChart3 },
          { key: 'calendar', label: 'Calendario', icon: Calendar },
          { key: 'entries', label: 'Registros', icon: Target },
          { key: 'stats', label: 'Estadísticas', icon: TrendingUp },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'overview' | 'calendar' | 'entries' | 'stats')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
        </div>
        
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso de los últimos 30 días</h3>
            <div className="grid grid-cols-7 gap-1">
              {Object.entries(calendarData).slice(-21).map(([date, data]) => (
                <div
                  key={date}
                  className={`w-8 h-8 rounded ${getStatusColor(data.status)} opacity-80`}
                  title={`${date}: ${data.status}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>Hace 3 semanas</span>
              <span>Hoy</span>
            </div>
          </div>

          {/* Habit Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Hábito</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Categoría:</span>
                <span className="font-medium">Rutina Matutina</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frecuencia:</span>
                <span className="font-medium">Diaria</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de seguimiento:</span>
                <span className="font-medium">Sí/No</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Puntos por completar:</span>
                <span className="font-medium text-blue-600">{mockHabit.points} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <CheckCircle className="w-3 h-3" />
                  Activo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Creado:</span>
                <span className="font-medium">{formatDate(mockHabit.createdAt)}</span>
        </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Vista de Calendario</h3>
          <div className="grid grid-cols-7 gap-4 mb-6">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {Object.entries(calendarData).map(([date, data]) => {
              const day = new Date(date).getDate();
              const isSelected = selectedDate === date;
            
            return (
              <button
                key={date}
                  onClick={() => setSelectedDate(isSelected ? null : date)}
                  className={`p-3 rounded-lg border-2 transition-all hover:border-blue-300 ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                  <div className={`w-4 h-4 rounded-full mx-auto ${getStatusColor(data.status)}`} />
              </button>
            );
          })}
        </div>
        
        {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Completado</span>
          </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-600">Fallado</span>
          </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span className="text-sm text-gray-600">Omitido</span>
          </div>
          </div>
        </div>
      )}

      {activeTab === 'entries' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Historial de Registros</h3>
          <div className="space-y-4">
            {mockEntries.map(entry => {
              const StatusIcon = statusIcons[entry.status as keyof typeof statusIcons];
            
            return (
                <div key={entry.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full`}>
                    <StatusIcon className={`w-5 h-5 ${
                      entry.status === 'COMPLETED' ? 'text-green-600' :
                      entry.status === 'FAILED' ? 'text-red-600' :
                      entry.status === 'SKIPPED' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {formatDate(entry.date)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[entry.status as keyof typeof statusColors]}`}>
                        {entry.status === 'COMPLETED' ? 'Completado' :
                         entry.status === 'FAILED' ? 'Fallado' :
                         entry.status === 'SKIPPED' ? 'Omitido' : 'Parcial'}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-gray-600">{entry.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Pattern */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patrón Semanal</h3>
            <div className="space-y-3">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => {
                const completion = [95, 88, 92, 85, 78, 45, 52][index];
                return (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-600">{day}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-900">{completion}%</div>
              </div>
            );
          })}
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso Mensual</h3>
            <div className="space-y-4">
              {[
                { month: 'Enero', completion: 87, entries: 25 },
                { month: 'Diciembre', completion: 83, entries: 31 },
                { month: 'Noviembre', completion: 90, entries: 30 },
                { month: 'Octubre', completion: 76, entries: 31 },
              ].map(month => (
                <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{month.month}</div>
                    <div className="text-sm text-gray-600">{month.entries} registros</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{month.completion}%</div>
                    <div className="text-sm text-gray-600">completado</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 