"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  HomeIcon, 
  ChartBarIcon, 
  FireIcon, 
  TrophyIcon,
  CalendarIcon,
  UserIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline"
import { cn } from "@/utilities/ui"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl?: string
}

type NavigationItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Hábitos", href: "/dashboard/habits", icon: ChartBarIcon },
  { name: "Desafíos", href: "/dashboard/challenges", icon: TrophyIcon },
  { name: "Recetas", href: "/dashboard/recipes", icon: BookOpenIcon },
  { name: "Entrenamientos", href: "/dashboard/workouts", icon: FireIcon },
  { name: "Media", href: "/dashboard/media", icon: VideoCameraIcon },
  { name: "Blog", href: "/dashboard/blog", icon: DocumentTextIcon },
  { name: "Calendario", href: "/dashboard/calendar", icon: CalendarIcon },
  { name: "Progreso", href: "/dashboard/progress", icon: ChartBarIcon },
  { name: "Perfil", href: "/dashboard/profile", icon: UserIcon },
  { name: "Configuración", href: "/dashboard/settings", icon: CogIcon },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("user")
      
      if (!token || !userData) {
        router.push("/signin")
        return
      }
      
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        router.push("/signin")
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/signin")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800">
          <SidebarContent 
            user={user} 
            navigation={navigation} 
            pathname={pathname}
            onLogout={handleLogout}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex-1 bg-gray-900 border-r border-gray-800">
          <SidebarContent 
            user={user} 
            navigation={navigation} 
            pathname={pathname}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header for mobile */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            className="text-white hover:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-white font-bold">GAINZ FACTORY</span>
          </Link>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
  }

function SidebarContent({ 
  user, 
  navigation, 
  pathname, 
  onLogout, 
  onClose 
}: {
  user: User
  navigation: NavigationItem[]
  pathname: string
  onLogout: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="text-white">
              <div className="font-bold text-lg">GAINZ</div>
              <div className="text-red-500 text-sm font-semibold">FACTORY</div>
            </div>
          </Link>
          {onClose && (
            <button
              type="button"
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* User info */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.firstName}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <span className="text-white font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            )}
          </div>
          <div className="text-white">
            <div className="font-semibold">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-gray-400">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-red-500 text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
} 