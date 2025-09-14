"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeftIcon,
  BellIcon, 
  MagnifyingGlassIcon, 
  UserIcon,
  CogIcon,
  Bars3Icon,
  HomeIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl?: string
  role?: string
}

interface AdminTopNavBarProps {
  user: User
  onMenuToggle: () => void
  showMenuButton?: boolean
  title?: string
  subtitle?: string
}

export default function AdminTopNavBar({ 
  user, 
  onMenuToggle, 
  showMenuButton = false,
  title,
  subtitle 
}: AdminTopNavBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <div className="bg-red-600 backdrop-blur-sm border-b-2 border-red-700 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Back to user dashboard and title */}
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg text-white hover:text-red-100 hover:bg-red-700 transition-colors duration-200 lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
            
            <div className="flex items-center gap-3">
              {/* Back to user dashboard */}
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 p-2 rounded-lg text-white hover:text-red-100 hover:bg-red-700 transition-colors duration-200 group"
                title="Volver al Dashboard de Usuario"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">Dashboard Usuario</span>
              </Link>
              
              <div className="h-6 w-px bg-red-400"></div>
              
              <Link href="/admin" className="flex items-center gap-3 group">
                <div className="relative">
                  <Image
                    src="/logo.jpeg"
                    alt="Gainz Factory Admin"
                    width={32}
                    height={32}
                    className="rounded-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-lg text-white group-hover:text-red-100 transition-colors duration-200">
                    GAINZ
                  </div>
                  <div className="text-red-100 text-sm font-semibold -mt-1">
                    ADMIN
                  </div>
                </div>
              </Link>
              
              {title && (
                <div className="hidden md:block ml-4 pl-4 border-l border-red-400">
                  <h1 className="text-xl font-bold text-white">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-red-100">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300" />
              <input
                type="text"
                placeholder="Buscar en el admin..."
                className="w-full pl-10 pr-4 py-2 border border-red-400 rounded-lg focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-gray-900 placeholder-red-400 bg-white"
              />
            </div>
          </div>

          {/* Right side - Notifications and User menu */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="p-2 rounded-lg text-white hover:text-red-100 hover:bg-red-700 transition-colors duration-200 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-white text-red-600 text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
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
                  <div className="text-sm font-medium text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-red-100">
                    {user.email}
                  </div>
                </div>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <>
                  {/* Overlay to close menu when clicking outside */}
                  <div 
                    className="fixed inset-0 z-[9997]" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border-2 border-gray-200 shadow-2xl z-[9998] transform translate-y-0 animate-in slide-in-from-top-2 duration-200">
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
                          <div className="text-xs text-red-600 font-medium">Administrador</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HomeIcon className="h-5 w-5" />
                        Dashboard Usuario
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserIcon className="h-5 w-5" />
                        Mi Perfil
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <CogIcon className="h-5 w-5" />
                        Configuración Admin
                      </Link>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
