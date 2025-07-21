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
      // Get the current authenticated user from the request
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        return {
          db,
          user: {
            ...currentUser,
            bio: currentUser.bio || undefined,
            phoneNumber: currentUser.phoneNumber || undefined,
            profileImageUrl: currentUser.profileImageUrl || undefined,
          },
        };
      }
      
      // If no authenticated user, return context without user
      console.log('No authenticated user found for GraphQL context');
      
      return {
        db,
        user: null,
      };
    } catch (error) {
      console.warn('Error in GraphQL context creation:', error);
      
      return {
        db,
        user: null,
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