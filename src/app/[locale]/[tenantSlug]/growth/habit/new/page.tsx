'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewHabitPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'DAILY' as 'DAILY' | 'WEEKLY' | 'MONTHLY',
    targetCount: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí se hará la llamada GraphQL real
      console.log('Creating habit:', formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to habits list
      router.push('../habit');
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
      [name]: name === 'targetCount' ? parseInt(value) || 1 : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="../habit"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Hábito</h1>
          <p className="text-gray-600 mt-1">
            Define un nuevo hábito para comenzar a hacer seguimiento
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ej. Ejercicio diario, Meditar, Leer..."
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe tu hábito en más detalle..."
          />
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DAILY">Diario</option>
            <option value="WEEKLY">Semanal</option>
            <option value="MONTHLY">Mensual</option>
          </select>
        </div>

        {/* Target Count */}
        <div>
          <label htmlFor="targetCount" className="block text-sm font-medium text-gray-700 mb-2">
            Objetivo por período
          </label>
          <input
            type="number"
            id="targetCount"
            name="targetCount"
            value={formData.targetCount}
            onChange={handleInputChange}
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Cuántas veces quieres completar este hábito por{' '}
            {formData.frequency === 'DAILY' ? 'día' : 
             formData.frequency === 'WEEKLY' ? 'semana' : 'mes'}
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Link
            href="../habit"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Creando...' : 'Crear Hábito'}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Consejos para crear hábitos efectivos</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Comienza con objetivos pequeños y alcanzables</li>
          <li>• Sé específico en la descripción (ej. &quot;20 minutos de ejercicio&quot; en lugar de &quot;ejercicio&quot;)</li>
          <li>• Elige una frecuencia realista para tu estilo de vida</li>
          <li>• Enfócate en 2-3 hábitos a la vez para mejor adherencia</li>
        </ul>
      </div>
    </div>
  );
} 