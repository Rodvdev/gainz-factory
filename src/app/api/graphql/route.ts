import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs, resolvers } from '@/lib/graphql/growth/queries';
import { PUBLIC_SCHEMA } from '@/lib/graphql/public-schema';
import { publicResolvers } from '@/lib/graphql/public-resolvers';
import { db } from '@/lib/db';
import { getCurrentUser, createDemoUser } from '@/lib/auth';
import { GraphQLContext } from '@/lib/graphql/growth/types';

const server = new ApolloServer<GraphQLContext>({
  typeDefs: [typeDefs, PUBLIC_SCHEMA],
  resolvers: [resolvers, publicResolvers],
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (): Promise<GraphQLContext> => {
    try {
      // Try to get the current authenticated user
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        return {
          db,
          user: currentUser,
        };
      }
      
      // For development and public queries, use demo user
      console.log('No authenticated user found, using demo user for GraphQL context');
      
      return {
        db,
        user: createDemoUser(),
      };
    } catch (error) {
      console.warn('Error in GraphQL context creation, using demo user:', error);
      
      return {
        db,
        user: createDemoUser(),
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