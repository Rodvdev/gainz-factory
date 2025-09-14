import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(
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
    
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar que el formulario existe y está activo
    const form = await prisma.form.findUnique({
      where: { 
        id,
        isActive: true
      },
      include: {
        fields: true
      }
    })

    if (!form) {
      return NextResponse.json({ error: "Formulario no encontrado o inactivo" }, { status: 404 })
    }

    // Verificar si el usuario ya envió este formulario
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: {
        userId_formId: {
          userId: decoded.userId,
          formId: id
        }
      }
    })

    if (existingSubmission) {
      return NextResponse.json({ error: "Ya has enviado este formulario" }, { status: 400 })
    }

    const body = await request.json()
    const { data, files } = body

    // Validar los datos del formulario
    const validationErrors = []
    
    for (const field of form.fields) {
      const fieldValue = data[field.name]
      
      // Validar campos requeridos
      if (field.isRequired && (!fieldValue || fieldValue === "")) {
        validationErrors.push(`${field.label} es requerido`)
        continue
      }

      // Validar longitud mínima
      if (field.minLength && fieldValue && fieldValue.length < field.minLength) {
        validationErrors.push(`${field.label} debe tener al menos ${field.minLength} caracteres`)
      }

      // Validar longitud máxima
      if (field.maxLength && fieldValue && fieldValue.length > field.maxLength) {
        validationErrors.push(`${field.label} no puede tener más de ${field.maxLength} caracteres`)
      }

      // Validar valor mínimo
      if (field.minValue && fieldValue && parseFloat(fieldValue) < field.minValue) {
        validationErrors.push(`${field.label} debe ser mayor o igual a ${field.minValue}`)
      }

      // Validar valor máximo
      if (field.maxValue && fieldValue && parseFloat(fieldValue) > field.maxValue) {
        validationErrors.push(`${field.label} debe ser menor o igual a ${field.maxValue}`)
      }

      // Validar patrón regex
      if (field.pattern && fieldValue && !new RegExp(field.pattern).test(fieldValue)) {
        validationErrors.push(`${field.label} no tiene el formato correcto`)
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: "Errores de validación",
        details: validationErrors
      }, { status: 400 })
    }

    // Crear el envío del formulario
    const submission = await prisma.formSubmission.create({
      data: {
        formId: id,
        userId: decoded.userId,
        data: data,
        files: files || [],
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown"
      },
      include: {
        form: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: "Formulario enviado exitosamente",
      submission 
    }, { status: 201 })

  } catch (error) {
    console.error("Error submitting form:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
