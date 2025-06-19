'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Dumbbell, CheckCircle, Circle, Flame, Timer, Zap, TrendingUp } from 'lucide-react';

// Mock physical training habits
const mockTrainingHabits = [
  { id: 7, name: 'Entrenamiento intenso', points: 35, streak: 3, completed: false, targetDuration: 60, currentValue: 0, type: 'duration' },
  { id: 8, name: 'Ducha fría', points: 15, streak: 8, completed: false, targetDuration: 2, currentValue: 0, type: 'duration' },
  { id: 9, name: 'Trabajo de postura', points: 10, streak: 5, completed: true, targetDuration: 10, currentValue: 12, type: 'duration' },
  { id: 10, name: 'Cardio matutino', points: 25, streak: 2, completed: false, targetDuration: 30, currentValue: 0, type: 'duration' },
  { id: 11, name: 'Estiramientos', points: 10, streak: 7, completed: true, targetDuration: 15, currentValue: 15, type: 'duration' },
  { id: 12, name: 'Hidratación post-entreno', points: 5, streak: 4, completed: false, targetAmount: 1, currentValue: 0, type: 'amount' },
];

const workoutPlan = [
  { exercise: 'Calentamiento dinámico', duration: '10 min', intensity: 'Baja', completed: false },
  { exercise: 'Fuerza compuesta', duration: '25 min', intensity: 'Alta', completed: false },
  { exercise: 'Accesorios', duration: '15 min', intensity: 'Media', completed: false },
  { exercise: 'Cardio HIIT', duration: '10 min', intensity: 'Máxima', completed: false },
  { exercise: 'Enfriamiento', duration: '5 min', intensity: 'Baja', completed: false },
];

const weeklyMetrics = [
  { day: 'L', completed: true, intensity: 85 },
  { day: 'M', completed: true, intensity: 78 },
  { day: 'X', completed: false, intensity: 0 },
  { day: 'J', completed: true, intensity: 92 },
  { day: 'V', completed: false, intensity: 0 },
  { day: 'S', completed: true, intensity: 65 },
  { day: 'D', completed: false, intensity: 0 },
];

export default function PhysicalTrainingPage() {
  const [habits, setHabits] = useState(mockTrainingHabits);
  const [workout, setWorkout] = useState(workoutPlan);

  const handleToggleHabit = (habitId: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    ));
  };

  const handleToggleExercise = (index: number) => {
    setWorkout(prev => prev.map((exercise, i) => 
      i === index 
        ? { ...exercise, completed: !exercise.completed }
        : exercise
    ));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalPoints = habits.filter(h => h.completed).reduce((sum, h) => sum + h.points, 0);
  const maxPoints = habits.reduce((sum, h) => sum + h.points, 0);
  const completionPercentage = Math.round((completedCount / habits.length) * 100);

  const workoutCompleted = workout.filter(e => e.completed).length;
  const workoutProgress = Math.round((workoutCompleted / workout.length) * 100);

  const weeklyCompletions = weeklyMetrics.filter(m => m.completed).length;

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
            <div className="p-3 bg-red-100 rounded-lg">
              <Dumbbell className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Entrenamiento Físico</h1>
              <p className="text-gray-600 mt-1">
                Forja tu cuerpo de acero - Fuerza, resistencia y disciplina
              </p>
            </div>
          </div>
        </div>
        
        <Link 
          href="/es/growth/habit/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir Hábito
        </Link>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Beast Mode Activado</h2>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalPoints}/{maxPoints}</div>
            <div className="text-sm opacity-90">puntos</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Hábitos completados</span>
              <span className="text-sm font-medium">{completedCount}/{habits.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Sesión de hoy</span>
              <span className="text-sm font-medium">{workoutCompleted}/{workout.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${workoutProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-lg font-bold">{weeklyCompletions}/7</div>
            <div className="text-sm opacity-90">Esta semana</div>
          </div>
          <div>
            <div className="text-lg font-bold">85</div>
            <div className="text-sm opacity-90">Intensidad avg</div>
          </div>
          <div>
            <div className="text-lg font-bold">3</div>
            <div className="text-sm opacity-90">Racha actual</div>
          </div>
        </div>
      </div>

      {/* Weekly Training Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Semana de Entrenamiento</h3>
        <div className="grid grid-cols-7 gap-4">
          {weeklyMetrics.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">{day.day}</div>
              <div className={`w-full h-20 rounded-lg flex items-end justify-center p-2 ${
                day.completed ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {day.completed && (
                  <div 
                    className="w-full bg-red-600 rounded-sm min-h-[8px]" 
                    style={{ height: `${(day.intensity / 100) * 60}px` }}
                  />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {day.completed ? `${day.intensity}%` : 'Descanso'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Workout Plan */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Plan de Entrenamiento Hoy</h3>
          <div className="text-sm text-gray-600">
            65 min total
          </div>
        </div>
        <div className="space-y-3">
          {workout.map((exercise, index) => (
            <div key={index} className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
              exercise.completed 
                ? 'bg-red-50 border-red-200' 
                : 'bg-gray-50 border-gray-200 hover:border-red-300'
            }`}>
              <button
                onClick={() => handleToggleExercise(index)}
                className="flex-shrink-0"
              >
                {exercise.completed ? (
                  <CheckCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 hover:text-red-600" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${exercise.completed ? 'text-red-900 line-through' : 'text-gray-900'}`}>
                    {exercise.exercise}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exercise.intensity === 'Máxima' ? 'bg-red-100 text-red-800' :
                    exercise.intensity === 'Alta' ? 'bg-orange-100 text-orange-800' :
                    exercise.intensity === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {exercise.intensity}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Timer className="w-3 h-3" />
                  <span>{exercise.duration}</span>
                </div>
              </div>
              {exercise.intensity === 'Máxima' && (
                <Flame className="w-5 h-5 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Training Habits */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hábitos de Entrenamiento</h3>
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
                    <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded-full">
                      +{habit.points}pts
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{habit.streak} días</span>
                    </div>
                    {habit.type === 'duration' && (
                      <span>Meta: {habit.targetDuration} min</span>
                    )}
                    {habit.type === 'amount' && (
                      <span>Meta: {habit.targetAmount} L</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {habit.type === 'duration' && !habit.completed && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-16 px-2 py-1 text-sm border rounded"
                    />
                    <span className="text-xs text-gray-500">min</span>
                  </div>
                )}
                <Link
                  href={`/es/growth/habit/${habit.id}`}
                  className="px-3 py-1 text-red-700 hover:bg-red-100 rounded-md transition-colors text-sm"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-6 h-6 text-orange-600 mr-2" />
            <div className="text-2xl font-bold text-orange-600">78%</div>
          </div>
          <div className="text-sm text-gray-600">Consistencia</div>
          <div className="text-xs text-gray-500 mt-1">Últimos 30 días</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="w-6 h-6 text-red-600 mr-2" />
            <div className="text-2xl font-bold text-red-600">850</div>
          </div>
          <div className="text-sm text-gray-600">Calorías quemadas</div>
          <div className="text-xs text-gray-500 mt-1">Promedio sesión</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Timer className="w-6 h-6 text-blue-600 mr-2" />
            <div className="text-2xl font-bold text-blue-600">65</div>
          </div>
          <div className="text-sm text-gray-600">Minutos promedio</div>
          <div className="text-xs text-gray-500 mt-1">Por sesión</div>
        </div>
      </div>

      {/* Motivation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentalidad Warrior</h3>
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
          <blockquote className="text-red-900 font-medium italic text-center">
            &quot;Discipline is choosing between what you want now and what you want most.&quot;
          </blockquote>
          <p className="text-center text-red-700 text-sm mt-2">— Abraham Lincoln</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-medium text-green-700 mb-2">💪 Logros esta semana</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Completaste 4/7 entrenamientos</li>
              <li>• Aumentaste intensidad promedio 15%</li>
              <li>• Mantuviste consistencia en duchas frías</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-700 mb-2">🔥 Próximos objetivos</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Completar 6/7 entrenamientos</li>
              <li>• Aumentar tiempo de cardio HIIT</li>
              <li>• Mejorar trabajo de postura</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 