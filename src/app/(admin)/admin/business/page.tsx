"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Building2, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Calendar,
  BarChart3,
  Settings
} from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  billingCycle: string
  duration?: number
  features: string[]
  isActive: boolean
  isPopular: boolean
  maxUsers?: number
  maxProgrammes?: number
  _count: {
    subscriptions: number
    orders: number
  }
}

interface Product {
  id: string
  name: string
  description?: string
  category: string
  price: number
  currency: string
  sku?: string
  stock?: number
  isActive: boolean
  isDigital: boolean
  imageUrl?: string
  images: string[]
  _count: {
    orderItems: number
  }
}

interface BusinessService {
  id: string
  name: string
  description?: string
  category: string
  price: number
  currency: string
  duration?: number
  isActive: boolean
  isOnline: boolean
  maxParticipants?: number
  requirements: string[]
  _count: {
    orderItems: number
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentStatus: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  createdAt: string
  _count: {
    items: number
  }
}

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'products' | 'services' | 'orders'>('plans')
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<BusinessService[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      
      // Fetch all business data
      const [plansRes, productsRes, servicesRes, ordersRes] = await Promise.all([
        fetch("/api/admin/business/plans", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/admin/business/products", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/admin/business/services", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/admin/business/orders", { headers: { "Authorization": `Bearer ${token}` } })
      ])

      if (plansRes.ok) {
        const data = await plansRes.json()
        setPlans(data.plans || [])
      }
      
      if (productsRes.ok) {
        const data = await productsRes.json()
        setProducts(data.products || [])
      }
      
      if (servicesRes.ok) {
        const data = await servicesRes.json()
        setServices(data.services || [])
      }
      
      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Error fetching business data:", error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'plans', label: 'Planes', icon: CreditCard, count: plans.length },
    { id: 'products', label: 'Productos', icon: Package, count: products.length },
    { id: 'services', label: 'Servicios', icon: Users, count: services.length },
    { id: 'orders', label: 'Órdenes', icon: ShoppingCart, count: orders.length }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'paid':
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pendiente'
      case 'confirmed': return 'Confirmado'
      case 'processing': return 'Procesando'
      case 'shipped': return 'Enviado'
      case 'delivered': return 'Entregado'
      case 'cancelled': return 'Cancelado'
      case 'refunded': return 'Reembolsado'
      case 'active': return 'Activo'
      case 'paid': return 'Pagado'
      case 'failed': return 'Fallido'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
          <p className="text-gray-600 mt-2">Gestiona planes, productos, servicios y órdenes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Planes Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Servicios</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Órdenes Totales</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Planes de Suscripción</h2>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Plan</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-2 rounded-xl p-6 ${plan.isPopular ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  >
                    {plan.isPopular && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-4">
                        POPULAR
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.billingCycle}</span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {plan._count.subscriptions} suscriptores
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Productos</h2>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <span className={`
                          text-xs px-2 py-1 rounded-full
                          ${product.isDigital ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                        `}>
                          {product.isDigital ? 'Digital' : 'Físico'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.stock !== null && (
                          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {product._count.orderItems} ventas
                        </span>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Servicios</h2>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Servicio</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${service.isOnline ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                      `}>
                        {service.isOnline ? 'Online' : 'Presencial'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">${service.price}</span>
                      {service.duration && (
                        <span className="text-sm text-gray-600">{service.duration} min</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Categoría:</strong> {service.category}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {service._count.orderItems} ventas
                      </span>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Órdenes</h2>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Reportes</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pago
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order._count.items} items
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user.firstName} {order.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{order.user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                            {getStatusLabel(order.paymentStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
