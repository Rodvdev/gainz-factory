"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess("¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...")
        setTimeout(() => {
          router.push("/signin")
        }, 2000)
      } else {
        setError(data.error || "Error al crear la cuenta")
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory Logo"
              width={60}
              height={60}
              className="rounded-full border-2 border-red-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">GAINZ FACTORY</h1>
              <p className="text-red-500 text-sm">Transformation OS</p>
            </div>
          </div>
          <h2 className="text-xl text-gray-300">Comienza tu transformación</h2>
        </div>

        {/* Form */}
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Tu apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none transition-colors"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white p-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <Link href="/signin" className="text-red-500 hover:text-red-400 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 