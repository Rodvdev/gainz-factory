import { GraphQLContext, NewHabitInput, UpdateHabitInput } from './types';

// growth/queries.ts
export const typeDefs = `#graphql
  enum HabitFrequency { DAILY WEEKLY MONTHLY }
  enum EntryStatus { COMPLETED SKIPPED PARTIAL FAILED }

  type Habit {
    id: ID!
    name: String!
    description: String
    frequency: HabitFrequency!
    targetCount: Int!
    isActive: Boolean!
    order: Int!
    entries: [HabitEntry!]!
    createdAt: String!
    updatedAt: String!
  }

  type HabitEntry {
    id: ID!
    habitId: ID!
    date: String!
    status: EntryStatus!
    note: String
    createdAt: String!
  }

  type Query {
    myHabits: [Habit!]!
    habitEntries(habitId: ID!): [HabitEntry!]!
    habitWithEntries(habitId: ID!): Habit
  }

  input NewHabitInput {
    name: String!
    frequency: HabitFrequency!
    description: String
    targetCount: Int
  }

  input UpdateHabitInput {
    name: String
    description: String
    frequency: HabitFrequency
    targetCount: Int
    isActive: Boolean
    order: Int
  }

  type Mutation {
    createHabit(input: NewHabitInput!): Habit!
    updateHabit(id: ID!, input: UpdateHabitInput!): Habit!
    deleteHabit(id: ID!): Boolean!
    logHabitEntry(habitId: ID!, date: String!, status: EntryStatus!, note: String): HabitEntry!
    deleteHabitEntry(id: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    myHabits: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.habit.findMany({
        where: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
        },
        include: {
          entries: {
            orderBy: {
              date: 'desc'
            },
            take: 30 // Last 30 entries
          }
        },
        orderBy: {
          order: 'asc'
        }
      });
    },
    habitEntries: async (_parent: unknown, { habitId }: { habitId: string }, ctx: GraphQLContext) => {
      return ctx.db.habitEntry.findMany({
        where: {
          habitId,
          tenantId: ctx.tenantId,
        },
        orderBy: {
          date: 'desc'
        }
      });
    },
    habitWithEntries: async (_parent: unknown, { habitId }: { habitId: string }, ctx: GraphQLContext) => {
      return ctx.db.habit.findUnique({
        where: {
          id: habitId,
        },
        include: {
          entries: {
            orderBy: {
              date: 'desc'
            }
          }
        }
      });
    },
  },
  Mutation: {
    createHabit: async (_parent: unknown, { input }: { input: NewHabitInput }, ctx: GraphQLContext) => {
      return ctx.db.habit.create({
        data: {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          ...input,
        },
      });
    },
    updateHabit: async (_parent: unknown, { id, input }: { id: string, input: UpdateHabitInput }, ctx: GraphQLContext) => {
      return ctx.db.habit.update({
        where: {
          id,
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
        },
        data: input,
      });
    },
    deleteHabit: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await ctx.db.habit.delete({
        where: {
          id,
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
        },
      });
      return true;
    },
    logHabitEntry: async (_parent: unknown, { habitId, date, status, note }: { habitId: string, date: string, status: string, note?: string }, ctx: GraphQLContext) => {
      return ctx.db.habitEntry.upsert({
        where: {
          habitId_date: {
            habitId,
            date: new Date(date),
          },
        },
        update: { status, note },
        create: {
          habitId,
          tenantId: ctx.tenantId,
          date: new Date(date),
          status,
          note,
        },
      });
    },
    deleteHabitEntry: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await ctx.db.habitEntry.delete({
        where: {
          id,
          tenantId: ctx.tenantId,
        },
      });
      return true;
    },
  },
}; 