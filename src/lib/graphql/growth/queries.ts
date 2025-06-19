import { GraphQLContext, Habit, HabitCategory, HabitEntry, HabitEntryInput, HabitStreak, NewChallengeInput, NewHabitInput, UpdateHabitInput } from './types';

// growth/queries.ts
export const typeDefs = `#graphql
  enum HabitFrequency { DAILY WEEKLY MONTHLY }
  enum EntryStatus { COMPLETED SKIPPED PARTIAL FAILED }
  enum HabitCategory { 
    MORNING_ROUTINE 
    PHYSICAL_TRAINING 
    NUTRITION 
    DEEP_WORK 
    PERSONAL_DEVELOPMENT 
    SOCIAL_CHARISMA 
    REFLECTION 
    SLEEP_RECOVERY 
  }
  enum TrackingType { BINARY NUMERIC DURATION RATING TEXT }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    bio: String
    phoneNumber: String
    profileImageUrl: String
    isActive: Boolean!
    emailVerified: String
    emailVerifiedAt: String
    createdAt: String!
    updatedAt: String!
    habits: [Habit!]!
    dailyScores: [DailyScore!]!
    challenges: [Challenge!]!
  }

  type Habit {
    id: ID!
    userId: ID!
    user: User!
    name: String!
    description: String
    category: HabitCategory!
    frequency: HabitFrequency!
    trackingType: TrackingType!
    targetCount: Int!
    targetValue: Float
    targetUnit: String
    points: Int!
    color: String
    icon: String
    isActive: Boolean!
    order: Int!
    entries(limit: Int): [HabitEntry!]!
    streaks(active: Boolean): [HabitStreak!]!
    createdAt: String!
    updatedAt: String!
  }

  type HabitEntry {
    id: ID!
    habitId: ID!
    habit: Habit!
    date: String!
    status: EntryStatus!
    value: Float
    textValue: String
    note: String
    timeSpent: Int
    difficulty: Int
    mood: Int
    createdAt: String!
  }

  type HabitStreak {
    id: ID!
    habitId: ID!
    habit: Habit!
    startDate: String!
    endDate: String
    length: Int!
    isActive: Boolean!
    createdAt: String!
  }

  type DailyScore {
    id: ID!
    userId: ID!
    user: User!
    date: String!
    totalPoints: Int!
    completedHabits: Int!
    totalHabits: Int!
    morningScore: Int!
    physicalScore: Int!
    nutritionScore: Int!
    workScore: Int!
    developmentScore: Int!
    socialScore: Int!
    reflectionScore: Int!
    sleepScore: Int!
    percentile: Float
    rank: Int
    createdAt: String!
  }

  type Challenge {
    id: ID!
    userId: ID!
    user: User!
    name: String!
    description: String
    category: HabitCategory
    startDate: String!
    endDate: String!
    targetValue: Int!
    currentValue: Int!
    isCompleted: Boolean!
    reward: String
    progress: Float!
    createdAt: String!
  }

  type Query {
    # Usuario
    currentUser: User
    user(id: ID!): User
    users: [User!]!
    authenticateUser(email: String!, password: String!): User
    
    # Hábitos
    myHabits: [Habit!]!
    habitsByCategory(category: HabitCategory!): [Habit!]!
    habitEntries(habitId: ID!): [HabitEntry!]!
    habitWithEntries(habitId: ID!): Habit
    
    # Dashboard
    todayScore: DailyScore
    weeklyScores: [DailyScore!]!
    monthlyScores: [DailyScore!]!
    
    # Desafíos
    activeChallenges: [Challenge!]!
    completedChallenges: [Challenge!]!
    
    # Estadísticas
    categoryStats: [CategoryStats!]!
    longestStreaks: [HabitStreak!]!
  }

  type CategoryStats {
    category: HabitCategory!
    totalHabits: Int!
    completedToday: Int!
    averageScore: Float!
    streak: Int!
  }

  input NewHabitInput {
    name: String!
    category: HabitCategory!
    frequency: HabitFrequency!
    trackingType: TrackingType
    description: String
    targetCount: Int
    targetValue: Float
    targetUnit: String
    points: Int
    color: String
    icon: String
  }

  input UpdateHabitInput {
    name: String
    description: String
    category: HabitCategory
    frequency: HabitFrequency
    trackingType: TrackingType
    targetCount: Int
    targetValue: Float
    targetUnit: String
    points: Int
    color: String
    icon: String
    isActive: Boolean
    order: Int
  }

  input LogHabitEntryInput {
    habitId: ID!
    date: String!
    status: EntryStatus!
    value: Float
    textValue: String
    note: String
    timeSpent: Int
    difficulty: Int
    mood: Int
  }

  input NewChallengeInput {
    name: String!
    description: String
    category: HabitCategory
    startDate: String!
    endDate: String!
    targetValue: Int!
    reward: String
  }

  type ResetProgressResult {
    success: Boolean!
    message: String!
    resetsCount: Int!
  }

  type Mutation {
    # Hábitos
    createHabit(input: NewHabitInput!): Habit!
    updateHabit(id: ID!, input: UpdateHabitInput!): Habit!
    deleteHabit(id: ID!): Boolean!
    
    # Entradas
    logHabitEntry(input: LogHabitEntryInput!): HabitEntry!
    deleteHabitEntry(id: ID!): Boolean!
    
    # Desafíos
    createChallenge(input: NewChallengeInput!): Challenge!
    updateChallengeProgress(id: ID!, progress: Int!): Challenge!
    completeChallenge(id: ID!): Challenge!
    
    # Puntuación
    recalculateDailyScore(date: String!): DailyScore!
    resetTodayProgress: ResetProgressResult!
  }
`;

export const resolvers = {
  // Resolvers de campos para tipos complejos
  Habit: {
    entries: async (parent: Habit, args: { limit?: number }) => {
      return parent.entries?.slice(0, args.limit || parent.entries.length) || [];
    },
    streaks: async (parent: Habit, args: { active?: boolean }) => {
      if (!parent.streaks) return [];
      if (args.active !== undefined) {
        return parent.streaks.filter((streak: HabitStreak) => streak.isActive === args.active);
      }
      return parent.streaks;
    },
  },

  Query: {
    currentUser: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        include: {
          habits: true,
          dailyScores: { take: 30, orderBy: { date: 'desc' } },
          challenges: true,
        },
      });
    },

    user: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      return ctx.db.user.findUnique({
        where: { id },
        include: {
          habits: true,
          dailyScores: { take: 7, orderBy: { date: 'desc' } },
          challenges: true,
        },
      });
    },

    users: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.user.findMany({
        where: { isActive: true },
        include: {
          habits: { where: { isActive: true } },
          dailyScores: { take: 1, orderBy: { date: 'desc' } },
          challenges: { where: { isCompleted: false } },
        },
        orderBy: { createdAt: 'asc' },
      });
    },

    authenticateUser: async (_parent: unknown, { email }: { email: string, password: string }, ctx: GraphQLContext) => {
      // En producción, aquí verificarías el password hash
      // Por ahora, solo buscar por email
      const user = await ctx.db.user.findUnique({
        where: { email },
        include: {
          habits: true,
          dailyScores: { take: 30, orderBy: { date: 'desc' } },
          challenges: true,
        },
      });

      if (user && user.isActive) {
        return user;
      }

      throw new Error('Credenciales inválidas');
    },

    myHabits: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.habit.findMany({
        where: {
          userId: ctx.user.id,
          isActive: true,
        },
        include: {
          user: true,
          entries: {
            orderBy: { date: 'desc' },
            take: 7
          },
          streaks: {
            where: { isActive: true }
          }
        },
        orderBy: [
          { category: 'asc' },
          { order: 'asc' }
        ]
      });
    },

    habitsByCategory: async (_parent: unknown, { category }: { category: string }, ctx: GraphQLContext) => {
      return ctx.db.habit.findMany({
        where: {
          userId: ctx.user.id,
          category: category as HabitCategory,
          isActive: true,
        },
        include: {
          user: true,
          entries: {
            orderBy: { date: 'desc' },
            take: 7
          },
          streaks: {
            where: { isActive: true }
          }
        },
        orderBy: { order: 'asc' }
      });
    },

    habitEntries: async (_parent: unknown, { habitId }: { habitId: string }, ctx: GraphQLContext) => {
      // Verificar que el hábito pertenece al usuario
      const habit = await ctx.db.habit.findFirst({
        where: { id: habitId, userId: ctx.user.id }
      });
      
      if (!habit) {
        throw new Error('Hábito no encontrado o no tienes permisos');
      }

      return ctx.db.habitEntry.findMany({
        where: { habitId },
        include: { habit: true },
        orderBy: { date: 'desc' }
      });
    },

    habitWithEntries: async (_parent: unknown, { habitId }: { habitId: string }, ctx: GraphQLContext) => {
      return ctx.db.habit.findFirst({
        where: {
          id: habitId,
          userId: ctx.user.id,
        },
        include: {
          user: true,
          entries: {
            orderBy: { date: 'desc' }
          },
          streaks: true
        }
      });
    },

    todayScore: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const today = new Date().toISOString().split('T')[0];
      const todayDate = new Date(today);
      return ctx.db.dailyScore.findUnique({
        where: {
          userId_date: {
            userId: ctx.user.id,
            date: todayDate,
          },
        },
      });
    },

    weeklyScores: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      
      return ctx.db.dailyScore.findMany({
        where: {
          userId: ctx.user.id,
          date: {
            gte: weekAgo,
            lte: today,
          },
        },
        orderBy: { date: 'desc' },
      });
    },

    monthlyScores: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const today = new Date();
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);
      
      return ctx.db.dailyScore.findMany({
        where: {
          userId: ctx.user.id,
          date: {
            gte: monthAgo,
            lte: today,
          },
        },
        orderBy: { date: 'desc' },
      });
    },

    activeChallenges: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const today = new Date().toISOString().split('T')[0];
      return ctx.db.challenge.findMany({
        where: {
          userId: ctx.user.id,
          isCompleted: false,
          endDate: {
            gte: today,
          },
        },
        orderBy: { endDate: 'asc' },
      });
    },

    completedChallenges: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.challenge.findMany({
        where: {
          userId: ctx.user.id,
          isCompleted: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    categoryStats: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const today = new Date().toISOString().split('T')[0];
      const todayDate = new Date(today);
      const categories = [
        'MORNING_ROUTINE', 'PHYSICAL_TRAINING', 'NUTRITION', 'DEEP_WORK',
        'PERSONAL_DEVELOPMENT', 'SOCIAL_CHARISMA', 'SLEEP_RECOVERY', 'REFLECTION'
      ];

      const stats = [];
      
      for (const category of categories) {
        const habits = await ctx.db.habit.findMany({
          where: {
            userId: ctx.user.id,
            category: category as HabitCategory,
            isActive: true,
          },
        });

        const entriesQuery = await ctx.db.habitEntry.findMany({
          where: {
            date: todayDate,
            habit: {
              userId: ctx.user.id,
              category: category as HabitCategory,
            },
            status: 'COMPLETED',
          },
        });

        const totalPoints = habits.reduce((sum: number, h: { points: number }) => sum + h.points, 0);
        const averageScore = habits.length > 0 ? totalPoints / habits.length : 0;
        
        stats.push({
          category,
          totalHabits: habits.length,
          completedToday: entriesQuery.length,
          averageScore,
          streak: 0, // TODO: Implementar cálculo de racha
        });
      }

      return stats;
    },

    longestStreaks: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.habitStreak.findMany({
        where: {
          habit: { userId: ctx.user.id }
        },
        include: { habit: true },
        orderBy: { length: 'desc' },
        take: 10,
      });
    },
  },

  Mutation: {
    createHabit: async (_parent: unknown, { input }: { input: NewHabitInput }, ctx: GraphQLContext) => {
      const habitCount = await ctx.db.habit.count({
        where: { userId: ctx.user.id }
      });
      
      return ctx.db.habit.create({
        data: {
          userId: ctx.user.id,
          order: habitCount + 1,
          isActive: true,
          ...input,
        },
        include: {
          entries: true,
          streaks: true,
        }
      });
    },

    updateHabit: async (_parent: unknown, { id, input }: { id: string, input: UpdateHabitInput }, ctx: GraphQLContext) => {
      // Verificar que el hábito existe y pertenece al usuario
      const existingHabit = await ctx.db.habit.findFirst({
        where: { id, userId: ctx.user.id }
      });
      
      if (!existingHabit) {
        throw new Error('Hábito no encontrado o no tienes permisos');
      }

      return ctx.db.habit.update({
        where: { id },
        data: input,
        include: {
          user: true,
          entries: true,
          streaks: true,
        }
      });
    },

    deleteHabit: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      // Verificar que el hábito existe y pertenece al usuario
      const existingHabit = await ctx.db.habit.findFirst({
        where: { id, userId: ctx.user.id }
      });
      
      if (!existingHabit) {
        throw new Error('Hábito no encontrado o no tienes permisos');
      }

      await ctx.db.habit.update({
        where: { id },
        data: { isActive: false }
      });
      return true;
    },

    logHabitEntry: async (_parent: unknown, { input }: { input: HabitEntryInput }, ctx: GraphQLContext) => {
      // Verificar que el hábito pertenece al usuario
      const habit = await ctx.db.habit.findFirst({
        where: { id: input.habitId, userId: ctx.user.id }
      });
      
      if (!habit) {
        throw new Error('Hábito no encontrado o no tienes permisos');
      }

      const entry = await ctx.db.habitEntry.upsert({
        where: {
          habitId_date: {
            habitId: input.habitId,
            date: new Date(input.date),
          },
        },
        update: {
          status: input.status,
          value: input.value,
          textValue: input.textValue,
          note: input.note,
          timeSpent: input.timeSpent,
          difficulty: input.difficulty,
          mood: input.mood,
        },
        create: {
          ...input,
          date: new Date(input.date),
        },
        include: {
          habit: true
        }
      });

      // Recalcular score del día
      await recalculateDailyScore(ctx, input.date);

      return entry;
    },

    deleteHabitEntry: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const entry = await ctx.db.habitEntry.findFirst({
        where: { 
          id,
          habit: { userId: ctx.user.id }
        },
        include: { habit: true }
      });
      
      if (!entry) {
        throw new Error('Entrada no encontrada o no tienes permisos');
      }
      
      await ctx.db.habitEntry.delete({
        where: { id },
      });
      
      // Recalcular score del día
      await recalculateDailyScore(ctx, entry.date.toISOString().split('T')[0]);
      
      return true;
    },

    createChallenge: async (_parent: unknown, { input }: { input: NewChallengeInput }, ctx: GraphQLContext) => {
      return ctx.db.challenge.create({
        data: {
          ...input,
          userId: ctx.user.id,
          currentValue: 0,
          isCompleted: false,
          progress: 0,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
        },
      });
    },

    updateChallengeProgress: async (_parent: unknown, { id, progress }: { id: string, progress: number }, ctx: GraphQLContext) => {
      const challenge = await ctx.db.challenge.findFirst({ 
        where: { id, userId: ctx.user.id } 
      });
      
      if (!challenge) {
        throw new Error('Challenge no encontrado o no tienes permisos');
      }

      const newProgress = Math.min(100, (progress / challenge.targetValue) * 100);
      
      return ctx.db.challenge.update({
        where: { id },
        data: {
          currentValue: progress,
          progress: newProgress,
          isCompleted: newProgress >= 100,
        },
        include: { user: true }
      });
    },

    completeChallenge: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const challenge = await ctx.db.challenge.findFirst({ 
        where: { id, userId: ctx.user.id } 
      });
      
      if (!challenge) {
        throw new Error('Challenge no encontrado o no tienes permisos');
      }

      return ctx.db.challenge.update({
        where: { id },
        data: {
          isCompleted: true,
          progress: 100,
        },
        include: { user: true }
      });
    },

    recalculateDailyScore: async (_parent: unknown, { date }: { date: string }, ctx: GraphQLContext) => {
      return recalculateDailyScore(ctx, date);
    },

    resetTodayProgress: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const todayDate = new Date(today);
        
        // Eliminar todas las entradas de hábitos de hoy
        const deletedEntries = await ctx.db.habitEntry.deleteMany({
          where: {
            date: todayDate,
            habit: {
              userId: ctx.user.id,
            },
          },
        });

        // Recalcular el score diario (debería quedar en 0)
        await recalculateDailyScore(ctx, today);

        return {
          success: true,
          message: `Progreso diario reiniciado. ${deletedEntries.count} entradas eliminadas.`,
          resetsCount: deletedEntries.count,
        };
      } catch (error) {
        console.error('Error resetting today progress:', error);
        return {
          success: false,
          message: 'Error al reiniciar el progreso diario',
          resetsCount: 0,
        };
      }
    },
  },
};

// Función auxiliar para recalcular score diario
async function recalculateDailyScore(ctx: GraphQLContext, date: string) {
  const dateObj = new Date(date);
  const entriesForDay = await ctx.db.habitEntry.findMany({
    where: {
      date: dateObj,
      habit: { userId: ctx.user.id },
    },
    include: { habit: true },
  });

  const allHabits = await ctx.db.habit.findMany({
    where: {
      userId: ctx.user.id,
      isActive: true,
    },
  });

  const completedHabits = entriesForDay.filter((e: HabitEntry) => e.status === 'COMPLETED').length;
  const totalPoints = entriesForDay
    .filter((e: HabitEntry) => e.status === 'COMPLETED')
    .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0);

  const scoreData = {
    userId: ctx.user.id,
    totalPoints,
    completedHabits,
    totalHabits: allHabits.length,
    morningScore: entriesForDay
      .filter((e: HabitEntry) => e.habit.category === 'MORNING_ROUTINE' && e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0),
    physicalScore: entriesForDay
      .filter((e: HabitEntry) => e.habit.category === 'PHYSICAL_TRAINING' && e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0),
    nutritionScore: entriesForDay
      .filter((e: HabitEntry) => e.habit.category === 'NUTRITION' && e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0),
    workScore: entriesForDay
      .filter((e: HabitEntry) => e.habit.category === 'DEEP_WORK' && e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0),
    developmentScore: entriesForDay
      .filter((e: HabitEntry) => e.habit.category === 'PERSONAL_DEVELOPMENT' && e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0),
    socialScore: entriesForDay
      .filter((e: HabitEntry) => e.habit.category === 'SOCIAL_CHARISMA' && e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0),
    sleepScore: entriesForDay
      .filter((e: HabitEntry) => e.habit.category === 'SLEEP_RECOVERY' && e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0),
    reflectionScore: entriesForDay
      .filter((e: HabitEntry) => e.habit.category === 'REFLECTION' && e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + (e.habit.points || 0), 0),
    percentile: completedHabits > 0 ? Math.min(100, Math.floor((completedHabits / allHabits.length) * 100) + 20) : 0,
    rank: Math.max(1, 101 - Math.floor((completedHabits / allHabits.length) * 100)),
  };

  return ctx.db.dailyScore.upsert({
    where: {
      userId_date: {
        userId: ctx.user.id,
        date: dateObj,
      },
    },
    update: scoreData,
    create: {
      ...scoreData,
      date: dateObj,
    },
  });
   } 