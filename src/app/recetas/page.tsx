"use client";

import { useQuery } from '@apollo/client';
import { PUBLIC_QUERIES } from '@/lib/graphql/public-schema';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Recipe } from '@/lib/graphql/public-types';

export default function RecetasPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedObjective, setSelectedObjective] = useState<string>('all');

  const { loading, error, data } = useQuery(PUBLIC_QUERIES.GET_ALL_RECIPES);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8B0000] mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando recetas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error al cargar las recetas</h2>
          <p className="text-gray-400">Por favor, intenta de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  const recipes = data?.allRecipes || [];

  // Filtrar recetas
  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    const levelMatch = selectedLevel === 'all' || recipe.level === selectedLevel;
    const objectiveMatch = selectedObjective === 'all' || recipe.objective === selectedObjective;
    return levelMatch && objectiveMatch;
  });

  // Obtener objetivos únicos
  const objectives = [...new Set(recipes.map((recipe: Recipe) => recipe.objective).filter(Boolean))] as string[];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-600';
      case 'INTERMEDIATE': return 'bg-yellow-600';
      case 'ADVANCED': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'Principiante';
      case 'INTERMEDIATE': return 'Intermedio';
      case 'ADVANCED': return 'Avanzado';
      default: return 'Todos los niveles';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B0000] to-[#6B0000] py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Gainz Factory Logo"
                width={50}
                height={50}
                className="rounded-full border-2 border-white"
              />
              <h1 className="text-2xl font-bold">GAINZ FACTORY</h1>
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-gray-300 transition-colors">
                Inicio
              </Link>
              <Link href="/recetas" className="text-yellow-300 font-semibold">
                Recetas
              </Link>
              <Link href="/coaches" className="hover:text-gray-300 transition-colors">
                Coaches
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-[#8B0000]/20 to-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Recetas <span className="text-[#8B0000]">Fit</span> & Bodybuilding
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Descubre recetas deliciosas y nutritivas diseñadas para ayudarte a alcanzar tus objetivos fitness
          </p>
          
          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* Filtro por nivel */}
            <div className="flex flex-col items-center">
              <label className="text-sm text-gray-400 mb-2">Nivel</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#8B0000] focus:outline-none"
              >
                <option value="all">Todos los niveles</option>
                <option value="BEGINNER">Principiante</option>
                <option value="INTERMEDIATE">Intermedio</option>
                <option value="ADVANCED">Avanzado</option>
              </select>
            </div>

            {/* Filtro por objetivo */}
            <div className="flex flex-col items-center">
              <label className="text-sm text-gray-400 mb-2">Objetivo</label>
              <select
                value={selectedObjective}
                onChange={(e) => setSelectedObjective(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#8B0000] focus:outline-none"
              >
                <option value="all">Todos los objetivos</option>
                {objectives.map((objective: string) => (
                  <option key={objective} value={objective}>
                    {objective}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Recetas Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">No se encontraron recetas</h3>
              <p className="text-gray-400">Intenta ajustar los filtros para ver más opciones.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe: Recipe) => (
                <div
                  key={recipe.id}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-[#8B0000]/20 transition-all duration-300 hover:scale-105"
                >
                  {/* Imagen */}
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
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {recipe.isPremium && (
                        <span className="bg-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                          PREMIUM
                        </span>
                      )}
                      <span className={`${getLevelColor(recipe.level || '')} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                        {getLevelText(recipe.level || '')}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{recipe.title}</h3>
                    
                    {recipe.description && (
                      <p className="text-gray-400 mb-4 line-clamp-3">{recipe.description}</p>
                    )}
                    
                    {recipe.objective && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Objetivo:</span>
                        <p className="text-[#8B0000] font-semibold">{recipe.objective}</p>
                      </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3">
                      {recipe.videoUrl && (
                        <a
                          href={recipe.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#8B0000] hover:bg-[#6B0000] text-white py-2 px-4 rounded-lg text-center font-medium transition-colors"
                        >
                          Ver Video
                        </a>
                      )}
                      
                      {recipe.isPremium ? (
                        <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black py-2 px-4 rounded-lg font-medium transition-colors">
                          Acceso Premium
                        </button>
                      ) : (
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          Ver Receta
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#8B0000] to-[#6B0000]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Quieres acceso a todas las recetas premium?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Únete a Gainz Factory y obtén acceso exclusivo a recetas avanzadas, rutinas personalizadas y coaching 1 a 1
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/51978381334?text=Hola%20Chepa,%20me%20interesa%20obtener%20acceso%20premium%20a%20Gainz%20Factory"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#8B0000] hover:bg-gray-100 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              Contactar por WhatsApp
            </a>
            <a
              href="https://www.instagram.com/elchepaaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white hover:bg-gray-800 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              Seguir en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Gainz Factory - Todos los derechos reservados</p>
          <a 
            href="https://rodrigovdev.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 inline-block hover:text-gray-300 transition-colors"
          >
            Desarrollado por VdeV Digital Solutions
          </a>
        </div>
      </footer>
    </div>
  );
} 