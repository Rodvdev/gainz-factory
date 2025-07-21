"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function RecetasPage() {
  const upcomingContent = [
    {
      id: "ebook",
      title: "Ebook Recetas",
      subtitle: "Recetas Fit & Bodybuilding",
      description: "Colección completa de recetas para tu transformación. Más de 50 recetas premium con macros detallados.",
      icon: "📚",
      color: "#F59E0B",
      status: "Próximamente",
      features: ["50+ recetas premium", "Macros detallados", "Plan de 30 días", "Tips de cocina"]
    },
    {
      id: "videos",
      title: "Recetas Grabadas",
      subtitle: "Tutoriales en Video",
      description: "Aprende a cocinar paso a paso con videos detallados de cada receta. Desde básico hasta avanzado.",
      icon: "🎥",
      color: "#DC2626",
      status: "Próximamente",
      features: ["Tutoriales paso a paso", "Técnicas de cocina", "Substituciones", "Tips de presentación"]
    },
    {
      id: "mealplan",
      title: "Plan de Comidas",
      subtitle: "Personalizado por Objetivos",
      description: "Planes de alimentación completos adaptados a tus objetivos: pérdida de grasa, ganancia muscular, mantenimiento.",
      icon: "📋",
      color: "#10B981",
      status: "Próximamente",
      features: ["Planes personalizados", "Seguimiento de macros", "Lista de compras", "Prep semanal"]
    },
    {
      id: "community",
      title: "Comunidad Premium",
      subtitle: "Grupo Exclusivo",
      description: "Acceso a grupo privado donde compartimos recetas, tips, y respondemos todas tus dudas de nutrición.",
      icon: "👥",
      color: "#8B5CF6",
      status: "Próximamente",
      features: ["Grupo privado", "Q&A semanal", "Recetas exclusivas", "Soporte directo"]
    }
  ];

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/51978381334?text=Hola Chepa, me interesa estar al tanto de cuando lances el Ebook de recetas y contenido premium de nutrición!', '_blank');
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
      <section className="py-20 bg-gradient-to-b from-[#8B0000]/20 to-black">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory Logo"
              width={80}
              height={80}
              className="rounded-full border-4 border-[#8B0000]"
            />
            <div>
              <h1 className="text-4xl font-bold text-[#8B0000]">@elchepaaa</h1>
              <p className="text-lg text-gray-300">Recetas Fit & Bodybuilding</p>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold mb-6">
            Contenido <span className="text-[#8B0000]">Premium</span> Próximamente
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Estoy preparando contenido exclusivo para ayudarte a transformar tu nutrición y alcanzar tus objetivos fitness. 
            Ebooks, videos, planes de comidas y mucho más.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWhatsAppContact}
              className="bg-[#8B0000] hover:bg-[#6B0000] text-white py-3 px-8 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Ser Notificado
            </button>
            <a
              href="https://www.instagram.com/elchepaaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black border-2 border-[#8B0000] text-white hover:bg-[#8B0000] py-3 px-8 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
              Seguir en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Lo que está <span className="text-[#8B0000]">por venir</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingContent.map((content) => (
              <div
                key={content.id}
                className="bg-gray-900 rounded-xl p-8 border-2 border-gray-800 hover:border-[#8B0000] transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">{content.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{content.title}</h3>
                      <span className="bg-[#8B0000] text-white px-3 py-1 rounded-full text-sm font-bold">
                        {content.status}
                      </span>
                    </div>
                    <p className="text-lg font-medium mb-2" style={{ color: content.color }}>
                      {content.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {content.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-white mb-3">Incluye:</h4>
                  <ul className="space-y-2">
                    {content.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <span className="text-[#8B0000]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#8B0000] to-[#6B0000]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Quieres adquirir las recetas premium?</h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Únete a la lista de espera para ser el primero en obtener acceso al Ebook de recetas premium 
            con más de 50 recetas fit y bodybuilding con macros detallados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/51978381334?text=Hola Chepa, me interesa adquirir el Ebook de recetas premium! Quiero estar en la lista de espera.', '_blank')}
              className="bg-white text-[#8B0000] hover:bg-gray-100 py-4 px-8 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Adquirir Ebook Premium
            </button>
            <a
              href="https://www.instagram.com/elchepaaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white hover:bg-gray-800 py-4 px-8 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
              Seguir en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Gainz Factory - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
} 