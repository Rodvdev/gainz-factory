"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Target,
  BookOpen,
  Star,
  Zap,
  CheckCircle,
  Trophy,
  ClipboardList,
  FileText,
  Calendar as CalendarIcon2,
  Clipboard,
  TrendingUp,
  Book,
  Ticket,
  Award,
  UserCheck,
  ShoppingCart,
  CreditCard,
  Edit,
  MessageSquare,
  Reply,
  Users
} from "lucide-react"
import { CalendarEventUnion, CalendarDay, EVENT_TYPE_CONFIG } from "@/types/calendar"

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

const getEventTypeIcon = (type: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'workout': Target,
    'cardio': Zap,
    'nutrition': BookOpen,
    'mindset': Star,
    'session': User,
    'meeting': Users,
    'habit': CheckCircle,
    'challenge': Trophy,
    'task': ClipboardList,
    'form': FileText,
    'programme': CalendarIcon2,
    'assignment': Clipboard,
    'progress': TrendingUp,
    'journal': Book,
    'goal': Target,
    'ticket': Ticket,
    'achievement': Award,
    'coach-assignment': UserCheck,
    'order': ShoppingCart,
    'subscription': CreditCard,
    'blog': Edit,
    'forum-topic': MessageSquare,
    'forum-reply': Reply
  }
  
  const IconComponent = iconMap[type.toLowerCase()] || Clock
  return <IconComponent className="w-4 h-4" />
}

const getEventTypeColor = (type: string) => {
  const config = EVENT_TYPE_CONFIG[type.toLowerCase()]
  if (!config) {
    return 'bg-gray-100 text-gray-600 border-gray-200'
  }
  
  return `${config.bgColor} ${config.color} ${config.borderColor}`
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEventUnion[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        
        const response = await fetch(`/api/user/calendar?year=${year}&month=${month}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setEvents(data.events || [])
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [currentDate])

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()
    
    const days: CalendarDay[] = []
    
    // Días del mes anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: []
      })
    }
    
    // Días del mes actual
    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = date.toDateString() === today.toDateString()
      
      // Filtrar eventos para este día
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startTime)
        return eventDate.toDateString() === date.toDateString()
      })
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: dayEvents
      })
    }
    
    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length // 6 semanas * 7 días
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: []
      })
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const calendarDays = generateCalendarDays()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Mi Calendario</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Plus className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`
                  min-h-[120px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-colors
                  ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
                  ${day.isToday ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
                  ${selectedDate?.toDateString() === day.date.toDateString() ? 'bg-red-50' : ''}
                `}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className={`
                  text-sm font-medium mb-2
                  ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${day.isToday ? 'text-red-600' : ''}
                `}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {day.events.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`
                        text-xs p-1 rounded border ${getEventTypeColor(event.type)}
                        truncate
                      `}
                      title={event.title}
                    >
                      <div className="flex items-center space-x-1">
                        {getEventTypeIcon(event.type)}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  
                  {day.events.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{day.events.length - 3} más
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Event Details Sidebar */}
        {selectedDate && (
          <div className="border-t border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Eventos del {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </h3>
            
            <div className="space-y-4">
              {calendarDays
                .find(day => day.date.toDateString() === selectedDate.toDateString())
                ?.events.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(event.startTime).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(event.endTime).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          
                          {'location' in event && event.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {'coach' in event && event.coach && (
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{event.coach}</span>
                            </div>
                          )}
                        </div>
                        
                        {'programmeTitle' in event && event.programmeTitle && (
                          <div className="text-sm text-blue-600 mt-1">
                            Programa: {event.programmeTitle}
                          </div>
                        )}

                        {/* Información específica según el tipo de evento */}
                        {event.type === 'habit' && 'habitCategory' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Categoría: {event.habitCategory.replace('_', ' ').toLowerCase()}
                          </div>
                        )}
                        
                        {event.type === 'challenge' && 'targetValue' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Progreso: {event.currentValue}/{event.targetValue}
                            {event.reward && ` • Recompensa: ${event.reward}`}
                          </div>
                        )}
                        
                        {event.type === 'task' && 'taskType' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Tipo: {event.taskType.replace('_', ' ').toLowerCase()}
                            {event.score && ` • Puntuación: ${event.score}`}
                          </div>
                        )}
                        
                        {event.type === 'progress' && 'metricType' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Métrica: {event.metricType.replace('_', ' ').toLowerCase()}
                          </div>
                        )}
                        
                        {event.type === 'achievement' && 'points' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Puntos: {event.points} • Rarity: {event.rarity}
                          </div>
                        )}
                        
                        {event.type === 'order' && 'total' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Total: ${event.total} • Estado: {event.paymentStatus}
                          </div>
                        )}
                        
                        {event.type === 'subscription' && 'planName' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Plan: {event.planName} • ${event.planPrice}/{event.billingCycle}
                          </div>
                        )}
                        
                        {event.type === 'blog' && 'views' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Vistas: {event.views} • Likes: {event.likes}
                          </div>
                        )}
                        
                        {event.type === 'forum-topic' && 'repliesCount' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Respuestas: {event.repliesCount} • Vistas: {event.views}
                          </div>
                        )}
                        
                        {event.type === 'coach-assignment' && 'coachName' in event && (
                          <div className="text-sm text-gray-500 mt-1">
                            Coach: {event.coachName} • {event.coachRole}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`
                          text-xs px-2 py-1 rounded-full
                          ${event.status === 'completed' ? 'bg-green-100 text-green-800' :
                            event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}
                        `}>
                          {event.status === 'completed' ? 'Completado' :
                           event.status === 'cancelled' ? 'Cancelado' : 'Programado'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              
              {calendarDays
                .find(day => day.date.toDateString() === selectedDate.toDateString())
                ?.events.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No tienes eventos programados para este día</p>
                  <button className="mt-2 text-red-600 hover:text-red-700 font-medium">
                    Agregar evento
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
