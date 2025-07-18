"use client";

import { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  DocumentTextIcon, 
  BookOpenIcon, 
  SpeakerWaveIcon,
  StarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface MediaContent {
  id: string;
  title: string;
  type: string;
  url: string;
  topic: string;
  module: string | null;
  episode: number | null;
  isPremium: boolean;
  createdAt: string;
}



export default function MediaPage() {
  const [mediaContent, setMediaContent] = useState<MediaContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<MediaContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const topics = ['Mindset', 'Nutrición', 'Espiritualidad', 'Ejercicios'];

  useEffect(() => {
    fetchMediaContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [mediaContent, selectedType, selectedTopic, searchTerm]);

  const fetchMediaContent = async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      setMediaContent(data.mediaContent || []);
    } catch (error) {
      console.error('Error fetching media content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = [...mediaContent];

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(item => item.topic === selectedTopic);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContent(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayIcon className="h-5 w-5" />;
      case 'pdf': return <DocumentTextIcon className="h-5 w-5" />;
      case 'ebook': return <BookOpenIcon className="h-5 w-5" />;
      case 'audio': return <SpeakerWaveIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-600';
      case 'pdf': return 'bg-blue-600';
      case 'ebook': return 'bg-green-600';
      case 'audio': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case 'Mindset': return 'bg-purple-100 text-purple-800';
      case 'Nutrición': return 'bg-green-100 text-green-800';
      case 'Espiritualidad': return 'bg-blue-100 text-blue-800';
      case 'Ejercicios': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedContent = filteredContent.reduce((acc, item) => {
    const moduleKey = item.module || 'Sin Módulo';
    if (!acc[moduleKey]) {
      acc[moduleKey] = [];
    }
    acc[moduleKey].push(item);
    return acc;
  }, {} as Record<string, MediaContent[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Contenido</h1>
          <p className="text-gray-600">
            Explora videos, artículos y recursos educativos para tu transformación
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FunnelIcon className="h-5 w-5" />
          Filtros
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los tipos</option>
                <option value="video">Videos</option>
                <option value="pdf">PDFs</option>
                <option value="ebook">eBooks</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los temas</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Contenido</h3>
          <p className="text-2xl font-bold text-gray-900">{filteredContent.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Videos</h3>
          <p className="text-2xl font-bold text-red-600">
            {filteredContent.filter(item => item.type === 'video').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Documentos</h3>
          <p className="text-2xl font-bold text-blue-600">
            {filteredContent.filter(item => ['pdf', 'ebook'].includes(item.type)).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Premium</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredContent.filter(item => item.isPremium).length}
          </p>
        </div>
      </div>

      {/* Content by Module */}
      {Object.keys(groupedContent).length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay contenido</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontró contenido que coincida con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedContent).map(([module, items]) => (
            <div key={module} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                {module}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* Content Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg text-white ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                          </div>
                          {item.episode && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-medium">
                              Ep. {item.episode}
                            </span>
                          )}
                        </div>
                        
                        {item.isPremium && (
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            <StarIcon className="h-3 w-3" />
                            Premium
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>

                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTopicColor(item.topic)}`}>
                        {item.topic}
                      </span>
                    </div>

                    {/* Progress Bar (placeholder for now) */}
                    <div className="px-4 pb-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">0% completado</p>
                    </div>

                    {/* Action Button */}
                    <div className="px-4 pb-4">
                      <button 
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          item.isPremium 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {item.isPremium ? 'Acceso Premium' : 'Ver Contenido'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 