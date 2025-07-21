"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');


  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setBlogPosts(data.blogPosts || []);
      setAllTags(data.allTags || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = useCallback(() => {
    let filtered = [...blogPosts];

    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [blogPosts, selectedTag, searchTerm]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const handleCreatePost = async () => {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPosts([data.blogPost, ...blogPosts]);
        resetForm();
        setShowCreateForm(false);
        // Update tags
        const newTags = formData.tags.filter(tag => !allTags.includes(tag));
        if (newTags.length > 0) {
          setAllTags([...allTags, ...newTags]);
        }
      } else {
        console.error('Error creating blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const response = await fetch(`/api/blog/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPosts(blogPosts.map(post => 
          post.id === editingPost.id ? data.blogPost : post
        ));
        resetForm();
        setEditingPost(null);
      } else {
        console.error('Error updating blog post');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setBlogPosts(blogPosts.filter(post => post.id !== postId));
      } else {
        console.error('Error deleting blog post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', tags: [] });
    setNewTag('');
  };

  const startEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      tags: [...post.tags]
    });
    setEditingPost(post);
    setShowCreateForm(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando artículos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog & Artículos</h1>
          <p className="text-gray-600">
            Gestiona y explora artículos educativos sobre transformación personal
          </p>
        </div>
        
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingPost(null);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo Artículo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tag Filter */}
          <div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las etiquetas</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Artículos</h3>
          <p className="text-2xl font-bold text-gray-900">{filteredPosts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Etiquetas</h3>
          <p className="text-2xl font-bold text-blue-600">{allTags.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Mis Artículos</h3>
          <p className="text-2xl font-bold text-green-600">
            {/* This would need user context to filter properly */}
            {filteredPosts.length}
          </p>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingPost) && (
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingPost ? 'Editar Artículo' : 'Nuevo Artículo'}
          </h2>
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Título del artículo"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contenido del artículo (puedes usar Markdown)"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Agregar etiqueta"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={editingPost ? handleUpdatePost : handleCreatePost}
              disabled={!formData.title || !formData.content}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {editingPost ? 'Actualizar' : 'Crear'} Artículo
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingPost(null);
                resetForm();
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Blog Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <PencilIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay artículos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {blogPosts.length === 0 
              ? 'Comienza creando tu primer artículo.'
              : 'No se encontraron artículos que coincidan con los filtros aplicados.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Post Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {truncateContent(post.content)}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{post.tags.length - 3} más
                      </span>
                    )}
                  </div>
                )}

                {/* Author and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    {post.author.profileImageUrl ? (
                      <Image
                        src={post.author.profileImageUrl}
                        alt={`${post.author.firstName} ${post.author.lastName}`}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-400" />
                    )}
                    <span>{post.author.firstName} {post.author.lastName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                    <EyeIcon className="h-4 w-4" />
                    Ver
                  </button>
                  <button 
                    onClick={() => startEdit(post)}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 