"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Clean background */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* GAINZ FACTORY Animated SVG Background */}
      <div className="absolute inset-0 opacity-8">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
            
            {/* Animation definitions */}
            <animateTransform
              id="dumbbellBounce"
              attributeName="transform"
              type="translate"
              values="0,0; 0,-5; 0,0"
              dur="2s"
              repeatCount="indefinite"
            />
            <animateTransform
              id="barbellLift"
              attributeName="transform"
              type="translate"
              values="0,0; 0,-8; 0,0"
              dur="3s"
              repeatCount="indefinite"
            />
            <animateTransform
              id="heartbeat"
              attributeName="transform"
              type="scale"
              values="1,1; 1.1,1.1; 1,1"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animateTransform
              id="rotation"
              attributeName="transform"
              type="rotate"
              values="0 50 50; 360 50 50"
              dur="20s"
              repeatCount="indefinite"
            />
            <animate
              id="pulse"
              attributeName="opacity"
              values="0.3; 0.8; 0.3"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              id="glow"
              attributeName="opacity"
              values="0.1; 0.4; 0.1"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              id="wave"
              attributeName="d"
              values="M0,40 Q20,10 40,40 T80,40 T120,40 T160,40 T200,40 T240,40 T280,40 T320,40 T360,40 T400,40 T440,40 T480,40 T520,40 T560,40 T600,40 T640,40 T680,40 T720,40 T760,40 T800,40 T840,40 T880,40 T920,40 T960,40 T1000,40 T1040,40 T1080,40 T1120,40;M0,40 Q20,20 40,40 T80,40 T120,40 T160,40 T200,40 T240,40 T280,40 T320,40 T360,40 T400,40 T440,40 T480,40 T520,40 T560,40 T600,40 T640,40 T680,40 T720,40 T760,40 T800,40 T840,40 T880,40 T920,40 T960,40 T1000,40 T1040,40 T1080,40 T1120,40;M0,40 Q20,10 40,40 T80,40 T120,40 T160,40 T200,40 T240,40 T280,40 T320,40 T360,40 T400,40 T440,40 T480,40 T520,40 T560,40 T600,40 T640,40 T680,40 T720,40 T760,40 T800,40 T840,40 T880,40 T920,40 T960,40 T1000,40 T1040,40 T1080,40 T1120,40"
              dur="4s"
              repeatCount="indefinite"
            />
          </defs>
          
          {/* Animated background with subtle movement */}
          <rect width="100%" height="100%" fill="url(#bgGradient)">
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1,1; 1.02,1.02; 1,1"
              dur="15s"
              repeatCount="indefinite"
            />
          </rect>
          
          {/* Floating particles */}
          <g opacity="0.3">
            <circle cx="200" cy="100" r="3" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 20,-30; 0,0"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="800" cy="150" r="2" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -15,25; 0,0"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="1000" cy="300" r="4" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 25,-20; 0,0"
                dur="10s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          
          {/* Animated Dumbbell 1 */}
          <g transform="translate(100, 150)">
            <rect x="0" y="20" width="8" height="40" rx="4" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-3; 0,0"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="60" y="20" width="8" height="40" rx="4" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-3; 0,0"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="4" y="35" width="60" height="10" rx="5" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-3; 0,0"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
            <circle cx="34" cy="40" r="15" fill="url(#glowGradient)">
              <animate attributeName="opacity" values="0; 0.3; 0" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Animated Dumbbell 2 */}
          <g transform="translate(900, 200) rotate(15)">
            <rect x="0" y="20" width="8" height="40" rx="4" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-4; 0,0"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="60" y="20" width="8" height="40" rx="4" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-4; 0,0"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="4" y="35" width="60" height="10" rx="5" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-4; 0,0"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
          
          {/* Animated Barbell */}
          <g transform="translate(200, 500)">
            <rect x="0" y="45" width="200" height="8" rx="4" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-5; 0,0"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="0" y="20" width="12" height="60" rx="6" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-5; 0,0"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="188" y="20" width="12" height="60" rx="6" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-5; 0,0"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
          
          {/* Animated Apple */}
          <g transform="translate(800, 100)">
            <circle cx="30" cy="30" r="25" fill="#dc2626">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.05,1.05; 1,1"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <path d="M20 15 Q30 5 40 15" stroke="#8b5cf6" strokeWidth="3" fill="none">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 30 15; 5 30 15; 0 30 15"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            <ellipse cx="30" cy="25" rx="15" ry="20" fill="#dc2626">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.05,1.05; 1,1"
                dur="4s"
                repeatCount="indefinite"
              />
            </ellipse>
          </g>
          
          {/* Animated Protein Shake */}
          <g transform="translate(300, 300)">
            <rect x="20" y="10" width="20" height="60" rx="10" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.02,1.02; 1,1"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="22" y="12" width="16" height="56" rx="8" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.02,1.02; 1,1"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="25" y="15" width="10" height="50" rx="5" fill="#ffffff" opacity="0.3">
              <animate attributeName="opacity" values="0.3; 0.6; 0.3" dur="2s" repeatCount="indefinite" />
            </rect>
            <circle cx="30" cy="20" r="3" fill="#8b5cf6">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.2,1.2; 1,1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          
          {/* Animated Heart Rate Line */}
          <g transform="translate(50, 400)">
            <path d="M0,40 Q20,10 40,40 T80,40 T120,40 T160,40 T200,40 T240,40 T280,40 T320,40 T360,40 T400,40 T440,40 T480,40 T520,40 T560,40 T600,40 T640,40 T680,40 T720,40 T760,40 T800,40 T840,40 T880,40 T920,40 T960,40 T1000,40 T1040,40 T1080,40 T1120,40" 
                  stroke="url(#redGradient)" 
                  strokeWidth="3" 
                  fill="none" 
                  opacity="0.8">
              <animate
                attributeName="d"
                values="M0,40 Q20,10 40,40 T80,40 T120,40 T160,40 T200,40 T240,40 T280,40 T320,40 T360,40 T400,40 T440,40 T480,40 T520,40 T560,40 T600,40 T640,40 T680,40 T720,40 T760,40 T800,40 T840,40 T880,40 T920,40 T960,40 T1000,40 T1040,40 T1080,40 T1120,40;M0,40 Q20,20 40,40 T80,40 T120,40 T160,40 T200,40 T240,40 T280,40 T320,40 T360,40 T400,40 T440,40 T480,40 T520,40 T560,40 T600,40 T640,40 T680,40 T720,40 T760,40 T800,40 T840,40 T880,40 T920,40 T960,40 T1000,40 T1040,40 T1080,40 T1120,40;M0,40 Q20,10 40,40 T80,40 T120,40 T160,40 T200,40 T240,40 T280,40 T320,40 T360,40 T400,40 T440,40 T480,40 T520,40 T560,40 T600,40 T640,40 T680,40 T720,40 T760,40 T800,40 T840,40 T880,40 T920,40 T960,40 T1000,40 T1040,40 T1080,40 T1120,40"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="0" cy="40" r="4" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 1120,0; 0,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          
          {/* Animated Muscle Icon */}
          <g transform="translate(1000, 400)">
            <circle cx="40" cy="40" r="35" fill="none" stroke="url(#redGradient)" strokeWidth="4">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.1,1.1; 1,1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <path d="M20 40 Q40 20 60 40 Q40 60 20 40" fill="url(#redGradient)" opacity="0.7">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.05,1.05; 1,1"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="35" cy="35" r="3" fill="#ffffff">
              <animate attributeName="opacity" values="1; 0.5; 1" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="45" cy="35" r="3" fill="#ffffff">
              <animate attributeName="opacity" values="1; 0.5; 1" dur="1s" repeatCount="indefinite" />
            </circle>
            <path d="M30 50 Q40 45 50 50" stroke="#ffffff" strokeWidth="2" fill="none">
              <animate attributeName="opacity" values="1; 0.5; 1" dur="1s" repeatCount="indefinite" />
            </path>
          </g>
          
          {/* Animated Nutrition Plate */}
          <g transform="translate(500, 600)">
            <circle cx="50" cy="50" r="40" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="3">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 50 50; 360 50 50"
                dur="20s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="50" r="35" fill="url(#redGradient)" opacity="0.1">
              <animate attributeName="opacity" values="0.1; 0.3; 0.1" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="40" cy="40" r="8" fill="#8b5cf6">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.1,1.1; 1,1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="60" cy="40" r="8" fill="#10b981">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.1,1.1; 1,1"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="60" r="8" fill="#f59e0b">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.1,1.1; 1,1"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="30" cy="60" r="6" fill="#ef4444">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.1,1.1; 1,1"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="70" cy="60" r="6" fill="#06b6d4">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.1,1.1; 1,1"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          
          {/* Animated Weight Plates */}
          <g transform="translate(150, 650)">
            <rect x="0" y="0" width="20" height="60" rx="10" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-2; 0,0"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="2" y="2" width="16" height="56" rx="8" fill="#ffffff" opacity="0.2">
              <animate attributeName="opacity" values="0.2; 0.4; 0.2" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="30" y="0" width="20" height="60" rx="10" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-2; 0,0"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="32" y="2" width="16" height="56" rx="8" fill="#ffffff" opacity="0.2">
              <animate attributeName="opacity" values="0.2; 0.4; 0.2" dur="2.2s" repeatCount="indefinite" />
            </rect>
            <rect x="60" y="0" width="20" height="60" rx="10" fill="url(#redGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-2; 0,0"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="62" y="2" width="16" height="56" rx="8" fill="#ffffff" opacity="0.2">
              <animate attributeName="opacity" values="0.2; 0.4; 0.2" dur="2.4s" repeatCount="indefinite" />
            </rect>
          </g>
          
          {/* Animated Abstract Shapes */}
          <g transform="translate(700, 500)">
            <polygon points="0,0 30,15 0,30" fill="url(#redGradient)" opacity="0.3">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 15 15; 360 15 15"
                dur="15s"
                repeatCount="indefinite"
              />
            </polygon>
            <polygon points="40,0 70,15 40,30" fill="url(#redGradient)" opacity="0.2">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 55 15; 360 55 15"
                dur="18s"
                repeatCount="indefinite"
              />
            </polygon>
            <polygon points="80,0 110,15 80,30" fill="url(#redGradient)" opacity="0.4">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 95 15; 360 95 15"
                dur="12s"
                repeatCount="indefinite"
              />
            </polygon>
          </g>
          
          {/* Animated Text Elements */}
          <g transform="translate(50, 50)">
            <text x="0" y="0" fontSize="24" fontWeight="bold" fill="url(#redGradient)" opacity="0.2">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.05,1.05; 1,1"
                dur="4s"
                repeatCount="indefinite"
              />
              GAINZ
            </text>
          </g>
          
          <g transform="translate(1000, 700)">
            <text x="0" y="0" fontSize="20" fontWeight="bold" fill="url(#redGradient)" opacity="0.2">
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1,1; 1.05,1.05; 1,1"
                dur="4s"
                repeatCount="indefinite"
              />
              FACTORY
            </text>
          </g>
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center space-y-8">
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-center">
              ¿Listo para transformar tu vida?
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed text-center">
              Descubre el plan perfecto para alcanzar tus objetivos de fitness y nutrición
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/onboarding/welcome"
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Comenzar Ahora
            </Link>
            
            <Link
              href="/ebook"
              className="px-8 py-4 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
            >
              Ver Recetas
            </Link>
          </div>
          
          {/* Stats or features */}
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">100%</div>
              <div className="text-sm text-gray-500">Personalizado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">24/7</div>
              <div className="text-sm text-gray-500">Soporte</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">∞</div>
              <div className="text-sm text-gray-500">Resultados</div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}
