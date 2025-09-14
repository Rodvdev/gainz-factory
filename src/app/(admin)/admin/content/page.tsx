"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Crown,
  BookOpen,
  Video,
  File,
  Headphones
} from "lucide-react"

interface MediaContent {
  id: string
  title: string
  type: string
  url: string
  topic: string
  module?: string
  episode?: number
  isPremium: boolean
  createdAt: string
}

export default function ContentPage() {
  const [content, setContent] = useState<MediaContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [topicFilter, setTopicFilter] = useState<string>("ALL")
  const [premiumFilter, setPremiumFilter] = useState<"ALL" | "PREMIUM" | "FREE">("ALL")
  const [selectedContent, setSelectedContent] = useState<MediaContent | null>(null)
  const [showContentModal, setShowContentModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const contentTypes = [
    { value: "video", label: "Video", icon: Video },
    { value: "pdf", label: "PDF", icon: File },
    { value: "ebook", label: "eBook", icon: BookOpen },
    { value: "audio", label: "Audio", icon: Headphones }
  ]

  const topics = [
    "Mindset",
    "Nutrición",
    "Espiritualidad",
    "Ejercicios",
    "Hábitos",
    "Motivación",
    "Técnicas"
  ]

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("/api/admin/content", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setContent(data.content || [])
        }
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const filteredContent = content.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.module?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "ALL" || item.type === typeFilter
    const matchesTopic = topicFilter === "ALL" || item.topic === topicFilter
    const matchesPremium = premiumFilter === "ALL" || 
      (premiumFilter === "PREMIUM" && item.isPremium) ||
      (premiumFilter === "FREE" && !item.isPremium)
    
    return matchesSearch && matchesType && matchesTopic && matchesPremium
  })

  const handleCreateContent = () => {
    setSelectedContent(null)
    setIsEditing(false)
    setShowContentModal(true)
  }

  const handleEditContent = (item: MediaContent) => {
    setSelectedContent(item)
    setIsEditing(true)
    setShowContentModal(true)
  }

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este contenido?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setContent(content.filter(c => c.id !== contentId))
      }
    } catch (error) {
      console.error("Error deleting content:", error)
    }
  }

  const handleTogglePremium = async (contentId: string, currentPremium: boolean) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/content/${contentId}/toggle-premium`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isPremium: !currentPremium })
      })

      if (response.ok) {
        setContent(content.map(item => 
          item.id === contentId ? { ...item, isPremium: !currentPremium } : item
        ))
      }
    } catch (error) {
      console.error("Error toggling premium status:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = contentTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.icon : FileText
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-800"
      case "pdf":
        return "bg-blue-100 text-blue-800"
      case "ebook":
        return "bg-green-100 text-green-800"
      case "audio":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTopicBadgeColor = (topic: string) => {
    switch (topic) {
      case "Mindset":
        return "bg-purple-100 text-purple-800"
      case "Nutrición":
        return "bg-green-100 text-green-800"
      case "Espiritualidad":
        return "bg-indigo-100 text-indigo-800"
      case "Ejercicios":
        return "bg-red-100 text-red-800"
      case "Hábitos":
        return "bg-orange-100 text-orange-800"
      case "Motivación":
        return "bg-yellow-100 text-yellow-800"
      case "Técnicas":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
          <p className="text-gray-600 mt-2">Administra videos, PDFs, eBooks y contenido multimedia</p>
        </div>
        <button 
          onClick={handleCreateContent}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Contenido</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contenido</p>
              <p className="text-2xl font-bold text-gray-900">{content.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Video className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(c => c.type === "video").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Crown className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Premium</p>
            <p className="text-2xl font-bold text-gray-900">
              {content.filter(c => c.isPremium).length}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mindset</p>
              <p className="text-2xl font-bold text-gray-900">
                {content.filter(c => c.topic === "Mindset").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Título, tema, módulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todos los tipos</option>
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todos los temas</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={premiumFilter}
              onChange={(e) => setPremiumFilter(e.target.value as "ALL" | "PREMIUM" | "FREE")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todos</option>
              <option value="PREMIUM">Premium</option>
              <option value="FREE">Gratuitos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => {
          const TypeIcon = getTypeIcon(item.type)
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Content Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <TypeIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      {item.module && (
                        <p className="text-sm text-gray-500">
                          {item.module} {item.episode && `- Episodio ${item.episode}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditContent(item)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(item.type)}`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTopicBadgeColor(item.topic)}`}>
                    {item.topic}
                  </span>
                  {item.isPremium && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      <Crown className="w-3 h-3 mr-1" />
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>

              {/* Content Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('es-ES')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePremium(item.id, item.isPremium)}
                      className={`text-xs px-2 py-1 rounded ${
                        item.isPremium 
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {item.isPremium ? "Quitar Premium" : "Hacer Premium"}
                    </button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Content Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditing ? "Editar Contenido" : "Nuevo Contenido"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedContent?.title || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      defaultValue={selectedContent?.type || "video"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {contentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tema
                    </label>
                    <select
                      defaultValue={selectedContent?.topic || "Mindset"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {topics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Módulo
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedContent?.module || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Ej: Mindset 101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Episodio
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedContent?.episode || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del Contenido
                  </label>
                  <input
                    type="url"
                    defaultValue={selectedContent?.url || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPremium"
                    defaultChecked={selectedContent?.isPremium || false}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-900">
                    Contenido Premium
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowContentModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                  {isEditing ? "Actualizar" : "Crear"} Contenido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
