'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { GET_MY_HABITS, GET_TODAY_SCORE, RESET_TODAY_PROGRESS, GET_CATEGORY_STATS } from '@/lib/graphql/growth/client-queries';

interface ResetButtonProps {
  onReset?: () => void;
  variant?: 'default' | 'compact';
}

export default function ResetButton({ onReset, variant = 'default' }: ResetButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [resetProgress] = useMutation(RESET_TODAY_PROGRESS, {
    refetchQueries: [
      GET_MY_HABITS, 
      GET_TODAY_SCORE, 
      GET_CATEGORY_STATS
    ],
  });

  const handleReset = async () => {
    try {
      setIsResetting(true);
      const result = await resetProgress();
      
      if (result.data?.resetTodayProgress?.success) {
        setResetSuccess(true);
        onReset?.();
        setShowConfirm(false);
        
        // Mostrar feedback temporal
        setTimeout(() => {
          setResetSuccess(false);
        }, 3000);
        
        console.log('✅ Progreso diario reiniciado:', result.data.resetTodayProgress.message);
      } else {
        throw new Error(result.data?.resetTodayProgress?.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
      alert('❌ Error al reiniciar el progreso. Intenta de nuevo.');
    } finally {
      setIsResetting(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
        <CheckCircle className="w-4 h-4" />
        <span className={variant === 'compact' ? 'hidden sm:inline' : ''}>
          Progreso reiniciado
        </span>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reiniciar Progreso del Día
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            ¿Estás seguro de que quieres reiniciar el progreso de todos los hábitos de hoy? 
            Esta acción eliminará todas las entradas completadas del día actual.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              💡 <strong>Consejo:</strong> Esta función es útil para testing o si quieres empezar el día de nuevo.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              disabled={isResetting}
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isResetting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Reiniciando...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Sí, reiniciar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className={`flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors ${
        variant === 'compact' ? 'px-2' : 'px-3'
      }`}
      title="Reiniciar progreso de hoy - Solo para testing"
    >
      <RotateCcw className="w-4 h-4" />
      <span className={variant === 'compact' ? 'hidden sm:inline' : ''}>
        Reiniciar Día
      </span>
    </button>
  );
} 