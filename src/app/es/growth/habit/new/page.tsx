'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Brain, Dumbbell, Utensils, Code, BookOpen, Users, FileText, Moon } from 'lucide-react';

const categories = {
  MORNING_ROUTINE: { name: 'Rutina Matutina', icon: Brain, color: 'text-purple-600 bg-purple-50' },
  PHYSICAL_TRAINING: { name: 'Entrenamiento Físico', icon: Dumbbell, color: 'text-red-600 bg-red-50' },
  NUTRITION: { name: 'Nutrición', icon: Utensils, color: 'text-green-600 bg-green-50' },
  DEEP_WORK: { name: 'Deep Work', icon: Code, color: 'text-blue-600 bg-blue-50' },
  PERSONAL_DEVELOPMENT: { name: 'Desarrollo Personal', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50' },
  SOCIAL_CHARISMA: { name: 'Social & Carisma', icon: Users, color: 'text-yellow-600 bg-yellow-50' },
  REFLECTION: { name: 'Reflexión', icon: FileText, color: 'text-teal-600 bg-teal-50' },
  SLEEP_RECOVERY: { name: 'Sueño & Recuperación', icon: Moon, color: 'text-slate-600 bg-slate-50' },
};

const trackingTypes = {
  BINARY: { name: 'Sí/No', description: 'Completado o no completado' },
  DURATION: { name: 'Duración', description: 'Tiempo en minutos' },
  NUMERIC: { name: 'Numérico', description: 'Cantidad específica' },
  RATING: { name: 'Valoración', description: 'Escala del 1 al 10' },
  TEXT: { name: 'Texto libre', description: 'Notas y observaciones' },
};

export default function NewHabitPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'MORNING_ROUTINE' as keyof typeof categories,
    frequency: 'DAILY' as 'DAILY' | 'WEEKLY' | 'MONTHLY',
    trackingType: 'BINARY' as keyof typeof trackingTypes,
    targetCount: 1,
    targetValue: 0,
    targetUnit: '',
    points: 10,
    color: '#3B82F6',
    icon: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí se hará la llamada GraphQL real
      console.log('Creating habit:', formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to dashboard
      router.push('/es/growth/habit');
    } catch (error) {
      console.error('Error creating habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['targetCount', 'targetValue', 'points'].includes(name) 
        ? parseInt(value) || 0 
        : value,
    }));
  };

  const selectedCategory = categories[formData.category];
  const CategoryIcon = selectedCategory.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/es/growth/habit"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Hábito</h1>
          <p className="text-gray-600 mt-1">
            Define un nuevo hábito para tu rutina de alto rendimiento
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Información Básica</h2>
          
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del hábito *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ej. Meditación matutina, Ejercicio intenso, Leer filosofía..."
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe tu hábito en más detalle..."
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Categoría</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon;
              const isSelected = formData.category === key;
              
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: key as keyof typeof categories }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    isSelected ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {category.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tracking Configuration */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Configuración de Seguimiento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia *
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DAILY">Diario</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
              </select>
            </div>

            {/* Tracking Type */}
            <div>
              <label htmlFor="trackingType" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de seguimiento *
              </label>
              <select
                id="trackingType"
                name="trackingType"
                value={formData.trackingType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(trackingTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.name} - {type.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Configuration */}
          {(formData.trackingType === 'DURATION' || formData.trackingType === 'NUMERIC' || formData.trackingType === 'RATING') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor objetivo
                </label>
                <input
                  type="number"
                  id="targetValue"
                  name="targetValue"
                  value={formData.targetValue}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="targetUnit" className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad
                </label>
                <input
                  type="text"
                  id="targetUnit"
                  name="targetUnit"
                  value={formData.targetUnit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej. minutos, páginas, repeticiones"
                />
              </div>
            </div>
          )}
        </div>

        {/* Gamification */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Gamificación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                Puntos por completar
              </label>
              <input
                type="number"
                id="points"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                Color personalizado
              </label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full h-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Link
            href="/es/growth/habit"
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Creando...' : 'Crear Hábito'}
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
        <div className="border rounded-lg p-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${selectedCategory.color} mb-2`}>
            <CategoryIcon className="w-4 h-4" />
            {selectedCategory.name}
          </div>
          <h4 className="font-semibold text-gray-900">
            {formData.name || 'Nombre del hábito'}
          </h4>
          {formData.description && (
            <p className="text-gray-600 text-sm mt-1">{formData.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>Frecuencia: {formData.frequency === 'DAILY' ? 'Diario' : formData.frequency === 'WEEKLY' ? 'Semanal' : 'Mensual'}</span>
            <span>Puntos: {formData.points}</span>
            {formData.targetValue > 0 && (
              <span>Meta: {formData.targetValue} {formData.targetUnit}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 