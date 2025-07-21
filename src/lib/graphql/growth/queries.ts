import { GraphQLContext, Habit, HabitCategory, HabitEntryInput, NewChallengeInput, NewHabitInput, UpdateHabitInput, UpdateUserProfileInput } from './types';

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

  type ProfileStats {
    totalDays: Int!
    currentStreak: Int!
    longestStreak: Int!
    completedHabits: Int!
    totalPoints: Int!
    averageScore: Float!
    satisfactionRating: Float!
  }

  type CalendarDay {
    date: String!
    completedHabits: Int!
    totalHabits: Int!
    points: Int!
    completionPercentage: Float!
    hasStreak: Boolean!
    entries: [HabitEntry!]!
  }

  type MonthlyStats {
    month: String!
    year: Int!
    totalDays: Int!
    activeDays: Int!
    averageCompletion: Float!
    longestStreak: Int!
    totalPoints: Int!
    categoryBreakdown: [CategoryStats!]!
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
    currentStreak: Int!
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
    createdAt: String!
  }

  type Query {
    # Usuario y Perfil
    currentUser: User
    user(id: ID!): User
    users: [User!]!
    authenticateUser(email: String!, password: String!): User
    userProfile: User
    profileStats: ProfileStats!
    
    # Hábitos
    myHabits: [Habit!]!
    habitsByCategory(category: HabitCategory!): [Habit!]!
    habitEntries(habitId: ID!): [HabitEntry!]!
    habitWithEntries(habitId: ID!): Habit
    
    # Calendario
    calendarData(month: Int!, year: Int!): [CalendarDay!]!
    calendarDay(date: String!): CalendarDay
    monthlyStats(month: Int!, year: Int!): MonthlyStats!
    
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
    order: Int
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

  input UpdateUserProfileInput {
    firstName: String
    lastName: String
    bio: String
    phoneNumber: String
    profileImageUrl: String
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
    # Perfil
    updateUserProfile(input: UpdateUserProfileInput!): User!
    
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
    entries: async (parent: Habit, args: { limit?: number }, ctx: GraphQLContext) => {
      const habits = await ctx.db.habitEntry.findMany({
        where: { habitId: parent.id },
        orderBy: { date: 'desc' },
        take: args.limit || 30
      });
      return habits;
    },
    streaks: async (parent: Habit, args: { active?: boolean }, ctx: GraphQLContext) => {
      const where: { habitId: string; isActive?: boolean } = { habitId: parent.id };
      if (args.active !== undefined) {
        where.isActive = args.active;
      }
      return ctx.db.habitStreak.findMany({
        where,
        orderBy: { startDate: 'desc' }
      });
    },
    currentStreak: async (parent: Habit, _args: unknown, ctx: GraphQLContext) => {
      const activeStreak = await ctx.db.habitStreak.findFirst({
        where: { habitId: parent.id, isActive: true },
        orderBy: { startDate: 'desc' }
      });
      return activeStreak?.length || 0;
    }
  },

  Query: {
    currentUser: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        include: {
          habits: { where: { isActive: true } },
          dailyScores: { take: 30, orderBy: { date: 'desc' } },
          challenges: true,
        },
      });
    },

    userProfile: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.user.findUnique({
        where: { id: ctx.user.id },
      });
    },

    profileStats: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyScores = await ctx.db.dailyScore.findMany({
        where: {
          userId: ctx.user.id,
          date: { gte: thirtyDaysAgo }
        },
        orderBy: { date: 'desc' }
      });

      const completedHabits = await ctx.db.habitEntry.count({
        where: {
          habit: { userId: ctx.user.id },
          status: 'COMPLETED',
          date: { gte: thirtyDaysAgo }
        }
      });

      const allStreaks = await ctx.db.habitStreak.findMany({
        where: { habit: { userId: ctx.user.id } },
        orderBy: { length: 'desc' }
      });

      const currentStreaks = allStreaks.filter(s => s.isActive);
      const longestStreak = allStreaks[0]?.length || 0;
      const currentStreak = currentStreaks.reduce((max, s) => Math.max(max, s.length), 0);

      const totalPoints = dailyScores.reduce((sum, score) => sum + score.totalPoints, 0);
      const averageScore = dailyScores.length > 0 
        ? dailyScores.reduce((sum, score) => sum + ((score.completedHabits / Math.max(score.totalHabits, 1)) * 100), 0) / dailyScores.length
        : 0;

      return {
        totalDays: dailyScores.length,
        currentStreak,
        longestStreak,
        completedHabits,
        totalPoints,
        averageScore,
        satisfactionRating: 95.0 // Simulated for now
      };
    },

    calendarData: async (_parent: unknown, { month, year }: { month: number; year: number }, ctx: GraphQLContext) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const dailyScores = await ctx.db.dailyScore.findMany({
        where: {
          userId: ctx.user.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          user: {
            include: {
              habits: {
                where: { isActive: true },
                include: {
                  entries: {
                    where: {
                      date: {
                        gte: startDate,
                        lte: endDate
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Generate calendar days with data
      const calendarDays = [];
      for (let day = 1; day <= endDate.getDate(); day++) {
        const currentDate = new Date(year, month - 1, day);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        const dayScore = dailyScores.find(score => 
          score.date.toISOString().split('T')[0] === dateStr
        );

        if (dayScore) {
          const completionPercentage = dayScore.totalHabits > 0 
            ? (dayScore.completedHabits / dayScore.totalHabits) * 100 
            : 0;

          calendarDays.push({
            date: dateStr,
            completedHabits: dayScore.completedHabits,
            totalHabits: dayScore.totalHabits,
            points: dayScore.totalPoints,
            completionPercentage,
            hasStreak: completionPercentage >= 70,
            entries: [] // Will be populated if needed
          });
        } else {
          // No data for this day
          calendarDays.push({
            date: dateStr,
            completedHabits: 0,
            totalHabits: 0,
            points: 0,
            completionPercentage: 0,
            hasStreak: false,
            entries: []
          });
        }
      }

      return calendarDays;
    },

    calendarDay: async (_parent: unknown, { date }: { date: string }, ctx: GraphQLContext) => {
      const targetDate = new Date(date);
      
      const dailyScore = await ctx.db.dailyScore.findFirst({
        where: {
          userId: ctx.user.id,
          date: targetDate
        }
      });

      const entries = await ctx.db.habitEntry.findMany({
        where: {
          habit: { userId: ctx.user.id },
          date: targetDate
        },
        include: {
          habit: true
        }
      });

      if (!dailyScore) {
        return {
          date,
          completedHabits: 0,
          totalHabits: 0,
          points: 0,
          completionPercentage: 0,
          hasStreak: false,
          entries
        };
      }

      const completionPercentage = dailyScore.totalHabits > 0 
        ? (dailyScore.completedHabits / dailyScore.totalHabits) * 100 
        : 0;

      return {
        date,
        completedHabits: dailyScore.completedHabits,
        totalHabits: dailyScore.totalHabits,
        points: dailyScore.totalPoints,
        completionPercentage,
        hasStreak: completionPercentage >= 70,
        entries
      };
    },

    monthlyStats: async (_parent: unknown, { month, year }: { month: number; year: number }, ctx: GraphQLContext) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const dailyScores = await ctx.db.dailyScore.findMany({
        where: {
          userId: ctx.user.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const activeDays = dailyScores.filter(score => score.completedHabits > 0).length;
      const totalPoints = dailyScores.reduce((sum, score) => sum + score.totalPoints, 0);
      const averageCompletion = dailyScores.length > 0 
        ? dailyScores.reduce((sum, score) => sum + ((score.completedHabits / Math.max(score.totalHabits, 1)) * 100), 0) / dailyScores.length
        : 0;

      // Calculate longest streak in month
      let longestStreak = 0;
      let currentStreak = 0;
      
      dailyScores.sort((a, b) => a.date.getTime() - b.date.getTime());
      for (const score of dailyScores) {
        const completion = score.totalHabits > 0 ? (score.completedHabits / score.totalHabits) * 100 : 0;
        if (completion >= 70) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      // Generate category breakdown
      const categoryBreakdown = [
        { category: HabitCategory.MORNING_ROUTINE, totalHabits: 0, completedToday: 0, averageScore: 0, streak: 0 },
        { category: HabitCategory.PHYSICAL_TRAINING, totalHabits: 0, completedToday: 0, averageScore: 0, streak: 0 },
        { category: HabitCategory.NUTRITION, totalHabits: 0, completedToday: 0, averageScore: 0, streak: 0 },
        { category: HabitCategory.DEEP_WORK, totalHabits: 0, completedToday: 0, averageScore: 0, streak: 0 },
        { category: HabitCategory.PERSONAL_DEVELOPMENT, totalHabits: 0, completedToday: 0, averageScore: 0, streak: 0 },
        { category: HabitCategory.SOCIAL_CHARISMA, totalHabits: 0, completedToday: 0, averageScore: 0, streak: 0 },
        { category: HabitCategory.REFLECTION, totalHabits: 0, completedToday: 0, averageScore: 0, streak: 0 },
        { category: HabitCategory.SLEEP_RECOVERY, totalHabits: 0, completedToday: 0, averageScore: 0, streak: 0 }
      ];

      return {
        month: startDate.toLocaleDateString('es-ES', { month: 'long' }),
        year,
        totalDays: endDate.getDate(),
        activeDays,
        averageCompletion,
        longestStreak,
        totalPoints,
        categoryBreakdown
      };
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

    myHabits: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.habit.findMany({
        where: { userId: ctx.user.id, isActive: true },
        include: {
          entries: { take: 7, orderBy: { date: 'desc' } },
          streaks: { where: { isActive: true } },
        },
        orderBy: { order: 'asc' },
      });
    },

    habitsByCategory: async (_parent: unknown, { category }: { category: HabitCategory }, ctx: GraphQLContext) => {
      return ctx.db.habit.findMany({
        where: { userId: ctx.user.id, category, isActive: true },
        include: {
          entries: { take: 7, orderBy: { date: 'desc' } },
          streaks: { where: { isActive: true } },
        },
        orderBy: { order: 'asc' },
      });
    },

    habitEntries: async (_parent: unknown, { habitId }: { habitId: string }, ctx: GraphQLContext) => {
      return ctx.db.habitEntry.findMany({
        where: { habitId },
        include: { habit: true },
        orderBy: { date: 'desc' },
      });
    },

    habitWithEntries: async (_parent: unknown, { habitId }: { habitId: string }, ctx: GraphQLContext) => {
      return ctx.db.habit.findUnique({
        where: { id: habitId },
        include: {
          entries: { orderBy: { date: 'desc' } },
          streaks: true,
        },
      });
    },

    todayScore: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const today = new Date();
      return ctx.db.dailyScore.findFirst({
        where: {
          userId: ctx.user.id,
          date: today,
        },
        include: { user: true },
      });
    },

    weeklyScores: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      return ctx.db.dailyScore.findMany({
        where: {
          userId: ctx.user.id,
          date: { gte: weekAgo },
        },
        include: { user: true },
        orderBy: { date: 'asc' },
      });
    },

    monthlyScores: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      
      return ctx.db.dailyScore.findMany({
        where: {
          userId: ctx.user.id,
          date: { gte: monthAgo },
        },
        include: { user: true },
        orderBy: { date: 'asc' },
      });
    },

    activeChallenges: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.challenge.findMany({
        where: { userId: ctx.user.id, isCompleted: false },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
    },

    completedChallenges: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.challenge.findMany({
        where: { userId: ctx.user.id, isCompleted: true },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
    },

    categoryStats: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const categories: HabitCategory[] = [
        HabitCategory.MORNING_ROUTINE, 
        HabitCategory.PHYSICAL_TRAINING, 
        HabitCategory.NUTRITION, 
        HabitCategory.DEEP_WORK,
        HabitCategory.PERSONAL_DEVELOPMENT, 
        HabitCategory.SOCIAL_CHARISMA, 
        HabitCategory.REFLECTION, 
        HabitCategory.SLEEP_RECOVERY
      ];

      const stats = [];
      const today = new Date();
      
      for (const category of categories) {
        const totalHabits = await ctx.db.habit.count({
          where: { userId: ctx.user.id, category, isActive: true }
        });

        const completedToday = await ctx.db.habitEntry.count({
          where: {
            habit: { userId: ctx.user.id, category },
            date: today,
            status: 'COMPLETED'
          }
        });

        stats.push({
          category,
          totalHabits,
          completedToday,
          averageScore: totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0,
          streak: 0 // Simplified for now
        });
      }

      return stats;
    },

    longestStreaks: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.db.habitStreak.findMany({
        where: { habit: { userId: ctx.user.id } },
        include: { habit: true },
        orderBy: { length: 'desc' },
        take: 10,
      });
    },
  },

  Mutation: {
    updateUserProfile: async (_parent: unknown, { input }: { input: UpdateUserProfileInput }, ctx: GraphQLContext) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          bio: input.bio,
          phoneNumber: input.phoneNumber,
          profileImageUrl: input.profileImageUrl,
          updatedAt: new Date()
        }
      });
    },

    createHabit: async (_parent: unknown, { input }: { input: NewHabitInput }, ctx: GraphQLContext) => {
      return ctx.db.habit.create({
        data: {
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          category: input.category,
          frequency: input.frequency,
          trackingType: input.trackingType || 'BINARY',
          targetCount: input.targetCount || 1,
          targetValue: input.targetValue,
          targetUnit: input.targetUnit,
          points: input.points || 1,
          color: input.color || '#3B82F6',
          icon: input.icon,
          order: input.order || 0,
        },
        include: {
          entries: true,
          streaks: true,
        },
      });
    },

    updateHabit: async (_parent: unknown, { id, input }: { id: string; input: UpdateHabitInput }, ctx: GraphQLContext) => {
      return ctx.db.habit.update({
        where: { id },
        data: {
          ...input,
          updatedAt: new Date(),
        },
        include: {
          entries: true,
          streaks: true,
        },
      });
    },

    deleteHabit: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      await ctx.db.habit.update({
        where: { id },
        data: { isActive: false },
      });
      return true;
    },

    logHabitEntry: async (_parent: unknown, { input }: { input: HabitEntryInput }, ctx: GraphQLContext) => {
      const entry = await ctx.db.habitEntry.create({
        data: {
          habitId: input.habitId,
          date: new Date(input.date),
          status: input.status,
          value: input.value,
          textValue: input.textValue,
          note: input.note,
          timeSpent: input.timeSpent,
          difficulty: input.difficulty,
          mood: input.mood,
        },
        include: { habit: true },
      });

      // Update or create daily score
      await updateDailyScore(ctx, ctx.user.id, new Date(input.date));

      return entry;
    },

    deleteHabitEntry: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      const entry = await ctx.db.habitEntry.findUnique({ where: { id } });
      if (entry) {
        await ctx.db.habitEntry.delete({ where: { id } });
        await updateDailyScore(ctx, ctx.user.id, entry.date);
      }
      return true;
    },

    createChallenge: async (_parent: unknown, { input }: { input: NewChallengeInput }, ctx: GraphQLContext) => {
      return ctx.db.challenge.create({
        data: {
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          category: input.category,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          targetValue: input.targetValue,
          reward: input.reward,
        },
        include: { user: true },
      });
    },

    updateChallengeProgress: async (_parent: unknown, { id, progress }: { id: string; progress: number }, ctx: GraphQLContext) => {
      return ctx.db.challenge.update({
        where: { id },
        data: { currentValue: progress },
        include: { user: true },
      });
    },

    completeChallenge: async (_parent: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      return ctx.db.challenge.update({
        where: { id },
        data: { isCompleted: true },
        include: { user: true },
      });
    },

    recalculateDailyScore: async (_parent: unknown, { date }: { date: string }, ctx: GraphQLContext) => {
      const targetDate = new Date(date);
      return updateDailyScore(ctx, ctx.user.id, targetDate);
    },

    resetTodayProgress: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const today = new Date();
      const deleted = await ctx.db.habitEntry.deleteMany({
        where: {
          habit: { userId: ctx.user.id },
          date: today,
        },
      });

      await updateDailyScore(ctx, ctx.user.id, today);

      return {
        success: true,
        message: `Reset ${deleted.count} habit entries for today`,
        resetsCount: deleted.count,
      };
    },
  },
};

// Helper function to update daily scores
async function updateDailyScore(ctx: GraphQLContext, userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get all user habits
  const habits = await ctx.db.habit.findMany({
    where: { userId, isActive: true }
  });

  // Get all entries for the day
  const entries = await ctx.db.habitEntry.findMany({
    where: {
      habit: { userId },
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    include: { habit: true }
  });

  const completedEntries = entries.filter(entry => entry.status === 'COMPLETED');
  const totalPoints = completedEntries.reduce((sum, entry) => sum + entry.habit.points, 0);

  // Calculate category scores
  const categoryScores = {
    morningScore: 0,
    physicalScore: 0,
    nutritionScore: 0,
    workScore: 0,
    developmentScore: 0,
    socialScore: 0,
    reflectionScore: 0,
    sleepScore: 0
  };

  completedEntries.forEach(entry => {
    const points = entry.habit.points;
    switch (entry.habit.category) {
      case 'MORNING_ROUTINE':
        categoryScores.morningScore += points;
        break;
      case 'PHYSICAL_TRAINING':
        categoryScores.physicalScore += points;
        break;
      case 'NUTRITION':
        categoryScores.nutritionScore += points;
        break;
      case 'DEEP_WORK':
        categoryScores.workScore += points;
        break;
      case 'PERSONAL_DEVELOPMENT':
        categoryScores.developmentScore += points;
        break;
      case 'SOCIAL_CHARISMA':
        categoryScores.socialScore += points;
        break;
      case 'REFLECTION':
        categoryScores.reflectionScore += points;
        break;
      case 'SLEEP_RECOVERY':
        categoryScores.sleepScore += points;
        break;
    }
  });

  // Upsert daily score
  return ctx.db.dailyScore.upsert({
    where: {
      userId_date: {
        userId,
        date: startOfDay
      }
    },
    update: {
      totalPoints,
      completedHabits: completedEntries.length,
      totalHabits: habits.length,
      ...categoryScores
    },
    create: {
      userId,
      date: startOfDay,
      totalPoints,
      completedHabits: completedEntries.length,
      totalHabits: habits.length,
      ...categoryScores
    },
    include: { user: true }
  });
} 