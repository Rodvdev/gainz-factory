import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import * as jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // Obtener métricas recientes del usuario
    const recentMetrics = await prisma.progressMetrics.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        date: 'desc'
      },
      take: 20 // Últimas 20 métricas
    })

    console.log(`Found ${recentMetrics.length} metrics for user ${decoded.userId}`)
    console.log('Raw metrics:', recentMetrics)

    // Procesar métricas directamente sin agrupar
    const metrics = recentMetrics.map((metric: { metricType: string; id: string; value: number; unit: string; date: Date; notes?: string | null; photoUrl?: string | null }) => {
      // Determinar etiqueta amigable
      let label = metric.metricType
      switch (metric.metricType.toLowerCase()) {
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
          label = metric.metricType.charAt(0).toUpperCase() + metric.metricType.slice(1)
      }
      
      return {
        id: metric.id,
        type: metric.metricType,
        label,
        value: metric.value,
        unit: metric.unit,
        change: 0, // Por ahora sin cálculo de tendencia
        trend: 'neutral',
        date: metric.date,
        notes: metric.notes,
        photoUrl: metric.photoUrl
      }
    })

    // Ordenar por fecha más reciente
    metrics.sort((a: { date: Date }, b: { date: Date }) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log(`Processed ${metrics.length} metrics for response`)
    console.log('Final metrics:', metrics)

    // Si no hay métricas, devolver array vacío para mostrar estado inicial
    if (metrics.length === 0) {
      console.log('No metrics found, returning empty array')
      return NextResponse.json({
        metrics: [],
        message: "No hay métricas registradas. ¡Comienza registrando tu primera métrica!"
      })
    }

    return NextResponse.json({ metrics })

  } catch (error) {
    console.error("Error fetching user metrics:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    const body = await request.json()
    const {
      type,
      value,
      unit,
      date,
      notes,
      photoUrl
    } = body

    // Crear nueva métrica
    const newMetric = await prisma.progressMetrics.create({
      data: {
        userId: decoded.userId,
        metricType: type,
        value,
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
  } finally {
    await prisma.$disconnect()
  }
}
