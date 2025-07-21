"use client";

import { useQuery } from '@apollo/client';
import { PUBLIC_QUERIES } from '@/lib/graphql/public-schema';
import { GetVisibleCoachesData, Coach } from '@/lib/graphql/public-types';
import Image from 'next/image';
import Link from 'next/link';

export default function CoachesPage() {
  const { loading, error, data } = useQuery<GetVisibleCoachesData>(PUBLIC_QUERIES.GET_VISIBLE_COACHES);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8B0000] mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando coaches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error al cargar los coaches</h2>
          <p className="text-gray-400">Por favor, intenta de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  const coaches = data?.visibleCoaches || [];

  const getSpecialtyColor = (specialty: string) => {
    if (specialty?.includes('Nutrición')) return 'bg-green-600';
    if (specialty?.includes('Strength') || specialty?.includes('fuerza')) return 'bg-red-600';
    if (specialty?.includes('Mindset') || specialty?.includes('mental')) return 'bg-purple-600';
    return 'bg-blue-600';
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
              <Link href="/recetas" className="hover:text-gray-300 transition-colors">
                Recetas
              </Link>
              <Link href="/coaches" className="text-yellow-300 font-semibold">
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
            Nuestros <span className="text-[#8B0000]">Coaches</span> Expertos
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Conoce al equipo de profesionales que te ayudarán a transformar tu vida. 
            Cada coach es especialista en su área y está comprometido con tu éxito.
          </p>
        </div>
      </section>

      {/* Coaches Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {coaches.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">No hay coaches disponibles</h3>
              <p className="text-gray-400">Pronto tendremos coaches disponibles para ayudarte.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coaches.map((coach: Coach) => (
                <div
                  key={coach.id}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-[#8B0000]/20 transition-all duration-300 hover:scale-105"
                >
                  {/* Imagen del Coach */}
                  <div className="relative h-64 bg-gray-800">
                    {coach.user.profileImageUrl ? (
                      <Image
                        src={coach.user.profileImageUrl}
                        alt={`${coach.user.firstName} ${coach.user.lastName}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">👤</span>
                      </div>
                    )}
                    
                    {/* Badge de especialidad */}
                    {coach.specialty && (
                      <div className="absolute top-4 left-4">
                        <span className={`${getSpecialtyColor(coach.specialty)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                          {coach.specialty}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Información del Coach */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {coach.user.firstName} {coach.user.lastName}
                    </h3>
                    
                    {coach.specialty && (
                      <p className="text-[#8B0000] font-semibold mb-4">{coach.specialty}</p>
                    )}
                    
                    {coach.bio && (
                      <p className="text-gray-400 mb-6 line-clamp-4">{coach.bio}</p>
                    )}
                    
                    {coach.user.bio && (
                      <p className="text-gray-300 mb-6 line-clamp-3">{coach.user.bio}</p>
                    )}

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-3">
                      <a
                        href={`https://wa.me/51978381334?text=Hola%20${coach.user.firstName},%20me%20interesa%20una%20asesoría%20en%20${encodeURIComponent(coach.specialty || 'fitness')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#8B0000] hover:bg-[#6B0000] text-white py-3 px-6 rounded-lg text-center font-medium transition-colors"
                      >
                        Contactar por WhatsApp
                      </a>
                      
                      <a
                        href="https://www.instagram.com/elchepaaa/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-lg text-center font-medium transition-colors"
                      >
                        Seguir en Instagram
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Servicios de Coaching</h2>
            <p className="text-xl text-gray-300">
              Ofrecemos diferentes tipos de asesoría personalizada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-3">Entrenamiento Personal</h3>
              <p className="text-gray-400 mb-4">
                Rutinas personalizadas según tu nivel, objetivos y disponibilidad de tiempo
              </p>
              <span className="text-[#8B0000] font-semibold">Desde $200/sesión</span>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-bold mb-3">Nutrición y Dieta</h3>
              <p className="text-gray-400 mb-4">
                Planes nutricionales adaptados a tus objetivos y preferencias alimentarias
              </p>
              <span className="text-[#8B0000] font-semibold">Desde $150/sesión</span>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="text-xl font-bold mb-3">Mindset y Motivación</h3>
              <p className="text-gray-400 mb-4">
                Coaching mental para desarrollar disciplina y alcanzar tus metas
              </p>
              <span className="text-[#8B0000] font-semibold">Desde $120/sesión</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#8B0000] to-[#6B0000]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para transformar tu vida?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Agenda una sesión con nuestros coaches expertos y comienza tu transformación hoy mismo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/51978381334?text=Hola%20Chepa,%20me%20interesa%20agendar%20una%20sesión%20de%20coaching"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#8B0000] hover:bg-gray-100 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              Agendar Sesión
            </a>
            <a
              href="https://www.instagram.com/elchepaaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white hover:bg-gray-800 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              Ver Más Contenido
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Gainz Factory - Todos los derechos reservados</p>
          {/* <a 
            href="https://rodrigovdev.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 inline-block hover:text-gray-300 transition-colors"
          >
            Desarrollado por VdeV Digital Solutions
          </a> */}
        </div>
      </footer>
    </div>
  );
} 