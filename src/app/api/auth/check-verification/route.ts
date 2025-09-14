import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      )
    }

    // Check if user exists and is verified
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { 
        id: true, 
        email: true, 
        emailVerified: true,
        isActive: true 
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Usuario inactivo" },
        { status: 400 }
      )
    }

    // For demo purposes, we'll auto-verify emails
    // In production, you would check actual email verification status
    const isVerified = !!user.emailVerified

    if (!isVerified) {
      // Auto-verify for demo (in production, remove this)
      await db.user.update({
        where: { id: user.id },
        data: { 
          emailVerified: new Date(),
          emailVerifiedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      verified: true,
      userId: user.id,
      email: user.email
    })
    
  } catch (error) {
    console.error("Error checking verification:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
