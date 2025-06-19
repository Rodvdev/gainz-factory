import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs, resolvers } from '@/lib/graphql/growth/queries';
import { db } from '@/lib/db';
import { GraphQLContext } from '@/lib/graphql/growth/types';

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (): Promise<GraphQLContext> => {
    // En un entorno real, estos valores vendrían de la autenticación/sesión
    return {
      db,
      tenantId: process.env.TENANT_ID || 'default-tenant',
      user: {
        id: process.env.USER_ID || 'default-user',
        email: 'user@example.com',
      },
    };
  },
});

export { handler as GET, handler as POST }; 