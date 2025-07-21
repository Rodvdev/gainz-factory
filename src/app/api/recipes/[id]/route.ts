import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

// GET /api/recipes/[id] - Get single recipe
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const recipe = await db.recipe.findUnique({
      where: { id }
    })

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json(
      { error: 'Error fetching recipe' },
      { status: 500 }
    )
  }
}

// PUT /api/recipes/[id] - Update recipe
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json()
    const { title, description, objective, level, isPremium, imageUrl, videoUrl } = body

    const recipe = await db.recipe.update({
      where: { id },
      data: {
        title,
        description,
        objective,
        level,
        isPremium,
        imageUrl,
        videoUrl
      }
    })

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json(
      { error: 'Error updating recipe' },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes/[id] - Delete recipe
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.recipe.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json(
      { error: 'Error deleting recipe' },
      { status: 500 }
    )
  }
} 