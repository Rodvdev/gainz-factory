import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id: challengeId } = await params
    const body = await request.json()
    const { currentValue } = body

    // Validate input
    if (typeof currentValue !== 'number' || currentValue < 0) {
      return NextResponse.json(
        { error: "currentValue debe ser un número positivo" },
        { status: 400 }
      )
    }

    // Find the challenge
    const existingChallenge = await db.challenge.findFirst({
      where: {
        id: challengeId,
        userId: user.id
      }
    })

    if (!existingChallenge) {
      return NextResponse.json(
        { error: "Desafío no encontrado" },
        { status: 404 }
      )
    }

    // Check if challenge is still active
    const today = new Date()
    const endDate = new Date(existingChallenge.endDate)
    
    if (today > endDate && !existingChallenge.isCompleted) {
      return NextResponse.json(
        { error: "El desafío ya ha expirado" },
        { status: 400 }
      )
    }

    // Update challenge
    const updatedChallenge = await db.challenge.update({
      where: { id: challengeId },
      data: {
        currentValue,
        isCompleted: currentValue >= existingChallenge.targetValue
      }
    })

    return NextResponse.json({
      challenge: {
        id: updatedChallenge.id,
        name: updatedChallenge.name,
        description: updatedChallenge.description,
        category: updatedChallenge.category,
        startDate: updatedChallenge.startDate,
        endDate: updatedChallenge.endDate,
        targetValue: updatedChallenge.targetValue,
        currentValue: updatedChallenge.currentValue,
        isCompleted: updatedChallenge.isCompleted,
        reward: updatedChallenge.reward
      }
    })
    
  } catch (error) {
    console.error("Error updating challenge:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id: challengeId } = await params

    // Find the challenge
    const existingChallenge = await db.challenge.findFirst({
      where: {
        id: challengeId,
        userId: user.id
      }
    })

    if (!existingChallenge) {
      return NextResponse.json(
        { error: "Desafío no encontrado" },
        { status: 404 }
      )
    }

    // Delete challenge
    await db.challenge.delete({
      where: { id: challengeId }
    })

    return NextResponse.json({ message: "Desafío eliminado correctamente" })
    
  } catch (error) {
    console.error("Error deleting challenge:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
