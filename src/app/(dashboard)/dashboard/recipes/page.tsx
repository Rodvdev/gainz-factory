"use client"
import { useState, useEffect } from "react"
import { UserLevel } from "@prisma/client"
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  BookOpenIcon,
  PlayIcon,
  StarIcon,
  ClockIcon,
  FireIcon,
  HeartIcon
} from "@heroicons/react/24/outline"
import Image from "next/image"
import CreateModal from "@/components/dashboard/CreateModal"
import { useCreateModal } from "@/hooks/useCreateModal"

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
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | 'ALL'>('ALL')
  const [selectedObjective, setSelectedObjective] = useState<string>('all')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  // Modal hook
  const { isOpen, modalType, loading: modalLoading, openModal, closeModal, setLoading: setModalLoading, getModalConfig } = useCreateModal()

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedLevel !== 'ALL') params.set('level', selectedLevel)
        if (selectedObjective !== 'all') params.set('objective', selectedObjective)
        if (showPremiumOnly) params.set('isPremium', 'true')
        if (searchTerm) params.set('search', searchTerm)

        const response = await fetch(`/api/recipes?${params}`)
        const data = await response.json()
        
        if (data.recipes) {
          setRecipes(data.recipes)
        }
      } catch (error) {
        console.error('Error fetching recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [selectedLevel, selectedObjective, showPremiumOnly, searchTerm])

  const objectives = [
    'Pérdida de peso',
    'Ganancia muscular',
    'Definición',
    'Volumen',
    'Mantenimiento',
    'Vegetariano',
    'Vegano',
    'Keto',
    'Low Carb'
  ]

  const getLevelColor = (level?: UserLevel) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-500'
      case 'INTERMEDIATE': return 'bg-orange-500'
      case 'ADVANCED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getLevelText = (level?: UserLevel) => {
    switch (level) {
      case 'BEGINNER': return 'Principiante'
      case 'INTERMEDIATE': return 'Intermedio'
      case 'ADVANCED': return 'Avanzado'
      default: return 'Todos los niveles'
    }
  }

  const handleCreateRecipe = async (data: Record<string, string | number | boolean>) => {
    try {
      setModalLoading(true)
      const token = localStorage.getItem("authToken")
      
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          objective: data.objective,
          level: data.level,
          isPremium: data.isPremium || false
        })
      })

      if (!response.ok) {
        throw new Error("Error al crear la receta")
      }

      // Refresh recipes list
      window.location.reload()
      closeModal()
    } catch (error) {
      console.error("Error creating recipe:", error)
      throw error
    } finally {
      setModalLoading(false)
    }
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = !searchTerm || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLevel = selectedLevel === 'ALL' || recipe.level === selectedLevel
    const matchesObjective = selectedObjective === 'all' || recipe.objective === selectedObjective
    const matchesPremium = !showPremiumOnly || recipe.isPremium

    return matchesSearch && matchesLevel && matchesObjective && matchesPremium
  })

  const stats = {
    total: recipes.length,
    premium: recipes.filter(r => r.isPremium).length,
    beginner: recipes.filter(r => r.level === 'BEGINNER').length,
    intermediate: recipes.filter(r => r.level === 'INTERMEDIATE').length,
    advanced: recipes.filter(r => r.level === 'ADVANCED').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-gray-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              Recetas de
              <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                {" "}Nutrición
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Descubre recetas saludables y deliciosas para alcanzar tus objetivos
            </p>
          </div>
          <button
            onClick={() => openModal('recipe')}
            className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            Nueva Receta
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              
              <p className="text-gray-600 text-sm font-medium">Total Recetas</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-yellow-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Premium</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.premium}</p>
          </div>
          
          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-green-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Principiante</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.beginner}</p>
          </div>
          
          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-orange-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Intermedio</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.intermediate}</p>
          </div>
          
          <div className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FireIcon className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Avanzado</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.advanced}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-8 mb-12 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <FunnelIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Filtros de Búsqueda</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar recetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as UserLevel | 'ALL')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-gray-900 bg-white"
            >
              <option value="ALL">Todos los niveles</option>
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>

            {/* Objective Filter */}
            <select
              value={selectedObjective}
              onChange={(e) => setSelectedObjective(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-gray-900 bg-white"
            >
              <option value="all">Todos los objetivos</option>
              {objectives.map((objective) => (
                <option key={objective} value={objective}>
                  {objective}
                </option>
              ))}
            </select>

            {/* Premium Filter */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={(e) => setShowPremiumOnly(e.target.checked)}
                className="w-5 h-5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                Solo Premium
              </span>
            </label>
          </div>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              <p className="text-gray-600 font-medium">Cargando recetas...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="group bg-white backdrop-blur-sm border-2 border-gray-200 hover:border-red-300 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                {/* Recipe Image */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {recipe.imageUrl ? (
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <BookOpenIcon className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {recipe.isPremium && (
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                        <StarIcon className="h-4 w-4" />
                        PREMIUM
                      </span>
                    )}
                    {recipe.level && (
                      <span className={`${getLevelColor(recipe.level)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                        {getLevelText(recipe.level)}
                      </span>
                    )}
                  </div>

                  {/* Video Icon */}
                  {recipe.videoUrl && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full p-3 group-hover:bg-red-600 transition-colors duration-200">
                        <PlayIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                    {recipe.title}
                  </h3>
                  
                  {recipe.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {recipe.description}
                    </p>
                  )}

                  {recipe.objective && (
                    <div className="mb-4">
                      <span className="inline-block bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                        {recipe.objective}
                      </span>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <ClockIcon className="h-4 w-4" />
                    <span>Creado: {new Date(recipe.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Ver Detalle
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-all duration-200 group-hover:bg-red-50 group-hover:text-red-600">
                      ⚙️
                    </button>
                    <button className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 px-4 py-3 rounded-lg transition-all duration-200">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredRecipes.length === 0 && !loading && (
              <div className="col-span-full text-center py-20">
                <div className="bg-white backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-12 max-w-md mx-auto">
                  <div className="p-4 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <BookOpenIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No se encontraron recetas</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {searchTerm || selectedLevel !== 'ALL' || selectedObjective !== 'all' || showPremiumOnly
                      ? 'Intenta ajustar los filtros para ver más recetas.'
                      : 'Comienza creando tu primera receta para tu transformación.'
                    }
                  </p>
                  <button
                    onClick={() => openModal('recipe')}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Crear Primera Receta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modalType && getModalConfig && (
        <CreateModal
          isOpen={isOpen}
          onClose={closeModal}
          onSubmit={handleCreateRecipe}
          title={getModalConfig.title}
          description={getModalConfig.description}
          fields={getModalConfig.fields}
          submitText={getModalConfig.submitText}
          loading={modalLoading}
          icon={getModalConfig.icon}
        />
      )}
    </div>
  )
} 