"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  FileText,
  CheckCircle,
  X,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { ContentCategory, InputType } from "@prisma/client"

interface InputField {
  id?: string
  name: string
  label: string
  type: InputType
  placeholder?: string
  helpText?: string
  isRequired: boolean
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
  pattern?: string
  options?: string[] | null
  order: number
  width?: string
}

interface Form {
  id: string
  title: string
  description?: string
  category?: ContentCategory
  isActive: boolean
  isRequired: boolean
  createdAt: string
  fields: InputField[]
  _count: {
    submissions: number
  }
}

const INPUT_TYPE_LABELS = {
  TEXT: "Texto",
  TEXTAREA: "Área de texto",
  NUMBER: "Número",
  EMAIL: "Email",
  PASSWORD: "Contraseña",
  DATE: "Fecha",
  TIME: "Hora",
  SELECT: "Lista desplegable",
  MULTISELECT: "Selección múltiple",
  RADIO: "Botones de radio",
  CHECKBOX: "Casillas de verificación",
  FILE: "Archivo",
  RATING: "Calificación",
  SLIDER: "Control deslizante",
  URL: "URL",
  PHONE: "Teléfono",
  COLOR: "Color"
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<ContentCategory | "ALL">("ALL")
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "EXERCISE" as ContentCategory,
    isRequired: false,
    fields: [] as InputField[]
  })

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("/api/admin/forms", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setForms(data.forms || [])
        }
      } catch (error) {
        console.error("Error fetching forms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "ALL" || form.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const handleCreateForm = () => {
    setSelectedForm(null)
    setIsEditing(false)
    setFormData({
      title: "",
      description: "",
      category: "EXERCISE",
      isRequired: false,
      fields: []
    })
    setShowFormModal(true)
  }

  const handleEditForm = (form: Form) => {
    setSelectedForm(form)
    setIsEditing(true)
    setFormData({
      title: form.title,
      description: form.description || "",
      category: form.category || "EXERCISE",
      isRequired: form.isRequired,
      fields: form.fields.map(field => ({
        ...field,
        options: field.options || null
      }))
    })
    setShowFormModal(true)
  }

  const handleSubmitForm = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const url = isEditing 
        ? `/api/admin/forms/${selectedForm?.id}`
        : "/api/admin/forms"
      
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
        setShowFormModal(false)
        // Refrescar la lista
        window.location.reload()
      } else {
        console.error("Error saving form")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDeleteForm = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este formulario?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/forms/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setForms(forms.filter(f => f.id !== id))
      }
    } catch (error) {
      console.error("Error deleting form:", error)
    }
  }

  const addField = () => {
    const newField: InputField = {
      name: `field_${formData.fields.length + 1}`,
      label: `Campo ${formData.fields.length + 1}`,
      type: "TEXT",
      isRequired: false,
      order: formData.fields.length
    }
    setFormData({
      ...formData,
      fields: [...formData.fields, newField]
    })
  }

  const updateField = (index: number, field: Partial<InputField>) => {
    const updatedFields = [...formData.fields]
    updatedFields[index] = { ...updatedFields[index], ...field }
    setFormData({ ...formData, fields: updatedFields })
  }

  const removeField = (index: number) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index)
    // Reordenar los índices
    updatedFields.forEach((field, i) => {
      field.order = i
    })
    setFormData({ ...formData, fields: updatedFields })
  }

  const moveField = (index: number, direction: 'up' | 'down') => {
    const updatedFields = [...formData.fields]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < updatedFields.length) {
      [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]]
      // Actualizar el orden
      updatedFields.forEach((field, i) => {
        field.order = i
      })
      setFormData({ ...formData, fields: updatedFields })
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Formularios</h1>
          <p className="text-gray-600 mt-2">Crea y administra formularios dinámicos</p>
        </div>
        <button 
          onClick={handleCreateForm}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Formulario</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ClipboardList className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Formularios</p>
              <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Campos Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {forms.reduce((acc, form) => acc + form.fields.length, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {forms.filter(f => f.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Envíos</p>
              <p className="text-2xl font-bold text-gray-900">
                {forms.reduce((acc, form) => acc + form._count.submissions, 0)}
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
                placeholder="Buscar formularios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ContentCategory | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="ALL">Todas las categorías</option>
              <option value="EXERCISE">Ejercicios</option>
              <option value="ROUTINE">Rutinas</option>
              <option value="DIET">Dieta</option>
              <option value="MINDSET">Mindset</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {form.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {form.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {form.isActive && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  )}
                  {form.isRequired && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Requerido
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {form.fields.length} campos
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {form._count.submissions} envíos
                </div>
                {form.category && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {form.category}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditForm(form)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteForm(form.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Editar Formulario" : "Nuevo Formulario"}
                </h2>
                <button
                  onClick={() => setShowFormModal(false)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as ContentCategory})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="EXERCISE">Ejercicios</option>
                    <option value="ROUTINE">Rutinas</option>
                    <option value="DIET">Dieta</option>
                    <option value="MINDSET">Mindset</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({...formData, isRequired: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">
                    Formulario requerido
                  </label>
                </div>
              </div>
              
              {/* Fields */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Campos del Formulario</h3>
                  <button
                    onClick={addField}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Agregar Campo
                  </button>
                </div>
                
                {formData.fields.map((field, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Campo {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveField(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveField(index, 'down')}
                          disabled={index === formData.fields.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeField(index)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Campo</label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateField(index, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(index, { type: e.target.value as InputType })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          {Object.entries(INPUT_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                        <input
                          type="text"
                          value={field.placeholder || ""}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ancho</label>
                        <select
                          value={field.width || "100%"}
                          onChange={(e) => updateField(index, { width: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="100%">100%</option>
                          <option value="50%">50%</option>
                          <option value="33%">33%</option>
                          <option value="25%">25%</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Texto de ayuda</label>
                      <input
                        type="text"
                        value={field.helpText || ""}
                        onChange={(e) => updateField(index, { helpText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Validation Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          checked={field.isRequired}
                          onChange={(e) => updateField(index, { isRequired: e.target.checked })}
                          className="mr-2"
                        />
                        <label htmlFor={`required-${index}`} className="text-sm font-medium text-gray-700">
                          Campo requerido
                        </label>
                      </div>
                    </div>
                    
                    {/* Conditional validation fields */}
                    {['TEXT', 'TEXTAREA', 'EMAIL'].includes(field.type) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Longitud mínima</label>
                          <input
                            type="number"
                            value={field.minLength || ""}
                            onChange={(e) => updateField(index, { minLength: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Longitud máxima</label>
                          <input
                            type="number"
                            value={field.maxLength || ""}
                            onChange={(e) => updateField(index, { maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    
                    {field.type === 'NUMBER' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Valor mínimo</label>
                          <input
                            type="number"
                            value={field.minValue || ""}
                            onChange={(e) => updateField(index, { minValue: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Valor máximo</label>
                          <input
                            type="number"
                            value={field.maxValue || ""}
                            onChange={(e) => updateField(index, { maxValue: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Options for select fields */}
                    {['SELECT', 'MULTISELECT', 'RADIO', 'CHECKBOX'].includes(field.type) && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opciones (una por línea)
                        </label>
                        <textarea
                          value={Array.isArray(field.options) ? field.options.join('\n') : ''}
                          onChange={(e) => {
                            const options = e.target.value.split('\n').filter(opt => opt.trim())
                            updateField(index, { options: options.length > 0 ? options : null })
                          }}
                          rows={3}
                          placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowFormModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitForm}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                {isEditing ? "Actualizar" : "Crear"} Formulario
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
