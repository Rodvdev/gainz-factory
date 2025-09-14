import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient()

async function exportRecipes() {
  try {
    console.log('🔍 Fetching all recipes from database...')

    // Get all recipes from the database
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 Found ${recipes.length} recipes`)

    if (recipes.length === 0) {
      console.log('⚠️  No recipes found in database')
      return
    }

    // Convert dates to ISO strings for JSON serialization
    const recipesWithSerializedDates = recipes.map(recipe => ({
      ...recipe,
      createdAt: recipe.createdAt.toISOString()
    }))

    // Create the output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const filename = `recipes-export-${timestamp}.json`
    const filepath = path.join(outputDir, filename)

    // Write recipes to JSON file
    fs.writeFileSync(filepath, JSON.stringify(recipesWithSerializedDates, null, 2))

    console.log(`✅ Successfully exported ${recipes.length} recipes to: ${filepath}`)
    
    // Also create a summary
    const summary = {
      exportDate: new Date().toISOString(),
      totalRecipes: recipes.length,
      recipesByLevel: {
        BEGINNER: recipes.filter(r => r.level === 'BEGINNER').length,
        INTERMEDIATE: recipes.filter(r => r.level === 'INTERMEDIATE').length,
        ADVANCED: recipes.filter(r => r.level === 'ADVANCED').length,
        NULL: recipes.filter(r => r.level === null).length
      },
      recipesByPremium: {
        premium: recipes.filter(r => r.isPremium).length,
        free: recipes.filter(r => !r.isPremium).length
      },
      objectives: [...new Set(recipes.map(r => r.objective).filter(Boolean))],
      filename: filename
    }

    const summaryPath = path.join(outputDir, `recipes-summary-${timestamp}.json`)
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
    
    console.log(`📋 Summary saved to: ${summaryPath}`)
    console.log('📈 Summary:', summary)

  } catch (error) {
    console.error('❌ Error exporting recipes:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  exportRecipes()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { exportRecipes }
