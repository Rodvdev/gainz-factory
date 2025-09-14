"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Clock,
  DollarSign,
  UserCheck,
  Calendar,
  X,
  Save
} from "lucide-react"
import { TeamRole } from "@prisma/client"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  profileImageUrl?: string
}

interface Schedule {
  id?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface TeamMember {
  id: string
  role: TeamRole
  specialty: string[]
  bio?: string
  experience: number
  rating: number
  hourlyRate?: number
  isActive: boolean
  isAvailable: boolean
  user: User
  schedules: Schedule[]
  _count: {
    clientAssignments: number
    calendarEvents: number
  }
}

const TEAM_ROLE_LABELS = {
  TRAINER: "Entrenador",
  NUTRITIONIST: "Nutricionista",
  YOGA_INSTRUCTOR: "Instructor de Yoga",
  LIFE_COACH: "Life Coach",
  CONTENT_CREATOR: "Creador de Contenido"
}

const WEEKDAYS = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<TeamRole | "ALL">("ALL")
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    userId: "",
    role: "TRAINER" as TeamRole,
    specialty: [] as string[],
    bio: "",
    experience: 0,
    hourlyRate: 0,
    schedules: [] as Schedule[]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      
      // Fetch team members
      const teamResponse = await fetch("/api/admin/team", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      // Fetch available users
      const usersResponse = await fetch("/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (teamResponse.ok) {
        const teamData = await teamResponse.json()
        setTeamMembers(teamData.teamMembers || [])
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === "ALL" || member.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const handleCreateMember = () => {
    setSelectedMember(null)
    setIsEditing(false)
    setFormData({
      userId: "",
      role: "TRAINER",
      specialty: [],
      bio: "",
      experience: 0,
      hourlyRate: 0,
      schedules: []
    })
    setShowMemberModal(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member)
    setIsEditing(true)
    setFormData({
      userId: member.user.id,
      role: member.role,
      specialty: member.specialty,
      bio: member.bio || "",
      experience: member.experience,
      hourlyRate: member.hourlyRate || 0,
      schedules: member.schedules.map(s => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: s.isAvailable
      }))
    })
    setShowMemberModal(true)
  }

  const handleSubmitMember = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const url = isEditing 
        ? `/api/admin/team/${selectedMember?.id}`
        : "/api/admin/team"
      
      const method = isEditing ? "PATCH" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowMemberModal(false)
        fetchData() // Refresh data
      } else {
        console.error("Error saving team member")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este miembro del equipo?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setTeamMembers(teamMembers.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error("Error deleting team member:", error)
    }
  }

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedules: [
        ...formData.schedules,
        {
          dayOfWeek: 0,
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true
        }
      ]
    })
  }

  const removeSchedule = (index: number) => {
    const updatedSchedules = formData.schedules.filter((_, i) => i !== index)
    setFormData({ ...formData, schedules: updatedSchedules })
  }

  const updateSchedule = (index: number, field: keyof Schedule, value: string | number | boolean) => {
    const updatedSchedules = [...formData.schedules]
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value }
    setFormData({ ...formData, schedules: updatedSchedules })
  }

  const addSpecialty = () => {
    const specialty = prompt("Agregar especialidad:")
    if (specialty && specialty.trim()) {
      setFormData({
        ...formData,
        specialty: [...formData.specialty, specialty.trim()]
      })
    }
  }

  const removeSpecialty = (index: number) => {
    const updatedSpecialty = formData.specialty.filter((_, i) => i !== index)
    setFormData({ ...formData, specialty: updatedSpecialty })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipos</h1>
          <p className="text-gray-600 mt-2">Administra coaches y especialistas</p>
        </div>
        <button 
          onClick={handleCreateMember}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Miembro</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Users2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Miembros</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(teamMembers.reduce((acc, m) => acc + m.rating, 0) / teamMembers.length || 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar miembros del equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as TeamRole | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="ALL">Todos los roles</option>
              {Object.entries(TEAM_ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    {member.user.profileImageUrl ? (
                      <img 
                        src={member.user.profileImageUrl} 
                        alt={`${member.user.firstName} ${member.user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-red-600 font-semibold">
                        {member.user.firstName[0]}{member.user.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {member.user.firstName} {member.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {member.isActive && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  )}
                  {member.isAvailable && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Disponible
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {TEAM_ROLE_LABELS[member.role]}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{member.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {member.experience} años
                  </div>
                  {member.hourlyRate && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${member.hourlyRate}/h
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Especialidades:</strong> {member.specialty.join(", ")}
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>Clientes:</strong> {member._count.clientAssignments} | 
                  <strong> Eventos:</strong> {member._count.calendarEvents}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditMember(member)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Editar Miembro del Equipo" : "Nuevo Miembro del Equipo"}
                </h2>
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    disabled={isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar usuario</option>
                    {users
                      .filter(user => !teamMembers.some(member => member.user.id === user.id))
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as TeamRole})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {Object.entries(TEAM_ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia (años)</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarifa por Hora ($)</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.specialty.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {spec}
                      <button
                        onClick={() => removeSpecialty(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={addSpecialty}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Agregar especialidad
                </button>
              </div>
              
              {/* Schedules */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Horarios de Disponibilidad</h3>
                  <button
                    onClick={addSchedule}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Agregar Horario
                  </button>
                </div>
                
                {formData.schedules.map((schedule, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Día</label>
                        <select
                          value={schedule.dayOfWeek}
                          onChange={(e) => updateSchedule(index, 'dayOfWeek', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          {WEEKDAYS.map((day, dayIndex) => (
                            <option key={dayIndex} value={dayIndex}>{day}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hora Inicio</label>
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hora Fin</label>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeSchedule(index)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowMemberModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitMember}
                disabled={!formData.userId}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Actualizar" : "Crear"} Miembro</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
