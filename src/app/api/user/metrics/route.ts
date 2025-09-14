import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as jwt from "jsonwebtoken"

const prisma = new PrismaClient()

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

    // Agrupar métricas por tipo y calcular tendencias
    const metricsMap = new Map()
    
    for (const metric of recentMetrics) {
      if (!metricsMap.has(metric.metricType)) {
        metricsMap.set(metric.metricType, [])
      }
      metricsMap.get(metric.metricType).push(metric)
    }

    // Calcular tendencias para cada tipo de métrica
    const metrics = []
    
    for (const [metricType, values] of metricsMap) {
      if (values.length < 2) continue // Necesitamos al menos 2 valores para calcular tendencia
      
      const latest = values[0]
      const previous = values[1]
      
      const change = previous.value > 0 ? 
        ((latest.value - previous.value) / previous.value) * 100 : 0
      
      const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      
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
        default:
          label = metricType.charAt(0).toUpperCase() + metricType.slice(1)
      }
      
      metrics.push({
        type: metricType,
        label,
        value: latest.value,
        unit: latest.unit,
        change: Math.abs(change),
        trend,
        date: latest.date
      })
    }

    // Ordenar por fecha más reciente
    metrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Si no hay métricas, devolver métricas por defecto
    if (metrics.length === 0) {
      return NextResponse.json({
        metrics: [
          {
            type: 'weight',
            label: 'Peso',
            value: 0,
            unit: 'kg',
            change: 0,
            trend: 'neutral',
            date: new Date().toISOString()
          },
          {
            type: 'body_fat',
            label: 'Grasa Corporal',
            value: 0,
            unit: '%',
            change: 0,
            trend: 'neutral',
            date: new Date().toISOString()
          }
        ]
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
