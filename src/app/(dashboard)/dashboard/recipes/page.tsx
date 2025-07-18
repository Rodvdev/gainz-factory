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
  ClockIcon
} from "@heroicons/react/24/outline"
import Image from "next/image"

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
  const [showCreateForm, setShowCreateForm] = useState(false)

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
      case 'INTERMEDIATE': return 'bg-yellow-500'
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Recetas</h1>
            <p className="text-gray-400">Administra las recetas de nutrición de Gainz Factory</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva Receta
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Recetas</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Premium</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.premium}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Principiante</p>
            <p className="text-2xl font-bold text-green-500">{stats.beginner}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Intermedio</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.intermediate}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Avanzado</p>
            <p className="text-2xl font-bold text-red-500">{stats.advanced}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar recetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as UserLevel | 'ALL')}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
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
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="all">Todos los objetivos</option>
              {objectives.map((objective) => (
                <option key={objective} value={objective}>
                  {objective}
                </option>
              ))}
            </select>

            {/* Premium Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={(e) => setShowPremiumOnly(e.target.checked)}
                className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-300">Solo Premium</span>
            </label>
          </div>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                {/* Recipe Image */}
                <div className="relative h-48 bg-gray-800">
                  {recipe.imageUrl ? (
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpenIcon className="h-16 w-16 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {recipe.isPremium && (
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <StarIcon className="h-4 w-4" />
                        PREMIUM
                      </span>
                    )}
                    {recipe.level && (
                      <span className={`${getLevelColor(recipe.level)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                        {getLevelText(recipe.level)}
                      </span>
                    )}
                  </div>

                  {/* Video Icon */}
                  {recipe.videoUrl && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/60 rounded-full p-2">
                        <PlayIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{recipe.title}</h3>
                  
                  {recipe.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{recipe.description}</p>
                  )}

                  {recipe.objective && (
                    <div className="mb-4">
                      <span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                        {recipe.objective}
                      </span>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <ClockIcon className="h-4 w-4" />
                    <span>Creado: {new Date(recipe.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Ver Detalle
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors">
                      ⚙️
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredRecipes.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <BookOpenIcon className="h-24 w-24 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No se encontraron recetas</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || selectedLevel !== 'ALL' || selectedObjective !== 'all' || showPremiumOnly
                    ? 'Intenta ajustar los filtros para ver más recetas.'
                    : 'Comienza creando tu primera receta.'
                  }
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Crear Primera Receta
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Recipe Modal - Placeholder */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Crear Nueva Receta</h3>
            <p className="text-gray-400 mb-6">
              El formulario de creación estará disponible en la próxima actualización.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors">
                Próximamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 