import { useState } from "react"
import { FormField } from "@/components/dashboard/CreateModal"

export type ModalType = 'habit' | 'challenge' | 'recipe' | 'exercise' | 'workout' | 'goal'

export interface ModalConfig {
  title: string
  description: string
  fields: FormField[]
  submitText: string
  icon: React.ReactNode
}

export function useCreateModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType | null>(null)
  const [loading, setLoading] = useState(false)

  const openModal = (type: ModalType) => {
    setModalType(type)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setModalType(null)
    setLoading(false)
  }

  const getModalConfig = (type: ModalType): ModalConfig => {
    switch (type) {
      case 'habit':
        return {
          title: "Crear Nuevo Hábito",
          description: "Agrega un nuevo hábito para mejorar tu rutina diaria",
          submitText: "Crear Hábito",
          icon: null, // Will be set by the component
          fields: [
            {
              name: 'name',
              label: 'Nombre del Hábito',
              type: 'text',
              placeholder: 'Ej: Ejercicio matutino',
              required: true,
              validation: (value) => typeof value === 'string' && value.length < 3 ? 'El nombre debe tener al menos 3 caracteres' : null
            },
            {
              name: 'description',
              label: 'Descripción',
              type: 'textarea',
              placeholder: 'Describe tu hábito...',
              required: false
            },
            {
              name: 'category',
              label: 'Categoría',
              type: 'select',
              required: true,
              options: [
                { value: 'MORNING_ROUTINE', label: 'Rutina Matutina' },
                { value: 'PHYSICAL_TRAINING', label: 'Entrenamiento Físico' },
                { value: 'NUTRITION', label: 'Nutrición' },
                { value: 'DEEP_WORK', label: 'Trabajo Profundo' },
                { value: 'PERSONAL_DEVELOPMENT', label: 'Desarrollo Personal' },
                { value: 'SOCIAL_CHARISMA', label: 'Carisma Social' },
                { value: 'REFLECTION', label: 'Reflexión' },
                { value: 'SLEEP_RECOVERY', label: 'Sueño y Recuperación' }
              ]
            },
            {
              name: 'frequency',
              label: 'Frecuencia',
              type: 'select',
              required: true,
              options: [
                { value: 'DAILY', label: 'Diario' },
                { value: 'WEEKLY', label: 'Semanal' },
                { value: 'MONTHLY', label: 'Mensual' }
              ]
            },
            {
              name: 'targetValue',
              label: 'Valor Objetivo',
              type: 'number',
              placeholder: '1',
              required: true,
              validation: (value) => value <= 0 ? 'El valor debe ser mayor a 0' : null
            },
            {
              name: 'points',
              label: 'Puntos',
              type: 'number',
              placeholder: '1',
              required: true,
              validation: (value) => value <= 0 ? 'Los puntos deben ser mayor a 0' : null
            }
          ]
        }

      case 'challenge':
        return {
          title: "Crear Nuevo Desafío",
          description: "Crea un desafío personalizado para motivarte",
          submitText: "Crear Desafío",
          icon: null,
          fields: [
            {
              name: 'name',
              label: 'Nombre del Desafío',
              type: 'text',
              placeholder: 'Ej: 30 días de ejercicio',
              required: true,
              validation: (value) => typeof value === 'string' && value.length < 3 ? 'El nombre debe tener al menos 3 caracteres' : null
            },
            {
              name: 'description',
              label: 'Descripción',
              type: 'textarea',
              placeholder: 'Describe tu desafío...',
              required: false
            },
            {
              name: 'targetValue',
              label: 'Valor Objetivo',
              type: 'number',
              placeholder: '30',
              required: true,
              validation: (value) => value <= 0 ? 'El valor debe ser mayor a 0' : null
            },
            {
              name: 'startDate',
              label: 'Fecha de Inicio',
              type: 'date',
              required: true
            },
            {
              name: 'endDate',
              label: 'Fecha de Fin',
              type: 'date',
              required: true
            },
            {
              name: 'reward',
              label: 'Recompensa',
              type: 'text',
              placeholder: 'Ej: Nueva rutina personalizada',
              required: false
            }
          ]
        }

      case 'recipe':
        return {
          title: "Crear Nueva Receta",
          description: "Agrega una receta saludable a tu colección",
          submitText: "Crear Receta",
          icon: null,
          fields: [
            {
              name: 'title',
              label: 'Título de la Receta',
              type: 'text',
              placeholder: 'Ej: Batido Proteico Post-Entreno',
              required: true,
              validation: (value) => typeof value === 'string' && value.length < 3 ? 'El título debe tener al menos 3 caracteres' : null
            },
            {
              name: 'description',
              label: 'Descripción',
              type: 'textarea',
              placeholder: 'Describe la receta...',
              required: true
            },
            {
              name: 'objective',
              label: 'Objetivo',
              type: 'select',
              required: true,
              options: [
                { value: 'muscle_gain', label: 'Ganancia Muscular' },
                { value: 'weight_loss', label: 'Pérdida de Peso' },
                { value: 'maintenance', label: 'Mantenimiento' },
                { value: 'endurance', label: 'Resistencia' }
              ]
            },
            {
              name: 'level',
              label: 'Nivel',
              type: 'select',
              required: true,
              options: [
                { value: 'BEGINNER', label: 'Principiante' },
                { value: 'INTERMEDIATE', label: 'Intermedio' },
                { value: 'ADVANCED', label: 'Avanzado' }
              ]
            },
            {
              name: 'isPremium',
              label: 'Contenido Premium',
              type: 'checkbox'
            }
          ]
        }

      case 'exercise':
        return {
          title: "Crear Nuevo Ejercicio",
          description: "Agrega un ejercicio a la base de datos",
          submitText: "Crear Ejercicio",
          icon: null,
          fields: [
            {
              name: 'name',
              label: 'Nombre del Ejercicio',
              type: 'text',
              placeholder: 'Ej: Press de Banca',
              required: true,
              validation: (value) => typeof value === 'string' && value.length < 3 ? 'El nombre debe tener al menos 3 caracteres' : null
            },
            {
              name: 'description',
              label: 'Descripción',
              type: 'textarea',
              placeholder: 'Describe el ejercicio...',
              required: true
            },
            {
              name: 'type',
              label: 'Tipo',
              type: 'select',
              required: true,
              options: [
                { value: 'STRENGTH', label: 'Fuerza' },
                { value: 'CARDIO', label: 'Cardio' },
                { value: 'MOBILITY', label: 'Movilidad' },
                { value: 'FLEXIBILITY', label: 'Flexibilidad' }
              ]
            },
            {
              name: 'intensity',
              label: 'Intensidad',
              type: 'select',
              required: true,
              options: [
                { value: 'LOW', label: 'Baja' },
                { value: 'MEDIUM', label: 'Media' },
                { value: 'HIGH', label: 'Alta' }
              ]
            },
            {
              name: 'level',
              label: 'Nivel',
              type: 'select',
              required: true,
              options: [
                { value: 'BEGINNER', label: 'Principiante' },
                { value: 'INTERMEDIATE', label: 'Intermedio' },
                { value: 'ADVANCED', label: 'Avanzado' }
              ]
            },
            {
              name: 'technique',
              label: 'Técnica',
              type: 'textarea',
              placeholder: 'Describe la técnica correcta...',
              required: false
            }
          ]
        }

      case 'workout':
        return {
          title: "Crear Nueva Rutina",
          description: "Crea una rutina de ejercicios personalizada",
          submitText: "Crear Rutina",
          icon: null,
          fields: [
            {
              name: 'title',
              label: 'Título de la Rutina',
              type: 'text',
              placeholder: 'Ej: Rutina de Fuerza Superior',
              required: true,
              validation: (value) => typeof value === 'string' && value.length < 3 ? 'El título debe tener al menos 3 caracteres' : null
            },
            {
              name: 'objective',
              label: 'Objetivo',
              type: 'textarea',
              placeholder: 'Describe el objetivo de la rutina...',
              required: false
            },
            {
              name: 'level',
              label: 'Nivel',
              type: 'select',
              required: true,
              options: [
                { value: 'BEGINNER', label: 'Principiante' },
                { value: 'INTERMEDIATE', label: 'Intermedio' },
                { value: 'ADVANCED', label: 'Avanzado' }
              ]
            },
            {
              name: 'duration',
              label: 'Duración (minutos)',
              type: 'number',
              placeholder: '60',
              required: false,
              validation: (value) => value && value <= 0 ? 'La duración debe ser mayor a 0' : null
            },
            {
              name: 'isPublic',
              label: 'Rutina Pública',
              type: 'checkbox'
            }
          ]
        }

      case 'goal':
        return {
          title: "Crear Nueva Meta",
          description: "Establece una meta personal para tu transformación",
          submitText: "Crear Meta",
          icon: null,
          fields: [
            {
              name: 'goal',
              label: 'Descripción de la Meta',
              type: 'text',
              placeholder: 'Ej: Ganar 5kg de músculo',
              required: true,
              validation: (value) => typeof value === 'string' && value.length < 3 ? 'La meta debe tener al menos 3 caracteres' : null
            },
            {
              name: 'targetDate',
              label: 'Fecha Objetivo',
              type: 'date',
              required: false
            }
          ]
        }

      default:
        return {
          title: "Crear Nuevo Elemento",
          description: "Agrega un nuevo elemento",
          submitText: "Crear",
          icon: null,
          fields: []
        }
    }
  }

  return {
    isOpen,
    modalType,
    loading,
    openModal,
    closeModal,
    setLoading,
    getModalConfig: modalType ? getModalConfig(modalType) : null
  }
}