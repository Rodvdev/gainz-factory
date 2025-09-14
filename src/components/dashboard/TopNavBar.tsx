"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  UserIcon,
  CogIcon,
  Bars3Icon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl?: string
  role?: string
}

interface TopNavBarProps {
  user: User
  onMenuToggle: () => void
  showMenuButton?: boolean
  title?: string
  subtitle?: string
}

export default function TopNavBar({ 
  user, 
  onMenuToggle, 
  showMenuButton = false,
  title,
  subtitle 
}: TopNavBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  // Debug: Log user role
  console.log('TopNavBar - User role:', user?.role)

  return (
    <div className="bg-white backdrop-blur-sm border-b-2 border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and title */}
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="relative">
                  <Image
                    src="/logo.jpeg"
                    alt="Gainz Factory"
                    width={32}
                    height={32}
                    className="rounded-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                    GAINZ
                  </div>
                  <div className="text-red-600 text-sm font-semibold -mt-1">
                    FACTORY
                  </div>
                </div>
              </Link>
              
              {title && (
                <div className="hidden md:block ml-4 pl-4 border-l border-gray-200">
                  <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-gray-600">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en el dashboard..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Right side - Notifications and User menu */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  {user.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.firstName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-red-600 font-bold text-sm">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>
                </div>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border-2 border-gray-200 shadow-2xl z-[9998]">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        {user.profileImageUrl ? (
                          <Image
                            src={user.profileImageUrl}
                            alt={user.firstName}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-red-600 font-bold text-lg">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      Mi Perfil
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <CogIcon className="h-5 w-5" />
                      Configuración
                    </Link>
                    {/* Debug: Show role info */}
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">
                      Role: {user.role || 'undefined'}
                    </div>
                    
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 border-l-2 border-red-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShieldCheckIcon className="h-5 w-5" />
                        Panel de Administración
                      </Link>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        localStorage.removeItem("authToken")
                        localStorage.removeItem("user")
                        window.location.href = "/signin"
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
