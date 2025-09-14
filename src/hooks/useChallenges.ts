import { useState, useEffect, useCallback } from 'react'
import { HabitCategory } from '@prisma/client'

export interface Challenge {
  id: string
  userId: string
  name: string
  description?: string
  category?: HabitCategory
  startDate: string
  endDate: string
  targetValue: number
  currentValue: number
  isCompleted: boolean
  reward?: string
}

interface UseChallengesReturn {
  challenges: Challenge[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createChallenge: (data: CreateChallengeData) => Promise<void>
  updateChallengeProgress: (challengeId: string, progress: number) => Promise<void>
  deleteChallenge: (challengeId: string) => Promise<void>
}

export interface CreateChallengeData {
  name: string
  description?: string
  category?: HabitCategory
  targetValue: number
  startDate: string
  endDate: string
  reward?: string
}

export function useChallenges(filter: 'all' | 'active' | 'completed' = 'all'): UseChallengesReturn {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`/api/challenges?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar los desafíos')
      }

      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [filter])

  const createChallenge = async (data: CreateChallengeData) => {
    try {
      setError(null)
      
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el desafío')
      }

      // Refresh challenges list
      await fetchChallenges()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    try {
      setError(null)
      
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentValue: progress })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar el progreso')
      }

      // Refresh challenges list
      await fetchChallenges()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  const deleteChallenge = async (challengeId: string) => {
    try {
      setError(null)
      
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el desafío')
      }

      // Refresh challenges list
      await fetchChallenges()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [fetchChallenges])

  return {
    challenges,
    loading,
    error,
    refetch: fetchChallenges,
    createChallenge,
    updateChallengeProgress,
    deleteChallenge
  }
}
