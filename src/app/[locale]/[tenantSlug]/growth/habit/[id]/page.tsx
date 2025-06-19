'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, TrendingUp, CheckCircle, XCircle, MinusCircle, AlertCircle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock data - esto se reemplazará con datos reales de GraphQL
const mockHabit = {
  id: '1',
  name: 'Ejercicio diario',
  description: '30 minutos de actividad física',
  frequency: 'DAILY',
  targetCount: 1,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
};

const mockEntries = [
  { id: '1', date: '2024-01-15', status: 'COMPLETED', note: 'Corrí 5km' },
  { id: '2', date: '2024-01-14', status: 'COMPLETED', note: null },
  { id: '3', date: '2024-01-13', status: 'SKIPPED', note: 'Día de descanso' },
  { id: '4', date: '2024-01-12', status: 'COMPLETED', note: 'Pesas en el gym' },
  { id: '5', date: '2024-01-11', status: 'PARTIAL', note: 'Solo 15 minutos' },
  { id: '6', date: '2024-01-10', status: 'FAILED', note: 'No tuve tiempo' },
  { id: '7', date: '2024-01-09', status: 'COMPLETED', note: null },
];

const statusLabels = {
  COMPLETED: 'Completado',
  SKIPPED: 'Omitido',
  PARTIAL: 'Parcial',
  FAILED: 'Fallido',
};

const statusColors = {
  COMPLETED: 'text-green-700 bg-green-100',
  SKIPPED: 'text-blue-700 bg-blue-100',
  PARTIAL: 'text-yellow-700 bg-yellow-100',
  FAILED: 'text-red-700 bg-red-100',
};

const statusIcons = {
  COMPLETED: CheckCircle,
  SKIPPED: MinusCircle,
  PARTIAL: AlertCircle,
  FAILED: XCircle,
};

export default function HabitDetailPage() {
  const [habit] = useState(mockHabit);
  const [entries] = useState(mockEntries);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Generate last 30 days for calendar view
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const getEntryForDate = (date: string) => {
    return entries.find(entry => entry.date === date);
  };

  const getStreakCount = () => {
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const entry = getEntryForDate(date);
      
      if (entry && entry.status === 'COMPLETED') {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getCompletionRate = () => {
    const completed = entries.filter(entry => entry.status === 'COMPLETED').length;
    return entries.length > 0 ? Math.round((completed / entries.length) * 100) : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="../"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{habit.name}</h1>
          {habit.description && (
            <p className="text-gray-600 mt-1">{habit.description}</p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Racha Actual</p>
              <p className="text-2xl font-bold text-gray-900">{getStreakCount()} días</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-gray-900">{getCompletionRate()}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Entradas</p>
              <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos 30 días</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          
                     {last30Days.map(date => {
             const entry = getEntryForDate(date);
             const isToday = date === format(new Date(), 'yyyy-MM-dd');
             const dayNumber = parseInt(format(new Date(date), 'd'));
            
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`
                  aspect-square p-2 text-xs rounded-md border transition-colors
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                  ${selectedDate === date ? 'bg-blue-100 border-blue-300' : 'border-gray-200'}
                  ${entry ? 
                    entry.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    entry.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                    entry.status === 'SKIPPED' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                {dayNumber}
              </button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Completado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
            <span>Parcial</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Omitido</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>Fallido</span>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Historial de Entradas</h2>
        </div>
        
        <div className="divide-y max-h-96 overflow-y-auto">
          {entries.map((entry) => {
            const Icon = statusIcons[entry.status as keyof typeof statusIcons];
            
            return (
              <div key={entry.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(entry.date), 'dd MMM yyyy', { locale: es })}
                    </p>
                    {entry.note && (
                      <p className="text-sm text-gray-600">{entry.note}</p>
                    )}
                  </div>
                </div>
                
                <span className={`px-2 py-1 text-xs rounded ${statusColors[entry.status as keyof typeof statusColors]}`}>
                  {statusLabels[entry.status as keyof typeof statusLabels]}
                </span>
              </div>
            );
          })}
          
          {entries.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No hay entradas registradas aún</p>
              <p className="text-sm">Comienza marcando tu progreso diario</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 