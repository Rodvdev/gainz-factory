"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { Heart, Clock, Users, CheckCircle, Phone } from "lucide-react";

export default function YogaPilatesPage() {
  const features = [
    {
      icon: Heart,
      title: "Bienestar Mental",
      description: "Reduce el estrés y mejora tu bienestar emocional"
    },
    {
      icon: Clock,
      title: "Flexibilidad",
      description: "Mejora tu rango de movimiento y flexibilidad corporal"
    },
    {
      icon: Users,
      title: "Clases Grupales",
      description: "Practica en un ambiente motivador y comunitario"
    },
    {
      icon: CheckCircle,
      title: "Técnica Correcta",
      description: "Aprende las posturas y movimientos de manera segura"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                <Heart size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="text-red-500">Yoga y Pilates</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Clases de yoga y pilates para mejorar flexibilidad, fuerza y bienestar mental. 
              Encuentra equilibrio entre cuerpo y mente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/51978381334?text=Hola Chepa, me interesa las clases de Yoga y Pilates."
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone className="inline mr-2" size={20} />
                Consultar Clases
              </a>
              <Link
                href="/pricing"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Precios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Beneficios del Yoga y Pilates</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre cómo estas disciplinas pueden transformar tu bienestar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800/60 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para encontrar tu equilibrio?</h2>
          <p className="text-xl mb-8 text-red-100">
            Únete a nuestras clases de Yoga y Pilates y descubre una nueva forma de cuidar tu cuerpo y mente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/51978381334?text=Hola Chepa, me interesa conocer más sobre las clases de Yoga y Pilates."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              <Phone className="inline mr-2" size={20} />
              Consultar Clases
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
