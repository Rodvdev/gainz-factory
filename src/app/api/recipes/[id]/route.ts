import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/recipes/[id] - Get single recipe
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await db.recipe.findUnique({
      where: { id: params.id }
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, objective, level, isPremium, imageUrl, videoUrl } = body

    const recipe = await db.recipe.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    await db.recipe.delete({
      where: { id: params.id }
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