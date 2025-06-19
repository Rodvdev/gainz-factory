import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { RESET_TODAY_PROGRESS, GET_MY_HABITS, GET_TODAY_SCORE } from '@/lib/graphql/growth/client-queries';

interface DailyResetOptions {
  resetHour?: number; // Hora del día para resetear (0-23), default: 0 (medianoche)
  onReset?: () => void; // Callback cuando se resetea
  enabled?: boolean; // Si está habilitado el auto-reset
  useGraphQLReset?: boolean; // Si usar la mutación GraphQL para resetear
}

export function useDailyReset(options: DailyResetOptions = {}) {
  const { resetHour = 0, onReset, enabled = true, useGraphQLReset = false } = options;
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);
  const [isNewDay, setIsNewDay] = useState(false);

  const [resetProgressMutation] = useMutation(RESET_TODAY_PROGRESS, {
    refetchQueries: [GET_MY_HABITS, GET_TODAY_SCORE],
  });

  useEffect(() => {
    if (!enabled) return;

    // Obtener la fecha del último reset del localStorage
    const storedLastReset = localStorage.getItem('lastHabitReset');
    setLastResetDate(storedLastReset);

    const checkForNewDay = async () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Si es una nueva fecha y ya pasó la hora de reset
      if (storedLastReset !== today && now.getHours() >= resetHour) {
        setIsNewDay(true);
        
        // Guardar la nueva fecha de reset
        localStorage.setItem('lastHabitReset', today);
        setLastResetDate(today);
        
        // Usar GraphQL reset si está habilitado
        if (useGraphQLReset) {
          try {
            await resetProgressMutation();
            console.log(`🔄 Nuevo día detectado: ${today} - Progreso reiniciado automáticamente via GraphQL`);
          } catch (error) {
            console.error('Error al resetear via GraphQL:', error);
          }
        }
        
        // Llamar al callback si existe
        onReset?.();
        
        if (!useGraphQLReset) {
          console.log(`🔄 Nuevo día detectado: ${today} - Progreso reiniciado automáticamente`);
        }
      }
    };

    // Verificar inmediatamente
    checkForNewDay();

    // Verificar cada minuto
    const interval = setInterval(checkForNewDay, 60 * 1000);

    return () => clearInterval(interval);
  }, [resetHour, onReset, enabled, useGraphQLReset, resetProgressMutation]);

  // Función para resetear manualmente
  const manualReset = async () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastHabitReset', today);
    setLastResetDate(today);
    setIsNewDay(true);
    
    if (useGraphQLReset) {
      try {
        await resetProgressMutation();
        console.log('🔄 Reset manual ejecutado via GraphQL');
      } catch (error) {
        console.error('Error al resetear manualmente via GraphQL:', error);
        throw error;
      }
    }
    
    onReset?.();
  };

  // Función para verificar si es un nuevo día
  const checkIsNewDay = () => {
    const today = new Date().toISOString().split('T')[0];
    return lastResetDate !== today;
  };

  return {
    isNewDay,
    lastResetDate,
    manualReset,
    checkIsNewDay,
  };
}

// Hook simplificado para solo mostrar indicador de nuevo día
export function useNewDayIndicator() {
  const [isNewDay, setIsNewDay] = useState(false);

  useEffect(() => {
    const checkNewDay = () => {
      const lastVisit = localStorage.getItem('lastVisitDate');
      const today = new Date().toISOString().split('T')[0];
      
      if (lastVisit !== today) {
        setIsNewDay(true);
        localStorage.setItem('lastVisitDate', today);
      }
    };

    checkNewDay();
    
    // Verificar cada hora
    const interval = setInterval(checkNewDay, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { isNewDay, markAsViewed: () => setIsNewDay(false) };
}

// Hook específico para Gainz Factory con configuración optimizada
export function useGainzFactoryReset() {
  return useDailyReset({
    resetHour: 0, // Medianoche
    useGraphQLReset: true, // Usar GraphQL para consistencia
    enabled: true,
    onReset: () => {
      console.log('🎯 Gainz Factory - Nuevo día iniciado!');
    }
  });
} 