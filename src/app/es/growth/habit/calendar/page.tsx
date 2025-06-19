'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as Download } from 'lucide-react';

// Mock data for calendar
const mockCalendarData = {
  '2024-01-01': { completed: 8, total: 12, completion: 67 },
  '2024-01-02': { completed: 10, total: 12, completion: 83 },
  '2024-01-03': { completed: 11, total: 12, completion: 92 },
  '2024-01-04': { completed: 9, total: 12, completion: 75 },
  '2024-01-05': { completed: 12, total: 12, completion: 100 },
  '2024-01-06': { completed: 6, total: 12, completion: 50 },
  '2024-01-07': { completed: 8, total: 12, completion: 67 },
  '2024-01-08': { completed: 11, total: 12, completion: 92 },
  '2024-01-09': { completed: 10, total: 12, completion: 83 },
  '2024-01-10': { completed: 12, total: 12, completion: 100 },
  '2024-01-15': { completed: 9, total: 12, completion: 75 },
  '2024-01-20': { completed: 11, total: 12, completion: 92 },
  '2024-01-25': { completed: 8, total: 12, completion: 67 },
  '2024-01-30': { completed: 10, total: 12, completion: 83 },
};

const getIntensityClass = (completion: number) => {
  if (completion >= 90) return 'bg-green-600';
  if (completion >= 75) return 'bg-green-500';
  if (completion >= 60) return 'bg-green-400';
  if (completion >= 40) return 'bg-green-300';
  if (completion >= 20) return 'bg-green-200';
  if (completion > 0) return 'bg-green-100';
  return 'bg-gray-100';
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const days = getDaysInMonth(currentDate);
  const selectedData = selectedDate ? mockCalendarData[selectedDate as keyof typeof mockCalendarData] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Hábitos</h1>
          <p className="text-gray-600 mt-1">
            Visualiza tu progreso diario y patrones de comportamiento
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Año
            </button>
          </div>
          
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-16" />;
            }
            
            const dateKey = formatDateKey(day);
            const dayData = mockCalendarData[dateKey as keyof typeof mockCalendarData];
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = dateKey === selectedDate;
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                className={`h-16 p-1 rounded-lg border-2 transition-all hover:border-blue-300 ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : isToday 
                      ? 'border-blue-300' 
                      : 'border-gray-200'
                }`}
              >
                <div className="h-full flex flex-col items-center justify-center">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </span>
                  {dayData && (
                    <div 
                      className={`w-6 h-1.5 rounded-full mt-1 ${getIntensityClass(dayData.completion)}`}
                      title={`${dayData.completed}/${dayData.total} hábitos completados (${dayData.completion}%)`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leyenda de Intensidad</h3>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-600">Menos</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <div className="w-4 h-4 bg-green-600 rounded"></div>
          </div>
          <span className="text-sm text-gray-600">Más</span>
        </div>
        <div className="flex items-center gap-8 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 rounded border-2 border-blue-300"></div>
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span>90-100% completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>60-89% completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>20-59% completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>Sin datos</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedData && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles del {new Date(selectedDate!).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{selectedData.completed}</div>
              <div className="text-sm text-gray-600">Hábitos Completados</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{selectedData.total}</div>
              <div className="text-sm text-gray-600">Total de Hábitos</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{selectedData.completion}%</div>
              <div className="text-sm text-gray-600">Tasa de Completitud</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso del día</span>
              <span className="text-sm text-gray-600">{selectedData.completed}/{selectedData.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${selectedData.completion}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-gray-900">85%</div>
          <div className="text-sm text-gray-600 mt-1">Promedio del mes</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-600 mt-1">Días perfectos</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">7</div>
          <div className="text-sm text-gray-600 mt-1">Racha actual</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">28</div>
          <div className="text-sm text-gray-600 mt-1">Días activos</div>
        </div>
      </div>
    </div>
  );
} 