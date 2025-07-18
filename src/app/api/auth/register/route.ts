import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()
    
    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe con este email" },
        { status: 400 }
      )
    }
    
    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        isActive: true,
        emailVerified: new Date(), // For now, auto-verify
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user
    }, { status: 201 })
    
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
} 