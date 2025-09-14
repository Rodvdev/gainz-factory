import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Obtener el formulario específico
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    })

    if (!form) {
      return NextResponse.json({ error: "Formulario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ form })

  } catch (error) {
    console.error("Error fetching form:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      isActive,
      fields
    } = body

    // Actualizar formulario usando transacción
    const updatedForm = await prisma.$transaction(async (tx) => {
      // Actualizar datos básicos del formulario
      await tx.form.update({
        where: { id },
        data: {
          title,
          description,
          category,
          isRequired,
          isActive
        }
      })

      // Si se proporcionan campos, actualizar la estructura del formulario
      if (fields && Array.isArray(fields)) {
        // Eliminar campos existentes
        await tx.inputField.deleteMany({
          where: { formId: id }
        })

        // Crear nuevos campos
        for (const field of fields) {
          await tx.inputField.create({
            data: {
              formId: id,
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

      // Retornar el formulario actualizado
      return await tx.form.findUnique({
        where: { id },
        include: {
          fields: {
            orderBy: { order: 'asc' }
          }
        }
      })
    })

    return NextResponse.json({ form: updatedForm })

  } catch (error) {
    console.error("Error updating form:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Eliminar el formulario (esto eliminará en cascada los campos y envíos)
    await prisma.form.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Formulario eliminado exitosamente" })

  } catch (error) {
    console.error("Error deleting form:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
