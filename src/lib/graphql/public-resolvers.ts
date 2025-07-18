import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const publicResolvers = {
  Query: {
    // Obtener recetas públicas (no premium)
    publicRecipes: async () => {
      try {
        const recipes = await prisma.recipe.findMany({
          where: {
            isPremium: false
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        return recipes.map(recipe => ({
          ...recipe,
          createdAt: recipe.createdAt.toISOString()
        }));
      } catch (error) {
        console.error('Error fetching public recipes:', error);
        throw new Error('Failed to fetch public recipes');
      }
    },

    // Obtener todas las recetas (incluyendo premium)
    allRecipes: async () => {
      try {
        const recipes = await prisma.recipe.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        return recipes.map(recipe => ({
          ...recipe,
          createdAt: recipe.createdAt.toISOString()
        }));
      } catch (error) {
        console.error('Error fetching all recipes:', error);
        throw new Error('Failed to fetch recipes');
      }
    },

    // Obtener receta por ID
    recipe: async (_: unknown, { id }: { id: string }) => {
      try {
        const recipe = await prisma.recipe.findUnique({
          where: { id }
        });
        
        if (!recipe) {
          throw new Error('Recipe not found');
        }
        
        return {
          ...recipe,
          createdAt: recipe.createdAt.toISOString()
        };
      } catch (error) {
        console.error('Error fetching recipe:', error);
        throw new Error('Failed to fetch recipe');
      }
    },

    // Obtener coaches visibles
    visibleCoaches: async () => {
      try {
        const coaches = await prisma.coach.findMany({
          where: {
            isVisible: true
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                bio: true,
                profileImageUrl: true,
                isActive: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        return coaches.map(coach => ({
          ...coach,
          createdAt: coach.createdAt.toISOString()
        }));
      } catch (error) {
        console.error('Error fetching visible coaches:', error);
        throw new Error('Failed to fetch coaches');
      }
    },

    // Obtener coach por ID
    coach: async (_: unknown, { id }: { id: string }) => {
      try {
        const coach = await prisma.coach.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                bio: true,
                profileImageUrl: true,
                isActive: true
              }
            }
          }
        });
        
        if (!coach) {
          throw new Error('Coach not found');
        }
        
        return {
          ...coach,
          createdAt: coach.createdAt.toISOString()
        };
      } catch (error) {
        console.error('Error fetching coach:', error);
        throw new Error('Failed to fetch coach');
      }
    }
  }
}; 