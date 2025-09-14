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
  XCircleIcon,
  FlagIcon,
  TagIcon
} from "@heroicons/react/24/outline"

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    firstName: string
    lastName: string
    profileImageUrl?: string
  }
  category: string
  tags: string[]
  createdAt: string
  views: number
  commentsCount: number
  isPinned: boolean
  status: "active" | "locked" | "deleted"
}

interface ForumComment {
  id: string
  content: string
  author: {
    firstName: string
    lastName: string
  }
  createdAt: string
  isApproved: boolean
}

export default function AdminForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [comments, setComments] = useState<ForumComment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    fetchForumData()
  }, [])

  const fetchForumData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const [postsResponse, commentsResponse] = await Promise.all([
        fetch("/api/forum", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("/api/forum/comments", {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ])

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData)
      }

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setComments(commentsData)
      }
    } catch (error) {
      console.error("Error fetching forum data:", error)
      // Mock data for development
      setPosts(generateMockPosts())
      setComments(generateMockComments())
    } finally {
      setLoading(false)
    }
  }

  const generateMockPosts = (): ForumPost[] => [
    {
      id: "1",
      title: "¿Cuál es la mejor rutina para principiantes?",
      content: "Hola, soy nuevo en el gimnasio y me gustaría saber cuál es la mejor rutina para empezar...",
      author: { firstName: "Juan", lastName: "Pérez" },
      category: "Entrenamiento",
      tags: ["principiante", "rutina", "gimnasio"],
      createdAt: "2024-01-15T10:30:00Z",
      views: 156,
      commentsCount: 12,
      isPinned: true,
      status: "active"
    },
    {
      id: "2",
      title: "Recetas saludables para ganar masa muscular",
      content: "Comparto algunas recetas que me han funcionado muy bien para ganar masa muscular...",
      author: { firstName: "María", lastName: "García" },
      category: "Nutrición",
      tags: ["nutrición", "masa muscular", "recetas"],
      createdAt: "2024-01-14T15:45:00Z",
      views: 89,
      commentsCount: 8,
      isPinned: false,
      status: "active"
    },
    {
      id: "3",
      title: "Problema con la aplicación",
      content: "No puedo acceder a mi perfil desde ayer, alguien más tiene este problema?",
      author: { firstName: "Carlos", lastName: "López" },
      category: "Soporte",
      tags: ["bug", "aplicación", "problema"],
      createdAt: "2024-01-13T09:20:00Z",
      views: 45,
      commentsCount: 3,
      isPinned: false,
      status: "active"
    }
  ]

  const generateMockComments = (): ForumComment[] => [
    {
      id: "1",
      content: "Excelente pregunta, te recomiendo empezar con ejercicios básicos...",
      author: { firstName: "Ana", lastName: "Martínez" },
      createdAt: "2024-01-15T11:00:00Z",
      isApproved: true
    },
    {
      id: "2",
      content: "Este contenido es inapropiado y debería ser eliminado",
      author: { firstName: "Usuario", lastName: "Reportado" },
      createdAt: "2024-01-15T12:30:00Z",
      isApproved: false
    }
  ]

  const handleDeletePost = async (postId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este post?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/forum/${postId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleTogglePin = async (postId: string) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/forum/${postId}/pin`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, isPinned: !post.isPinned } : post
        ))
      }
    } catch (error) {
      console.error("Error toggling pin:", error)
    }
  }

  const handleApproveComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/forum/comments/${commentId}/approve`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setComments(comments.map(comment => 
          comment.id === commentId ? { ...comment, isApproved: true } : comment
        ))
      }
    } catch (error) {
      console.error("Error approving comment:", error)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "Entrenamiento", "Nutrición", "Motivación", "Soporte", "General"]

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
          <p className="text-gray-600 mt-2">Administra posts y comentarios del foro comunitario</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showComments 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showComments ? 'Ver Posts' : 'Ver Comentarios'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "Todas las categorías" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {showComments ? (
        /* Comments Management */
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Comentarios Pendientes de Moderación</h2>
          {comments.filter(comment => !comment.isApproved).map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-900 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{comment.author.firstName} {comment.author.lastName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApproveComment(comment.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Aprobar comentario"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* Delete comment */}}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar comentario"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Posts Management */
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {post.isPinned && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        Fijado
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{post.author.firstName} {post.author.lastName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{post.views} vistas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      <span>{post.commentsCount} comentarios</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleTogglePin(post.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      post.isPinned 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={post.isPinned ? "Desfijar post" : "Fijar post"}
                  >
                    <FlagIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar post"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar post"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 && !showComments && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay posts</h3>
          <p className="text-gray-600">
            {searchTerm ? "No se encontraron posts que coincidan con tu búsqueda." : "No hay posts en el foro aún."}
          </p>
        </div>
      )}
    </div>
  )
}
