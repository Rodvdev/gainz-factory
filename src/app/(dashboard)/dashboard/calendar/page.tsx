"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  FireIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DayData {
  date: Date;
  completedHabits: number;
  totalHabits: number;
  points: number;
  streak: boolean;
  hasData: boolean;
  habits?: Array<{
    id: string;
    name: string;
    completed: boolean;
    points: number;
  }>;
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
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        
        // Generate sample habits for this day
        const habits = [
          { id: '1', name: 'Despertar 5:00 AM', completed: Math.random() > 0.3, points: 15 },
          { id: '2', name: 'Ejercicio 30 min', completed: Math.random() > 0.4, points: 20 },
          { id: '3', name: 'Meditación 10 min', completed: Math.random() > 0.5, points: 10 },
          { id: '4', name: 'Leer 30 min', completed: Math.random() > 0.6, points: 15 },
          { id: '5', name: 'Escribir diario', completed: Math.random() > 0.7, points: 10 },
          { id: '6', name: 'Sin redes sociales', completed: Math.random() > 0.2, points: 25 },
          { id: '7', name: 'Agua 2L', completed: Math.random() > 0.1, points: 10 },
          { id: '8', name: 'Dormir 8h', completed: Math.random() > 0.4, points: 20 }
        ];

        data.set(dateKey, {
          date,
          completedHabits,
          totalHabits,
          points,
          streak: completion >= 0.7, // 70% or more completion counts as streak
          hasData: true,
          habits
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

  const getDayCompletion = useCallback((date: Date): number => {
    const dateKey = date.toISOString().split('T')[0];
    const dayData = calendarData.get(dateKey);
    if (!dayData) return 0;
    return dayData.completedHabits / dayData.totalHabits;
  }, [calendarData]);

  const getDayColor = useCallback((date: Date): string => {
    const completion = getDayCompletion(date);
    const dateKey = date.toISOString().split('T')[0];
    const dayData = calendarData.get(dateKey);
    
    if (!dayData?.hasData) return 'bg-gray-100';
    
    if (completion >= 0.9) return 'bg-green-500';
    if (completion >= 0.7) return 'bg-green-400';
    if (completion >= 0.5) return 'bg-yellow-400';
    if (completion >= 0.3) return 'bg-orange-400';
    return 'bg-red-400';
  }, [calendarData, getDayCompletion]);

  const getCalendarDays = useCallback(() => {
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
  }, [currentDate]);

  const formatMonthYear = useCallback((date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  }, []);

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  }, [currentDate]);

  const handleEditDate = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    setEditingDate(dateKey);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingDate(null);
  };

  const handleToggleHabit = (habitId: string) => {
    if (!editingDate) return;
    
    setCalendarData(prev => {
      const newData = new Map(prev);
      const dayData = newData.get(editingDate);
      if (!dayData?.habits) return prev;
      
      const updatedHabits = dayData.habits.map(habit => 
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      );
      
      const completedCount = updatedHabits.filter(h => h.completed).length;
      const totalPoints = updatedHabits
        .filter(h => h.completed)
        .reduce((sum, h) => sum + h.points, 0);
      
      newData.set(editingDate, {
        ...dayData,
        habits: updatedHabits,
        completedHabits: completedCount,
        points: totalPoints,
        streak: (completedCount / dayData.totalHabits) >= 0.7
      });
      
      return newData;
    });
  };

  const calendarDays = useMemo(() => getCalendarDays(), [getCalendarDays]);
  const weekdays = useMemo(() => ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], []);

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
                <div key={index} className="relative group">
                  <button
                    onClick={() => setSelectedDate(date)}
                    className={`
                      relative p-2 h-12 w-full rounded-lg border transition-all hover:scale-105
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
                  
                  {/* Edit Button - Only show for days with data */}
                  {dayData?.hasData && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDate(date);
                      }}
                      className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 bg-white/90 hover:bg-white rounded-full shadow-sm"
                      title="Editar hábitos del día"
                    >
                      <PencilIcon className="h-3 w-3 text-gray-600" />
                    </button>
                  )}
                </div>
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

      {/* Edit Modal */}
      {isEditModalOpen && editingDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Editar hábitos - {new Date(editingDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={handleCloseEditModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {(() => {
                const dayData = calendarData.get(editingDate);
                if (!dayData?.habits) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No hay hábitos para este día</p>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    {dayData.habits.map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleHabit(habit.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              habit.completed
                                ? 'bg-green-600 border-green-600 text-white'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {habit.completed && <CheckCircleIcon className="h-4 w-4" />}
                          </button>
                          <div>
                            <p className={`font-medium ${habit.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                              {habit.name}
                            </p>
                            <p className="text-sm text-gray-500">{habit.points} puntos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {habit.completed ? 'Completado' : 'Pendiente'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 