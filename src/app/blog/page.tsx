"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { Calendar, User, ArrowRight, MessageSquare } from "lucide-react";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Los 10 Errores Más Comunes en el Entrenamiento",
      excerpt: "Descubre los errores que están impidiendo que alcances tus objetivos de fitness y cómo evitarlos.",
      content: "En este artículo te explicamos los errores más comunes que cometen las personas al entrenar y cómo puedes evitarlos para maximizar tus resultados.",
      author: "Chepa",
      date: "2024-01-15",
      category: "Entrenamiento",
      readTime: "5 min",
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "Guía Completa de Nutrición para Principiantes",
      excerpt: "Todo lo que necesitas saber sobre nutrición para comenzar tu transformación de manera saludable.",
      content: "Una guía completa que te ayudará a entender los fundamentos de la nutrición y cómo aplicarlos en tu día a día.",
      author: "Chepa",
      date: "2024-01-10",
      category: "Nutrición",
      readTime: "8 min",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 3,
      title: "Cómo Mantener la Motivación en el Fitness",
      excerpt: "Técnicas probadas para mantener la motivación y constancia en tu rutina de entrenamiento.",
      content: "La motivación es clave para el éxito en el fitness. Te compartimos las mejores estrategias para mantenerte motivado.",
      author: "Chepa",
      date: "2024-01-05",
      category: "Motivación",
      readTime: "6 min",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 4,
      title: "Recetas Saludables para Ganar Músculo",
      excerpt: "Deliciosas recetas ricas en proteínas que te ayudarán a ganar masa muscular de forma saludable.",
      content: "Recetas deliciosas y nutritivas diseñadas específicamente para apoyar el crecimiento muscular.",
      author: "Chepa",
      date: "2024-01-01",
      category: "Recetas",
      readTime: "7 min",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 5,
      title: "Los Beneficios del Yoga en el Fitness",
      excerpt: "Descubre cómo el yoga puede complementar tu rutina de entrenamiento y mejorar tu rendimiento.",
      content: "El yoga no es solo relajación. Te explicamos cómo puede mejorar tu fuerza, flexibilidad y rendimiento.",
      author: "Chepa",
      date: "2023-12-28",
      category: "Yoga",
      readTime: "6 min",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 6,
      title: "Plan de Entrenamiento para Principiantes",
      excerpt: "Un plan de entrenamiento completo diseñado específicamente para quienes recién comienzan.",
      content: "Si eres nuevo en el fitness, este plan te guiará paso a paso en tu primera experiencia de entrenamiento.",
      author: "Chepa",
      date: "2023-12-25",
      category: "Entrenamiento",
      readTime: "10 min",
      image: "/api/placeholder/400/250",
      featured: false
    }
  ];

  const categories = [
    { name: "Todos", count: 6, active: true },
    { name: "Entrenamiento", count: 2, active: false },
    { name: "Nutrición", count: 1, active: false },
    { name: "Motivación", count: 1, active: false },
    { name: "Recetas", count: 1, active: false },
    { name: "Yoga", count: 1, active: false }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="text-red-500">Blog</span> de Fitness
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Artículos, consejos y guías para ayudarte en tu transformación física y mental
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://wa.me/51978381334?text=Hola Chepa, me interesa recibir más contenido sobre fitness y nutrición."
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Suscribirse al Newsletter
              </Link>
              <Link
                href="/contact"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category.active
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Artículo Destacado</h2>
              <p className="text-gray-400">Lo más leído esta semana</p>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="h-64 lg:h-auto bg-gradient-to-br from-red-600/20 to-red-700/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">📝</span>
                    </div>
                    <p className="text-gray-300 text-sm">Imagen del artículo</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {featuredPost.category}
                    </span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Destacado
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(featuredPost.date).toLocaleDateString('es-ES')}
                      </div>
                      <div>{featuredPost.readTime} de lectura</div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Leer Artículo
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Últimos Artículos</h2>
            <p className="text-xl text-gray-300">
              Mantente al día con los últimos consejos y tendencias en fitness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-800/60 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl font-bold text-white">📝</span>
                    </div>
                    <p className="text-gray-300 text-xs">Imagen del artículo</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.date).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold text-sm transition-colors"
                  >
                    Leer más
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Mantente Actualizado</h2>
          <p className="text-xl mb-8 text-red-100">
            Recibe los últimos artículos y consejos directamente en tu WhatsApp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/51978381334?text=Hola Chepa, me interesa recibir contenido sobre fitness y nutrición en mi WhatsApp."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              <MessageSquare className="inline mr-2" size={20} />
              Suscribirse por WhatsApp
            </a>
            <Link
              href="/contact"
              className="bg-red-800 text-white hover:bg-red-900 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              Más Información
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Gainz Factory</h3>
              <p className="text-gray-400 text-sm mb-4">
                Tu plataforma integral para transformación física y mental.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/elchepaaa/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781H7.721c-.558 0-1.01-.452-1.01-1.01s.452-1.01 1.01-1.01h8.558c.558 0 1.01.452 1.01 1.01s-.452 1.01-1.01 1.01z"/>
                  </svg>
                </a>
                <a href="https://wa.me/51978381334" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Functionalities */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Funcionalidades</h3>
              <ul className="space-y-2">
                <li><Link href="/functionalities/personal-training" className="text-gray-400 hover:text-white transition-colors text-sm">Personal Training</Link></li>
                <li><Link href="/functionalities/yoga-pilates" className="text-gray-400 hover:text-white transition-colors text-sm">Yoga y Pilates</Link></li>
                <li><Link href="/functionalities/physiotherapy" className="text-gray-400 hover:text-white transition-colors text-sm">Fisioterapia</Link></li>
                <li><Link href="/functionalities/fitness-studios" className="text-gray-400 hover:text-white transition-colors text-sm">Fitness Studios</Link></li>
                <li><Link href="/functionalities/nutrition" className="text-gray-400 hover:text-white transition-colors text-sm">Nutrición</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><Link href="/functionalities" className="text-gray-400 hover:text-white transition-colors text-sm">Functionalities</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/reviews" className="text-gray-400 hover:text-white transition-colors text-sm">Reviews</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Inicio</Link></li>
                <li><Link href="/ebook" className="text-gray-400 hover:text-white transition-colors text-sm">Ebook</Link></li>
                <li><Link href="/coaches" className="text-gray-400 hover:text-white transition-colors text-sm">Coaches</Link></li>
                <li><Link href="/recetas" className="text-gray-400 hover:text-white transition-colors text-sm">Recetas</Link></li>
                <li><Link href="/signin" className="text-gray-400 hover:text-white transition-colors text-sm">Iniciar Sesión</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 Gainz Factory - Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
