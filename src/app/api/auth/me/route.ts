import { NextRequest, NextResponse } from "next/server"
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

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      personalManifesto: user.personalManifesto,
      fitnessLevel: user.fitnessLevel,
      primaryGoals: user.primaryGoals,
      bio: user.bio,
      profileImageUrl: user.profileImageUrl
    })
    
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
