"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { Phone, Mail, MapPin, Clock, MessageSquare, Instagram, Send } from "lucide-react";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono / WhatsApp",
      details: "+51 978 381 334",
      action: "Llamar / WhatsApp",
      link: "https://wa.me/51978381334",
      color: "text-green-500"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@gainzfactory.com",
      action: "Enviar Email",
      link: "mailto:info@gainzfactory.com",
      color: "text-blue-500"
    },
    {
      icon: MapPin,
      title: "Ubicación",
      details: "Lima, Perú",
      action: "Ver Ubicación",
      link: "#",
      color: "text-red-500"
    },
    {
      icon: Clock,
      title: "Horarios",
      details: "Lun - Vie: 6:00 AM - 10:00 PM",
      action: "Sab: 7:00 AM - 8:00 PM",
      link: "#",
      color: "text-purple-500"
    }
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/elchepaaa/",
      followers: "10K+",
      description: "Síguenos para tips diarios y motivación"
    },
    {
      name: "WhatsApp",
      icon: MessageSquare,
      url: "https://wa.me/51978381334",
      followers: "Respuesta rápida",
      description: "Contacto directo con Chepa"
    }
  ];

  const services = [
    {
      name: "Consulta Inicial",
      description: "Evaluación completa de tus objetivos y necesidades",
      duration: "60 minutos",
      price: "Gratis",
      whatsappMessage: "Hola Chepa, me interesa agendar una consulta inicial gratuita."
    },
    {
      name: "Plan Personalizado",
      description: "Desarrollo de rutina y plan nutricional específico",
      duration: "Sesión completa",
      price: "S/ 150",
      whatsappMessage: "Hola Chepa, me interesa el plan personalizado (S/ 150)."
    },
    {
      name: "Seguimiento Continuo",
      description: "Acompañamiento y ajustes en tu plan de entrenamiento",
      duration: "Mensual",
      price: "Desde S/ 199",
      whatsappMessage: "Hola Chepa, me interesa el seguimiento continuo mensual."
    }
  ];

  const faqItems = [
    {
      question: "¿Cuánto tiempo toma ver resultados?",
      answer: "Los resultados iniciales se pueden ver en 2-4 semanas, pero para una transformación completa recomendamos un mínimo de 3 meses de compromiso."
    },
    {
      question: "¿Trabajan con principiantes?",
      answer: "¡Absolutamente! Tenemos programas específicos para principiantes y nos especializamos en hacer que el fitness sea accesible para todos."
    },
    {
      question: "¿Ofrecen planes de nutrición?",
      answer: "Sí, incluimos planes nutricionales personalizados en todos nuestros servicios para maximizar tus resultados."
    },
    {
      question: "¿Cuáles son las formas de pago?",
      answer: "Aceptamos transferencias bancarias, Yape, Plin, PayPal y efectivo para tu comodidad."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span className="text-red-500">Contacto</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Estamos aquí para ayudarte en tu transformación. Contáctanos y comienza tu journey hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/51978381334?text=Hola Chepa, me interesa conocer más sobre tus servicios y comenzar mi transformación."
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone className="inline mr-2" size={20} />
                Contactar por WhatsApp
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

      {/* Contact Information */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Información de Contacto</h2>
            <p className="text-xl text-gray-300">
              Múltiples formas de ponerte en contacto con nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800/60 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center`}>
                  <info.icon size={32} className={info.color} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-gray-300 mb-4">{info.details}</p>
                <p className="text-gray-400 text-sm mb-4">{info.action}</p>
                <a
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  <Send size={16} />
                  Contactar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Síguenos en Redes</h2>
            <p className="text-xl text-gray-300">
              Mantente conectado y recibe contenido exclusivo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {socialLinks.map((social, index) => (
              <div
                key={index}
                className="p-8 bg-gray-800/60 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <social.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{social.name}</h3>
                    <p className="text-gray-400 text-sm">{social.followers}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">{social.description}</p>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <social.icon size={18} />
                  Seguir
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Servicios de Contacto</h2>
            <p className="text-xl text-gray-300">
              Elige el servicio que mejor se adapte a tus necesidades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 bg-gray-800/60 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 text-sm">Duración: {service.duration}</span>
                    <span className="text-red-500 font-bold">{service.price}</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/51978381334?text=${encodeURIComponent(service.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <MessageSquare className="inline mr-2" size={18} />
                  Solicitar por WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-gray-300">
              Resolvemos las dudas más comunes sobre nuestros servicios
            </p>
          </div>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gray-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar tu transformación?</h2>
          <p className="text-xl mb-8 text-red-100">
            No esperes más. Contacta con nosotros hoy mismo y da el primer paso hacia una vida mejor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/51978381334?text=Hola Chepa, estoy listo para comenzar mi transformación. ¿Podemos agendar una consulta?"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              <Phone className="inline mr-2" size={20} />
              Contactar Ahora
            </a>
            <Link
              href="/pricing"
              className="bg-red-800 text-white hover:bg-red-900 py-3 px-8 rounded-lg font-bold transition-colors"
            >
              Ver Precios
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
