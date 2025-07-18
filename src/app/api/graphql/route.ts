import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs, resolvers } from '@/lib/graphql/growth/queries';
import { PUBLIC_SCHEMA } from '@/lib/graphql/public-schema';
import { publicResolvers } from '@/lib/graphql/public-resolvers';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { GraphQLContext } from '@/lib/graphql/growth/types';

const server = new ApolloServer<GraphQLContext>({
  typeDefs: [typeDefs, PUBLIC_SCHEMA],
  resolvers: [resolvers, publicResolvers],
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (): Promise<GraphQLContext> => {
    try {
      // Obtener el usuario actual del sistema de autenticación
      const currentUser = await getCurrentUser();
      
      return {
        db,
        user: currentUser,
      };
    } catch (error) {
      // Para queries que no requieren autenticación (como users, authenticateUser)
      // usamos un usuario fallback temporal
      console.warn('Usuario no autenticado, usando contexto temporal:', error);
      
      return {
        db,
        user: {
          id: 'temp-user',
          email: 'temp@temp.com',
          firstName: 'Temporal',
          lastName: 'User',
        },
      };
    }
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
} 