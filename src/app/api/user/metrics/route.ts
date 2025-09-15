import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }
    
    // Obtener métricas recientes del usuario
    const recentMetrics = await db.progressMetrics.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        date: 'desc'
      },
      take: 20 // Últimas 20 métricas
    })

    console.log(`Found ${recentMetrics.length} metrics for user ${user.id}`)

    // Agrupar métricas por tipo y obtener la más reciente de cada tipo
    const latestMetrics = new Map()
    
    for (const metric of recentMetrics) {
      if (!latestMetrics.has(metric.metricType)) {
        latestMetrics.set(metric.metricType, { latest: metric, previous: null })
      } else {
        const existing = latestMetrics.get(metric.metricType)
        if (!existing.previous) {
          existing.previous = metric
        }
      }
    }

    // Procesar métricas agrupadas por tipo
    const processedMetrics = []
    
    for (const [metricType, { latest, previous }] of latestMetrics) {
      // Determinar etiqueta amigable
      let label = metricType
      switch (metricType.toLowerCase()) {
        case 'weight':
          label = 'Peso'
          break
        case 'body_fat':
          label = 'Grasa Corporal'
          break
        case 'muscle_mass':
          label = 'Masa Muscular'
          break
        case 'waist':
          label = 'Cintura'
          break
        case 'chest':
          label = 'Pecho'
          break
        case 'biceps':
          label = 'Bíceps'
          break
        case 'thigh':
          label = 'Muslo'
          break
        case 'height':
          label = 'Altura'
          break
        default:
          label = metricType.charAt(0).toUpperCase() + metricType.slice(1)
      }
      
      // Calcular progreso si hay métrica anterior
      let change = 0
      let trend = 'neutral'
      
      if (previous) {
        change = previous.value > 0 ? 
          ((latest.value - previous.value) / previous.value) * 100 : 0
        trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      }
      
      processedMetrics.push({
        id: latest.id,
        type: metricType,
        label,
        value: latest.value,
        unit: latest.unit,
        change: Math.abs(change),
        trend,
        date: latest.date,
        notes: latest.notes,
        photoUrl: latest.photoUrl
      })
    }

    // Ordenar por fecha más reciente
    processedMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log(`Processed ${processedMetrics.length} metrics for response`)

    // Si no hay métricas, devolver array vacío para mostrar estado inicial
    if (processedMetrics.length === 0) {
      console.log('No metrics found, returning empty array')
      return NextResponse.json({
        metrics: [],
        message: "No hay métricas registradas. ¡Comienza registrando tu primera métrica!"
      })
    }

    return NextResponse.json({ metrics: processedMetrics })

  } catch (error) {
    console.error("Error fetching user metrics:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const {
      type,
      value,
      unit,
      date,
      notes,
      photoUrl
    } = body

    // Validate required fields
    if (!type || value === undefined || !unit || !date) {
      return NextResponse.json(
        { error: "Campos requeridos: type, value, unit, date" },
        { status: 400 }
      )
    }

    // Crear nueva métrica
    const newMetric = await db.progressMetrics.create({
      data: {
        userId: user.id,
        metricType: type,
        value: parseFloat(value),
        unit,
        date: new Date(date),
        notes,
        photoUrl
      }
    })

    return NextResponse.json({ metric: newMetric }, { status: 201 })

  } catch (error) {
    console.error("Error creating metric:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
