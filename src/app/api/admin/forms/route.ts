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
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener todos los formularios con sus campos
    const forms = await prisma.form.findMany({
      include: {
        fields: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ forms })

  } catch (error) {
    console.error("Error fetching forms:", error)
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
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      isRequired,
      fields
    } = body

    // Crear nuevo formulario con campos usando transacción
    const newForm = await prisma.$transaction(async (tx) => {
      // Crear el formulario
      const form = await tx.form.create({
        data: {
          title,
          description,
          category,
          isRequired: isRequired || false,
          createdBy: decoded.userId
        }
      })

      // Crear los campos si se proporcionan
      if (fields && Array.isArray(fields)) {
        for (const field of fields) {
          await tx.inputField.create({
            data: {
              formId: form.id,
              name: field.name,
              label: field.label,
              type: field.type,
              placeholder: field.placeholder,
              helpText: field.helpText,
              isRequired: field.isRequired || false,
              minLength: field.minLength,
              maxLength: field.maxLength,
              minValue: field.minValue,
              maxValue: field.maxValue,
              pattern: field.pattern,
              options: field.options,
              order: field.order || 0,
              width: field.width
            }
          })
        }
      }

      // Retornar el formulario completo
      return await tx.form.findUnique({
        where: { id: form.id },
        include: {
          fields: {
            orderBy: { order: 'asc' }
          }
        }
      })
    })

    return NextResponse.json({ form: newForm }, { status: 201 })

  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
