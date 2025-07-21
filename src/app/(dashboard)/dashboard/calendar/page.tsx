"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  FireIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface DayData {
  date: Date;
  completedHabits: number;
  totalHabits: number;
  points: number;
  streak: boolean;
  hasData: boolean;
}

interface MonthStats {
  totalDays: number;
  completedDays: number;
  averageCompletion: number;
  longestStreak: number;
  totalPoints: number;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarData, setCalendarData] = useState<Map<string, DayData>>(new Map());
  const [monthStats, setMonthStats] = useState<MonthStats | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const generateCalendarData = useCallback(() => {
    const data = new Map<string, DayData>();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Generate sample data for the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      
      // Only generate data for past dates and today
      if (date <= today) {
        const totalHabits = 8; // Assume 8 habits per day
        const completedHabits = Math.floor(Math.random() * (totalHabits + 1));
        const points = completedHabits * 10 + Math.floor(Math.random() * 20);
        const completion = completedHabits / totalHabits;
        
        data.set(dateKey, {
          date,
          completedHabits,
          totalHabits,
          points,
          streak: completion >= 0.7, // 70% or more completion counts as streak
          hasData: true
        });
      }
    }
    
    setCalendarData(data);
  }, [currentDate]);

  const calculateMonthStats = useCallback(() => {
    let totalDays = 0;
    let completedDays = 0;
    let totalCompletion = 0;
    let totalPoints = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Sort dates for streak calculation
    const sortedEntries = Array.from(calendarData.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    sortedEntries.forEach(([, dayData]) => {
      if (dayData.hasData) {
        totalDays++;
        totalPoints += dayData.points;
        const completion = dayData.completedHabits / dayData.totalHabits;
        totalCompletion += completion;
        
        if (completion >= 0.7) {
          completedDays++;
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
    });

    setMonthStats({
      totalDays,
      completedDays,
      averageCompletion: totalDays > 0 ? (totalCompletion / totalDays) * 100 : 0,
      longestStreak,
      totalPoints
    });
  }, [calendarData]);

  useEffect(() => {
    generateCalendarData();
    calculateMonthStats();
  }, [generateCalendarData, calculateMonthStats]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDayCompletion = (date: Date): number => {
    const dateKey = date.toISOString().split('T')[0];
    const dayData = calendarData.get(dateKey);
    if (!dayData) return 0;
    return dayData.completedHabits / dayData.totalHabits;
  };

  const getDayColor = (date: Date): string => {
    const completion = getDayCompletion(date);
    const dateKey = date.toISOString().split('T')[0];
    const dayData = calendarData.get(dateKey);
    
    if (!dayData?.hasData) return 'bg-gray-100';
    
    if (completion >= 0.9) return 'bg-green-500';
    if (completion >= 0.7) return 'bg-green-400';
    if (completion >= 0.5) return 'bg-yellow-400';
    if (completion >= 0.3) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDatePointer = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDatePointer));
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }
    
    return days;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const calendarDays = getCalendarDays();
  const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario de Progreso</h1>
          <p className="text-gray-600">Visualiza tu consistencia y patrones de hábitos</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Año
          </button>
        </div>
      </div>

      {/* Monthly Stats */}
      {monthStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Días Activos</p>
                <p className="text-xl font-bold text-blue-600">{monthStats.completedDays}</p>
                <p className="text-xs text-gray-400">de {monthStats.totalDays} días</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Racha Máxima</p>
                <p className="text-xl font-bold text-orange-600">{monthStats.longestStreak}</p>
                <p className="text-xs text-gray-400">días consecutivos</p>
              </div>
              <FireIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Promedio</p>
                <p className="text-xl font-bold text-green-600">{monthStats.averageCompletion.toFixed(1)}%</p>
                <p className="text-xs text-gray-400">completación</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Puntos Totales</p>
                <p className="text-xl font-bold text-purple-600">{monthStats.totalPoints}</p>
                <p className="text-xs text-gray-400">este mes</p>
              </div>
              <TrophyIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {formatMonthYear(currentDate)}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const dateKey = date.toISOString().split('T')[0];
              const dayData = calendarData.get(dateKey);
              const completion = getDayCompletion(date);
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    relative p-2 h-12 rounded-lg border transition-all hover:scale-105
                    ${isCurrentMonth(date) ? 'text-gray-900' : 'text-gray-400'}
                    ${isToday(date) ? 'ring-2 ring-blue-500' : ''}
                    ${selectedDate?.toDateString() === date.toDateString() ? 'ring-2 ring-blue-300' : ''}
                    ${getDayColor(date)}
                    ${dayData?.hasData ? 'text-white font-medium' : 'bg-gray-50 hover:bg-gray-100'}
                  `}
                >
                  <span className="text-sm">{date.getDate()}</span>
                  
                  {/* Completion Indicator */}
                  {dayData?.hasData && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      {completion >= 0.9 ? (
                        <CheckCircleIcon className="h-3 w-3 text-white" />
                      ) : completion >= 0.7 ? (
                        <MinusCircleIcon className="h-3 w-3 text-white" />
                      ) : completion > 0 ? (
                        <XCircleIcon className="h-3 w-3 text-white" />
                      ) : null}
                    </div>
                  )}
                  
                  {/* Streak Indicator */}
                  {dayData?.streak && (
                    <div className="absolute top-1 right-1">
                      <FireIcon className="h-3 w-3 text-yellow-300" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Details */}
      {selectedDate && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles del {selectedDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {(() => {
            const dateKey = selectedDate.toISOString().split('T')[0];
            const dayData = calendarData.get(dateKey);
            
            if (!dayData?.hasData) {
              return (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No hay datos disponibles para este día</p>
                </div>
              );
            }
            
            const completion = (dayData.completedHabits / dayData.totalHabits) * 100;
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dayData.completedHabits}</div>
                  <div className="text-sm text-gray-500">de {dayData.totalHabits} hábitos</div>
                  <div className="text-xs text-gray-400">completados</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completion.toFixed(0)}%</div>
                  <div className="text-sm text-gray-500">completación</div>
                  <div className="text-xs text-gray-400">del día</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{dayData.points}</div>
                  <div className="text-sm text-gray-500">puntos</div>
                  <div className="text-xs text-gray-400">obtenidos</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leyenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded border"></div>
            <span className="text-sm text-gray-600">Sin datos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-sm text-gray-600">0-30%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-sm text-gray-600">30-50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm text-gray-600">50-70%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-sm text-gray-600">70-90%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">90-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <FireIcon className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Racha activa</span>
          </div>
        </div>
      </div>
    </div>
  );
} 