"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PlusIcon,
  FolderIcon,
  ChatBubbleOvalLeftIcon,
  LockClosedIcon,
  MapPinIcon
} from "@heroicons/react/24/outline"
import CreateModal, { FormField } from "@/components/dashboard/CreateModal"
import { Forum, ForumTopic, ForumReply, CreateForumData, CreateTopicData, CreateReplyData } from "@/types/forum"

export default function AdminForumPage() {
  const [forums, setForums] = useState<Forum[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedForum, setSelectedForum] = useState("all")
  const [activeTab, setActiveTab] = useState<"forums" | "topics" | "replies">("forums")
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Forum | ForumTopic | ForumReply | null>(null)
  const [modalType, setModalType] = useState<"forum" | "topic" | "reply">("forum")
  const [loadingAction, setLoadingAction] = useState(false)

  useEffect(() => {
    fetchForumData()
  }, [])

  const fetchForumData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      const [forumsResponse, topicsResponse, repliesResponse] = await Promise.all([
        fetch("/api/admin/forums", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("/api/admin/forum-topics", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("/api/admin/forum-replies", {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ])

      if (forumsResponse.ok) {
        const forumsData = await forumsResponse.json()
        setForums(forumsData)
      }

      if (topicsResponse.ok) {
        const topicsData = await topicsResponse.json()
        setTopics(topicsData)
      }

      if (repliesResponse.ok) {
        const repliesData = await repliesResponse.json()
        setReplies(repliesData)
      }
    } catch (error) {
      console.error("Error fetching forum data:", error)
    } finally {
      setLoading(false)
    }
  }

  // CRUD Operations
  const handleCreate = async (data: Record<string, string | number | boolean | File | null>) => {
    setLoadingAction(true)
    try {
      const token = localStorage.getItem("authToken")
      let response: Response

      switch (modalType) {
        case "forum":
          response = await fetch("/api/admin/forums", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data as unknown as CreateForumData)
          })
          break
        case "topic":
          response = await fetch("/api/admin/forum-topics", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data as unknown as CreateTopicData)
          })
          break
        case "reply":
          response = await fetch("/api/admin/forum-replies", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data as unknown as CreateReplyData)
          })
          break
        default:
          throw new Error("Invalid modal type")
      }

      if (response.ok) {
        await fetchForumData()
        setIsCreateModalOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || "Error al crear el elemento")
      }
    } catch (error) {
      console.error("Error creating item:", error)
      alert("Error al crear el elemento")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleEdit = async (data: Record<string, string | number | boolean | File | null>) => {
    if (!editingItem) return

    setLoadingAction(true)
    try {
      const token = localStorage.getItem("authToken")
      let response: Response

      switch (modalType) {
        case "forum":
          response = await fetch(`/api/admin/forums/${editingItem.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
          })
          break
        case "topic":
          response = await fetch(`/api/admin/forum-topics/${editingItem.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
          })
          break
        case "reply":
          response = await fetch(`/api/admin/forum-replies/${editingItem.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
          })
          break
        default:
          throw new Error("Invalid modal type")
      }

      if (response.ok) {
        await fetchForumData()
        setIsEditModalOpen(false)
        setEditingItem(null)
      } else {
        const error = await response.json()
        alert(error.error || "Error al actualizar el elemento")
      }
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Error al actualizar el elemento")
    } finally {
      setLoadingAction(false)
    }
  }

  const handleDelete = async (id: string, type: "forum" | "topic" | "reply") => {
    if (!confirm("¿Estás seguro de que quieres eliminar este elemento?")) return

    try {
      const token = localStorage.getItem("authToken")
      let response: Response

      switch (type) {
        case "forum":
          response = await fetch(`/api/admin/forums/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          })
          break
        case "topic":
          response = await fetch(`/api/admin/forum-topics/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          })
          break
        case "reply":
          response = await fetch(`/api/admin/forum-replies/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          })
          break
        default:
          throw new Error("Invalid type")
      }

      if (response.ok) {
        await fetchForumData()
      } else {
        const error = await response.json()
        alert(error.error || "Error al eliminar el elemento")
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Error al eliminar el elemento")
    }
  }

  const openCreateModal = (type: "forum" | "topic" | "reply") => {
    setModalType(type)
    setIsCreateModalOpen(true)
  }

  const openEditModal = (item: Forum | ForumTopic | ForumReply, type: "forum" | "topic" | "reply") => {
    setEditingItem(item)
    setModalType(type)
    setIsEditModalOpen(true)
  }

  // Form field configurations
  const getForumFields = (): FormField[] => [
    {
      name: "name",
      label: "Nombre del Foro",
      type: "text",
      placeholder: "Ej: Entrenamiento General",
      required: true
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      placeholder: "Descripción del foro..."
    },
    {
      name: "icon",
      label: "Icono",
      type: "text",
      placeholder: "Ej: 💪"
    },
    {
      name: "color",
      label: "Color",
      type: "text",
      placeholder: "#3B82F6"
    },
    {
      name: "isActive",
      label: "Activo",
      type: "checkbox"
    },
    {
      name: "order",
      label: "Orden",
      type: "number",
      placeholder: "0"
    }
  ]

  const getTopicFields = (): FormField[] => [
    {
      name: "title",
      label: "Título del Tema",
      type: "text",
      placeholder: "Ej: ¿Cuál es la mejor rutina para principiantes?",
      required: true
    },
    {
      name: "content",
      label: "Contenido",
      type: "textarea",
      placeholder: "Contenido del tema...",
      required: true
    },
    {
      name: "forumId",
      label: "Foro",
      type: "select",
      required: true,
      options: forums.map(forum => ({
        value: forum.id,
        label: forum.name
      }))
    },
    {
      name: "isPinned",
      label: "Fijado",
      type: "checkbox"
    },
    {
      name: "isLocked",
      label: "Bloqueado",
      type: "checkbox"
    },
    {
      name: "isActive",
      label: "Activo",
      type: "checkbox"
    }
  ]

  const getReplyFields = (): FormField[] => [
    {
      name: "content",
      label: "Contenido de la Respuesta",
      type: "textarea",
      placeholder: "Escribe tu respuesta...",
      required: true
    },
    {
      name: "topicId",
      label: "Tema",
      type: "select",
      required: true,
      options: topics.map(topic => ({
        value: topic.id,
        label: topic.title
      }))
    },
    {
      name: "isSolution",
      label: "Es Solución",
      type: "checkbox"
    }
  ]

  // Filter data based on search and selected forum
  const filteredForums = forums.filter(forum => 
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (forum.description && forum.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesForum = selectedForum === "all" || topic.forumId === selectedForum
    return matchesSearch && matchesForum
  })

  const filteredReplies = replies.filter(reply => 
    reply.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión del Foro</h1>
          <p className="text-gray-600 mt-2">Administra foros, temas y respuestas de la comunidad</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openCreateModal("forum")}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Nuevo Foro
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          {[
            { id: "forums", label: "Foros", icon: FolderIcon, count: forums.length },
            { id: "topics", label: "Temas", icon: ChatBubbleLeftRightIcon, count: topics.length },
            { id: "replies", label: "Respuestas", icon: ChatBubbleOvalLeftIcon, count: replies.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "forums" | "topics" | "replies")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          {activeTab === "topics" && (
            <div className="flex gap-2">
              <select
                value={selectedForum}
                onChange={(e) => setSelectedForum(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Todos los foros</option>
                {forums.map(forum => (
                  <option key={forum.id} value={forum.id}>
                    {forum.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === "forums" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Foros</h2>
            <button
              onClick={() => openCreateModal("forum")}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Nuevo Foro
            </button>
          </div>
          {filteredForums.map((forum, index) => (
            <motion.div
              key={forum.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {forum.icon && <span className="text-2xl">{forum.icon}</span>}
                    <h3 className="text-lg font-semibold text-gray-900">{forum.name}</h3>
                    {!forum.isActive && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>
                  {forum.description && (
                    <p className="text-gray-600 mb-4">{forum.description}</p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      <span>{forum._count?.topics || 0} temas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Creado {new Date(forum.createdAt).toLocaleDateString()}</span>
                    </div>
                    {forum.color && (
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: forum.color }}
                        />
                        <span>Color</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(forum, "forum")}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar foro"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(forum.id, "forum")}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar foro"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "topics" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Temas</h2>
            <button
              onClick={() => openCreateModal("topic")}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Nuevo Tema
            </button>
          </div>
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {topic.isPinned && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        Fijado
                      </span>
                    )}
                    {topic.isLocked && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                        <LockClosedIcon className="h-3 w-3" />
                        Bloqueado
                      </span>
                    )}
                    {!topic.isActive && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {topic.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {topic.content}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{topic.author?.firstName} {topic.author?.lastName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{topic.views} vistas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      <span>{topic._count?.replies || 0} respuestas</span>
                    </div>
                    {topic.forum && (
                      <div className="flex items-center gap-1">
                        <FolderIcon className="h-4 w-4" />
                        <span>{topic.forum.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(topic, "topic")}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar tema"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(topic.id, "topic")}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar tema"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "replies" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Respuestas</h2>
            <button
              onClick={() => openCreateModal("reply")}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Nueva Respuesta
            </button>
          </div>
          {filteredReplies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {reply.isSolution && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full flex items-center gap-1">
                        <CheckCircleIcon className="h-3 w-3" />
                        Solución
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-900 mb-4">{reply.content}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{reply.author?.firstName} {reply.author?.lastName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    {reply.topic && (
                      <div className="flex items-center gap-1">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        <span>{reply.topic.title}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(reply, "reply")}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar respuesta"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reply.id, "reply")}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar respuesta"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty States */}
      {((activeTab === "forums" && filteredForums.length === 0) ||
        (activeTab === "topics" && filteredTopics.length === 0) ||
        (activeTab === "replies" && filteredReplies.length === 0)) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === "forums" && <FolderIcon className="w-8 h-8 text-gray-400" />}
            {activeTab === "topics" && <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />}
            {activeTab === "replies" && <ChatBubbleOvalLeftIcon className="w-8 h-8 text-gray-400" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === "forums" && "No hay foros"}
            {activeTab === "topics" && "No hay temas"}
            {activeTab === "replies" && "No hay respuestas"}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? "No se encontraron elementos que coincidan con tu búsqueda." : 
             `No hay ${activeTab} aún.`}
          </p>
        </div>
      )}

      {/* Create Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        title={`Crear ${modalType === "forum" ? "Foro" : modalType === "topic" ? "Tema" : "Respuesta"}`}
        description={`Crea un nuevo ${modalType === "forum" ? "foro" : modalType === "topic" ? "tema" : "respuesta"} para la comunidad`}
        fields={
          modalType === "forum" ? getForumFields() :
          modalType === "topic" ? getTopicFields() :
          getReplyFields()
        }
        submitText="Crear"
        loading={loadingAction}
        icon={
          modalType === "forum" ? <FolderIcon className="w-5 h-5" /> :
          modalType === "topic" ? <ChatBubbleLeftRightIcon className="w-5 h-5" /> :
          <ChatBubbleOvalLeftIcon className="w-5 h-5" />
        }
      />

      {/* Edit Modal */}
      <CreateModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingItem(null)
        }}
        onSubmit={handleEdit}
        title={`Editar ${modalType === "forum" ? "Foro" : modalType === "topic" ? "Tema" : "Respuesta"}`}
        description={`Modifica el ${modalType === "forum" ? "foro" : modalType === "topic" ? "tema" : "respuesta"} seleccionado`}
        fields={
          modalType === "forum" ? getForumFields() :
          modalType === "topic" ? getTopicFields() :
          getReplyFields()
        }
        submitText="Actualizar"
        loading={loadingAction}
        icon={
          modalType === "forum" ? <FolderIcon className="w-5 h-5" /> :
          modalType === "topic" ? <ChatBubbleLeftRightIcon className="w-5 h-5" /> :
          <ChatBubbleOvalLeftIcon className="w-5 h-5" />
        }
      />
    </div>
  )
}