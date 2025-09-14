"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Inicio", href: "/" },
    { name: "Ebook", href: "/ebook" },
    { name: "Coaches", href: "/coaches" },
    { name: "Recetas", href: "/recetas" },
    { name: "Iniciar Sesión", href: "/signin" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-[9999] p-4">
  <div className="max-w-6xl mx-auto">
     <div className="bg-gray-100/90 backdrop-blur-xl border border-gray-200 rounded-[3rem] shadow-2xl">
      <div className="px-0">
        <div className="py-0">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative w-28 h-20">
                <Image
                  src="/logo.jpeg"
                  alt="Gainz Factory Logo"
                  fill
                   className="rounded-[2rem] group-hover:scale-105 object-cover"
                  priority
                />
                 <div className="absolute -inset-1 bg-red-600/20 rounded-[2rem] blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                   className="relative px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-[1.5rem] hover:bg-gray-100 transition-all duration-300 group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="md:hidden relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-[1.5rem] transition-all duration-300 group"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
               <div className="absolute inset-0 bg-red-600/20 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 mt-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
              <div className="bg-gray-100/80 backdrop-blur-lg rounded-[2rem] border border-gray-200 p-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-white/60 rounded-[1.5rem] transition-all duration-300 font-medium group"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ 
                    animationDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                    animation: isMenuOpen ? 'slideInFromTop 0.3s ease-out forwards' : 'none'
                  }}
                >
                  <span className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    <span>{item.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <style jsx>{`
    @keyframes slideInFromTop {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</header>
  );
}


