'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Target, Zap, Save, RotateCcw, Brain, Dumbbell, Utensils, Code, BookOpen, Users, FileText, Moon } from 'lucide-react';

interface Habit {
  id: number;
  name: string;
  category: string;
  points: number;
  trackingType: string;
  completed: boolean;
  targetValue?: number;
  value?: number;
}

const categories = {
  MORNING_ROUTINE: { name: 'Rutina Matutina', icon: Brain, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  PHYSICAL_TRAINING: { name: 'Entrenamiento Físico', icon: Dumbbell, color: 'text-red-600 bg-red-50 border-red-200' },
  NUTRITION: { name: 'Nutrición', icon: Utensils, color: 'text-green-600 bg-green-50 border-green-200' },
  DEEP_WORK: { name: 'Deep Work', icon: Code, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  PERSONAL_DEVELOPMENT: { name: 'Desarrollo Personal', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  SOCIAL_CHARISMA: { name: 'Social & Carisma', icon: Users, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  REFLECTION: { name: 'Reflexión', icon: FileText, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  SLEEP_RECOVERY: { name: 'Sueño & Recuperación', icon: Moon, color: 'text-slate-600 bg-slate-50 border-slate-200' },
};

// Mock habits for quick logging
const mockHabits = [
  // Morning Routine
  { id: 1, name: 'Despertar 5:00 AM', category: 'MORNING_ROUTINE', points: 15, trackingType: 'BINARY', completed: false },
  { id: 2, name: 'Agua fría (3 vasos)', category: 'MORNING_ROUTINE', points: 10, trackingType: 'BINARY', completed: true },
  { id: 3, name: 'Respiración Wim Hof', category: 'MORNING_ROUTINE', points: 20, trackingType: 'DURATION', targetValue: 10, completed: false, value: 0 },
  { id: 4, name: 'Meditación visualización', category: 'MORNING_ROUTINE', points: 25, trackingType: 'DURATION', targetValue: 15, completed: false, value: 0 },

  // Physical Training
  { id: 5, name: 'Entrenamiento intenso', category: 'PHYSICAL_TRAINING', points: 35, trackingType: 'DURATION', targetValue: 60, completed: false, value: 0 },
  { id: 6, name: 'Ducha fría', category: 'PHYSICAL_TRAINING', points: 15, trackingType: 'BINARY', completed: false },
  { id: 7, name: 'Trabajo de postura', category: 'PHYSICAL_TRAINING', points: 10, trackingType: 'DURATION', targetValue: 10, completed: false, value: 0 },

  // Nutrition
  { id: 8, name: 'Desayuno power', category: 'NUTRITION', points: 20, trackingType: 'BINARY', completed: false },
  { id: 9, name: 'Suplementos básicos', category: 'NUTRITION', points: 10, trackingType: 'BINARY', completed: true },
  { id: 10, name: 'Comida limpia', category: 'NUTRITION', points: 25, trackingType: 'RATING', targetValue: 8, completed: false, value: 0 },

  // Deep Work
  { id: 11, name: 'Arquitectura (2h)', category: 'DEEP_WORK', points: 40, trackingType: 'DURATION', targetValue: 120, completed: false, value: 0 },
  { id: 12, name: 'Coding (2h)', category: 'DEEP_WORK', points: 40, trackingType: 'DURATION', targetValue: 120, completed: false, value: 0 },
  { id: 13, name: 'UI/UX (1h)', category: 'DEEP_WORK', points: 25, trackingType: 'DURATION', targetValue: 60, completed: false, value: 0 },

  // Personal Development
  { id: 14, name: 'Técnicas de memoria', category: 'PERSONAL_DEVELOPMENT', points: 20, trackingType: 'DURATION', targetValue: 30, completed: false, value: 0 },
  { id: 15, name: 'Ajedrez', category: 'PERSONAL_DEVELOPMENT', points: 15, trackingType: 'DURATION', targetValue: 30, completed: false, value: 0 },
  { id: 16, name: 'Lectura filosofía', category: 'PERSONAL_DEVELOPMENT', points: 30, trackingType: 'DURATION', targetValue: 45, completed: false, value: 0 },

  // Social & Charisma
  { id: 17, name: 'Lectura atracción', category: 'SOCIAL_CHARISMA', points: 15, trackingType: 'DURATION', targetValue: 20, completed: false, value: 0 },
  { id: 18, name: '3 conversaciones nuevas', category: 'SOCIAL_CHARISMA', points: 20, trackingType: 'NUMERIC', targetValue: 3, completed: false, value: 0 },

  // Reflection
  { id: 19, name: 'Journaling', category: 'REFLECTION', points: 15, trackingType: 'DURATION', targetValue: 10, completed: false, value: 0 },
  { id: 20, name: 'Documentar aprendizaje', category: 'REFLECTION', points: 10, trackingType: 'BINARY', completed: false },
  { id: 21, name: 'Gratitud (3 cosas)', category: 'REFLECTION', points: 10, trackingType: 'BINARY', completed: false },

  // Sleep & Recovery
  { id: 22, name: 'Corte pantallas 21:00', category: 'SLEEP_RECOVERY', points: 20, trackingType: 'BINARY', completed: false },
  { id: 23, name: 'Respiración pre-sueño', category: 'SLEEP_RECOVERY', points: 15, trackingType: 'DURATION', targetValue: 5, completed: false, value: 0 },
];

export default function QuickLogPage() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const completedCount = habits.filter(h => h.completed).length;
  const totalPoints = habits.filter(h => h.completed).reduce((sum, h) => sum + h.points, 0);
  const maxPoints = habits.reduce((sum, h) => sum + h.points, 0);
  const completionPercentage = Math.round((completedCount / habits.length) * 100);

  const handleToggleHabit = (habitId: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    ));
  };

  const handleValueChange = (habitId: number, value: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            value,
            completed: habit.trackingType === 'RATING' 
              ? value >= (habit.targetValue || 0)
              : value > 0
          }
        : habit
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    // Show success message (you can implement a toast here)
    console.log('Hábitos guardados exitosamente');
  };

  const handleReset = () => {
    setHabits(prev => prev.map(habit => ({
      ...habit,
      completed: false,
      value: 0
    })));
  };

  const filteredHabits = selectedCategory 
    ? habits.filter(h => h.category === selectedCategory)
    : habits;

  const groupedHabits = filteredHabits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, typeof habits>);

  const renderHabitInput = (habit: Habit) => {
    switch (habit.trackingType) {
      case 'DURATION':
        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={habit.value || 0}
              onChange={(e) => handleValueChange(habit.id, parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 text-sm border rounded"
              placeholder="0"
            />
            <span className="text-xs text-gray-500">min</span>
            <span className="text-xs text-gray-400">/ {habit.targetValue}</span>
          </div>
        );
      case 'NUMERIC':
        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={habit.value || 0}
              onChange={(e) => handleValueChange(habit.id, parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 text-sm border rounded"
              placeholder="0"
            />
            <span className="text-xs text-gray-400">/ {habit.targetValue}</span>
          </div>
        );
      case 'RATING':
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
              <button
                key={rating}
                onClick={() => handleValueChange(habit.id, rating)}
                className={`w-6 h-6 text-xs rounded ${
                  (habit.value || 0) >= rating 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Log Rápido</h1>
          <p className="text-gray-600 mt-1">
            Registra tu progreso diario de forma rápida y eficiente
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Guardando...' : 'Guardar Progreso'}
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
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
              <span className="text-sm">Hábitos completados</span>
              <span className="text-sm font-medium">{completedCount}/{habits.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
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
            <div className="text-lg font-bold">{habits.length - completedCount}</div>
            <div className="text-sm opacity-90">Pendientes</div>
          </div>
          <div>
            <div className="text-lg font-bold">+{totalPoints}</div>
            <div className="text-sm opacity-90">Puntos hoy</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas las categorías
        </button>
        {Object.entries(categories).map(([key, category]) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === key;
          
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isSelected 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Habits List */}
      <div className="space-y-6">
        {Object.entries(groupedHabits).map(([categoryKey, categoryHabits]) => {
          const category = categories[categoryKey as keyof typeof categories];
          const CategoryIcon = category.icon;
          const completedInCategory = categoryHabits.filter(h => h.completed).length;
          const totalInCategory = categoryHabits.length;
          
          return (
            <div key={categoryKey} className={`border-2 rounded-lg p-6 ${category.color}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CategoryIcon className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
                <div className="text-sm font-medium">
                  {completedInCategory}/{totalInCategory} completados
                </div>
              </div>
              
              <div className="space-y-3">
                {categoryHabits.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
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
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${habit.completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                            {habit.name}
                          </span>
                          <span className="text-xs text-blue-600 font-medium">+{habit.points}pts</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {habit.trackingType !== 'BINARY' && renderHabitInput(habit)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="inline-flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <CheckCircle className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Completar Rutina Matutina</div>
              <div className="text-sm opacity-80">Marcar todos los hábitos matutinos</div>
            </div>
          </button>
          
          <button className="inline-flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Zap className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Sesión de Deep Work</div>
              <div className="text-sm opacity-80">Registrar 2 horas de trabajo profundo</div>
            </div>
          </button>
          
          <button className="inline-flex items-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Target className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Entrenamiento Completo</div>
              <div className="text-sm opacity-80">Marcar ejercicio + ducha fría</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 