"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ChefHat, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Clock,
  Users,
  Target,
  Crown,
  Eye,
  Image as ImageIcon
} from "lucide-react"
import { UserLevel } from "@prisma/client"

interface Recipe {
  id: string
  title: string
  description?: string
  objective?: string
  level?: UserLevel
  isPremium: boolean
  imageUrl?: string
  videoUrl?: string
  createdAt: string
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<UserLevel | "ALL">("ALL")
  const [premiumFilter, setPremiumFilter] = useState<"ALL" | "PREMIUM" | "FREE">("ALL")
  const [objectiveFilter, setObjectiveFilter] = useState<string>("ALL")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showRecipeModal, setShowRecipeModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const objectives = [
    "Pérdida de peso",
    "Ganancia muscular",
    "Mantenimiento",
    "Rendimiento",
    "Recuperación",
    "Energía",
    "Digestión"
  ]

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("/api/admin/recipes", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setRecipes(data.recipes || [])
        }
      } catch (error) {
        console.error("Error fetching recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.objective?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLevel = levelFilter === "ALL" || recipe.level === levelFilter
    const matchesPremium = premiumFilter === "ALL" || 
      (premiumFilter === "PREMIUM" && recipe.isPremium) ||
      (premiumFilter === "FREE" && !recipe.isPremium)
    const matchesObjective = objectiveFilter === "ALL" || recipe.objective === objectiveFilter
    
    return matchesSearch && matchesLevel && matchesPremium && matchesObjective
  })

  const handleCreateRecipe = () => {
    setSelectedRecipe(null)
    setIsEditing(false)
    setShowRecipeModal(true)
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsEditing(true)
    setShowRecipeModal(true)
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta receta?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        setRecipes(recipes.filter(r => r.id !== recipeId))
      }
    } catch (error) {
      console.error("Error deleting recipe:", error)
    }
  }

  const handleTogglePremium = async (recipeId: string, currentPremium: boolean) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/recipes/${recipeId}/toggle-premium`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isPremium: !currentPremium })
      })

      if (response.ok) {
        setRecipes(recipes.map(recipe => 
          recipe.id === recipeId ? { ...recipe, isPremium: !currentPremium } : recipe
        ))
      }
    } catch (error) {
      console.error("Error toggling premium status:", error)
    }
  }

  const getLevelBadgeColor = (level?: UserLevel) => {
    if (!level) return "bg-gray-100 text-gray-800"
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800"
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800"
      case "ADVANCED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getObjectiveBadgeColor = (objective?: string) => {
    switch (objective) {
      case "Pérdida de peso":
        return "bg-blue-100 text-blue-800"
      case "Ganancia muscular":
        return "bg-red-100 text-red-800"
      case "Mantenimiento":
        return "bg-green-100 text-green-800"
      case "Rendimiento":
        return "bg-purple-100 text-purple-800"
      case "Recuperación":
        return "bg-orange-100 text-orange-800"
      case "Energía":
        return "bg-yellow-100 text-yellow-800"
      case "Digestión":
        return "bg-indigo-100 text-indigo-800"
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Recetas</h1>
          <p className="text-gray-600 mt-2">Administra la biblioteca de recetas saludables</p>
        </div>
        <button 
          onClick={handleCreateRecipe}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Receta</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ChefHat className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Recetas</p>
              <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Premium</p>
              <p className="text-2xl font-bold text-gray-900">
                {recipes.filter(r => r.isPremium).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pérdida de Peso</p>
              <p className="text-2xl font-bold text-gray-900">
                {recipes.filter(r => r.objective === "Pérdida de peso").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Star className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ganancia Muscular</p>
              <p className="text-2xl font-bold text-gray-900">
                {recipes.filter(r => r.objective === "Ganancia muscular").length}
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
                placeholder="Título, descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as UserLevel | "ALL")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todos los niveles</option>
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={premiumFilter}
              onChange={(e) => setPremiumFilter(e.target.value as "ALL" | "PREMIUM" | "FREE")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todas</option>
              <option value="PREMIUM">Premium</option>
              <option value="FREE">Gratuitas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo</label>
            <select
              value={objectiveFilter}
              onChange={(e) => setObjectiveFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="ALL">Todos los objetivos</option>
              {objectives.map(obj => (
                <option key={obj} value={obj}>{obj}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Recipe Image */}
            <div className="h-48 bg-gray-100 flex items-center justify-center relative">
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-400" />
              )}
              
              {/* Premium Badge */}
              {recipe.isPremium && (
                <div className="absolute top-3 right-3">
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </div>
                </div>
              )}

              {/* Video Indicator */}
              {recipe.videoUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Recipe Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {recipe.title}
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditRecipe(recipe)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {recipe.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {recipe.description}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.level && (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(recipe.level)}`}>
                    {recipe.level}
                  </span>
                )}
                {recipe.objective && (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getObjectiveBadgeColor(recipe.objective)}`}>
                    {recipe.objective}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(recipe.createdAt).toLocaleDateString('es-ES')}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTogglePremium(recipe.id, recipe.isPremium)}
                    className={`text-xs px-2 py-1 rounded ${
                      recipe.isPremium 
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {recipe.isPremium ? "Quitar Premium" : "Hacer Premium"}
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recipe Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditing ? "Editar Receta" : "Nueva Receta"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedRecipe?.title || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    defaultValue={selectedRecipe?.description || ""}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objetivo
                    </label>
                    <select
                      defaultValue={selectedRecipe?.objective || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Seleccionar objetivo</option>
                      {objectives.map(obj => (
                        <option key={obj} value={obj}>{obj}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel
                    </label>
                    <select
                      defaultValue={selectedRecipe?.level || "BEGINNER"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="BEGINNER">Principiante</option>
                      <option value="INTERMEDIATE">Intermedio</option>
                      <option value="ADVANCED">Avanzado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la Imagen
                    </label>
                    <input
                      type="url"
                      defaultValue={selectedRecipe?.imageUrl || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Video
                    </label>
                    <input
                      type="url"
                      defaultValue={selectedRecipe?.videoUrl || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPremium"
                    defaultChecked={selectedRecipe?.isPremium || false}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-900">
                    Receta Premium
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                  {isEditing ? "Actualizar" : "Crear"} Receta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
