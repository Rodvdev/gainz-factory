"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { Shield, Phone } from "lucide-react";

export default function PhysiotherapyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                <Shield size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="text-red-500">Fisioterapia</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Rehabilitación y prevención de lesiones con profesionales certificados. 
              Recupera tu movilidad y fortaleza de manera segura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/51978381334?text=Hola Chepa, me interesa la fisioterapia."
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone className="inline mr-2" size={20} />
                Consultar
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas rehabilitación o prevención?</h2>
          <p className="text-xl mb-8 text-red-100">
            Nuestros fisioterapeutas certificados te ayudarán a recuperar tu bienestar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/51978381334?text=Hola Chepa, necesito información sobre fisioterapia."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              <Phone className="inline mr-2" size={20} />
              Consultar
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
