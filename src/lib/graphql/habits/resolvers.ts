import { db } from "@/lib/db";
import { 
  HabitCategory, 
  HabitFrequency, 
  TrackingType, 
  EntryStatus,
  Prisma 
} from "@prisma/client";

// Types for resolver arguments
interface CreateHabitInput {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  trackingType: TrackingType;
  targetCount: number;
  targetValue?: number;
  targetUnit?: string;
  points: number;
  color?: string;
  icon?: string;
  order?: number;
}

interface UpdateHabitInput {
  name?: string;
  description?: string;
  category?: HabitCategory;
  frequency?: HabitFrequency;
  trackingType?: TrackingType;
  targetCount?: number;
  targetValue?: number;
  targetUnit?: string;
  points?: number;
  color?: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
}

interface LogHabitEntryInput {
  habitId: string;
  date: string;
  status: EntryStatus;
  value?: number;
  textValue?: string;
  note?: string;
  timeSpent?: number;
  difficulty?: number;
  mood?: number;
}

// Utility functions
class HabitService {
  static async calculateStreaks(habitId: string): Promise<void> {
    // Get all completed entries for this habit, ordered by date
    const entries = await db.habitEntry.findMany({
      where: { 
        habitId,
        status: EntryStatus.COMPLETED 
      },
      orderBy: { date: 'asc' }
    });

    if (entries.length === 0) return;

    // Clear existing streaks
    await db.habitStreak.deleteMany({ where: { habitId } });

    let currentStreak: { startDate: Date; endDate: Date; length: number } | null = null;
    const streaks: Array<{ startDate: Date; endDate: Date; length: number }> = [];

    for (let i = 0; i < entries.length; i++) {
      const currentDate = new Date(entries[i].date);
      
      if (currentStreak === null) {
        // Start new streak
        currentStreak = {
          startDate: currentDate,
          endDate: currentDate,
          length: 1
        };
      } else {
        const prevDate = new Date(entries[i - 1].date);
        const daysDiff = Math.abs(currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff === 1) {
          // Continue streak
          currentStreak.endDate = currentDate;
          currentStreak.length++;
        } else {
          // End current streak and start new one
          streaks.push({ ...currentStreak });
          currentStreak = {
            startDate: currentDate,
            endDate: currentDate,
            length: 1
          };
        }
      }
    }

    // Add final streak
    if (currentStreak) {
      streaks.push(currentStreak);
    }

    // Save streaks to database
    for (const streak of streaks) {
      const isActive = streak.endDate.toDateString() === new Date().toDateString();
      
      await db.habitStreak.create({
        data: {
          habitId,
          startDate: streak.startDate,
          endDate: streak.endDate,
          length: streak.length,
          isActive
        }
      });
    }
  }

  static async calculateDailyScore(userId: string, date: string) {
    const targetDate = new Date(date);
    
    // Get all active habits for the user
    const habits = await db.habit.findMany({
      where: { userId, isActive: true }
    });

    // Get all entries for this date
    const entries = await db.habitEntry.findMany({
      where: {
        habit: { userId },
        date: targetDate
      },
      include: { habit: true }
    });

    // Calculate category scores
    const categoryScores: Record<HabitCategory, number> = {
      MORNING_ROUTINE: 0,
      PHYSICAL_TRAINING: 0,
      NUTRITION: 0,
      DEEP_WORK: 0,
      PERSONAL_DEVELOPMENT: 0,
      SOCIAL_CHARISMA: 0,
      REFLECTION: 0,
      SLEEP_RECOVERY: 0
    };

    let totalPoints = 0;
    let completedHabits = 0;

    for (const entry of entries) {
      if (entry.status === EntryStatus.COMPLETED) {
        totalPoints += entry.habit.points;
        completedHabits++;
        categoryScores[entry.habit.category] += entry.habit.points;
      }
    }

    // Create or update daily score
    const dailyScore = await db.dailyScore.upsert({
      where: { 
        userId_date: { userId, date: targetDate }
      },
      update: {
        totalPoints,
        completedHabits,
        totalHabits: habits.length,
        morningScore: categoryScores.MORNING_ROUTINE,
        physicalScore: categoryScores.PHYSICAL_TRAINING,
        nutritionScore: categoryScores.NUTRITION,
        workScore: categoryScores.DEEP_WORK,
        developmentScore: categoryScores.PERSONAL_DEVELOPMENT,
        socialScore: categoryScores.SOCIAL_CHARISMA,
        reflectionScore: categoryScores.REFLECTION,
        sleepScore: categoryScores.SLEEP_RECOVERY
      },
      create: {
        userId,
        date: targetDate,
        totalPoints,
        completedHabits,
        totalHabits: habits.length,
        morningScore: categoryScores.MORNING_ROUTINE,
        physicalScore: categoryScores.PHYSICAL_TRAINING,
        nutritionScore: categoryScores.NUTRITION,
        workScore: categoryScores.DEEP_WORK,
        developmentScore: categoryScores.PERSONAL_DEVELOPMENT,
        socialScore: categoryScores.SOCIAL_CHARISMA,
        reflectionScore: categoryScores.REFLECTION,
        sleepScore: categoryScores.SLEEP_RECOVERY
      }
    });

    return dailyScore;
  }
}

// GraphQL Resolvers
export const habitResolvers = {
  Query: {
    // Habit queries
    userHabits: async (_: any, { userId }: { userId: string }) => {
      return await db.habit.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
        include: {
          entries: {
            orderBy: { date: 'desc' },
            take: 30 // Last 30 entries
          },
          streaks: {
            where: { isActive: true }
          }
        }
      });
    },

    activeHabits: async (_: any, { userId }: { userId: string }) => {
      return await db.habit.findMany({
        where: { userId, isActive: true },
        orderBy: { order: 'asc' }
      });
    },

    habitsByCategory: async (_: any, { userId, category }: { userId: string; category: HabitCategory }) => {
      return await db.habit.findMany({
        where: { userId, category, isActive: true },
        orderBy: { order: 'asc' }
      });
    },

    habit: async (_: any, { id }: { id: string }) => {
      return await db.habit.findUnique({
        where: { id },
        include: {
          entries: { orderBy: { date: 'desc' } },
          streaks: { orderBy: { length: 'desc' } }
        }
      });
    },

    // Entry queries
    habitEntries: async (_: any, { habitId, startDate, endDate }: { habitId: string; startDate?: string; endDate?: string }) => {
      const where: Prisma.HabitEntryWhereInput = { habitId };
      
      if (startDate && endDate) {
        where.date = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }

      return await db.habitEntry.findMany({
        where,
        include: { habit: true },
        orderBy: { date: 'desc' }
      });
    },

    dailyEntries: async (_: any, { userId, date }: { userId: string; date: string }) => {
      return await db.habitEntry.findMany({
        where: {
          habit: { userId },
          date: new Date(date)
        },
        include: { habit: true },
        orderBy: { habit: { order: 'asc' } }
      });
    },

    entryById: async (_: any, { id }: { id: string }) => {
      return await db.habitEntry.findUnique({
        where: { id },
        include: { habit: true }
      });
    },

    // Streak queries
    habitStreaks: async (_: any, { habitId }: { habitId: string }) => {
      return await db.habitStreak.findMany({
        where: { habitId },
        include: { habit: true },
        orderBy: { length: 'desc' }
      });
    },

    activeStreaks: async (_: any, { userId }: { userId: string }) => {
      return await db.habitStreak.findMany({
        where: { 
          habit: { userId },
          isActive: true 
        },
        include: { habit: true },
        orderBy: { length: 'desc' }
      });
    },

    longestStreaks: async (_: any, { userId }: { userId: string }) => {
      return await db.habitStreak.findMany({
        where: { habit: { userId } },
        include: { habit: true },
        orderBy: { length: 'desc' },
        take: 10
      });
    },

    // Score queries
    dailyScore: async (_: any, { userId, date }: { userId: string; date: string }) => {
      return await db.dailyScore.findUnique({
        where: { 
          userId_date: { userId, date: new Date(date) }
        }
      });
    },

    weeklyScores: async (_: any, { userId, startDate }: { userId: string; startDate: string }) => {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return await db.dailyScore.findMany({
        where: {
          userId,
          date: { gte: start, lte: end }
        },
        orderBy: { date: 'asc' }
      });
    },

    monthlyScores: async (_: any, { userId, month }: { userId: string; month: string }) => {
      const monthStart = new Date(month + '-01');
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

      return await db.dailyScore.findMany({
        where: {
          userId,
          date: { gte: monthStart, lte: monthEnd }
        },
        orderBy: { date: 'asc' }
      });
    },

    // Dashboard query
    userDashboard: async (_: any, { userId, date }: { userId: string; date: string }) => {
      const targetDate = new Date(date);
      
      const [user, habits, dailyEntries, dailyScore, activeStreaks, weeklyProgress] = await Promise.all([
        db.user.findUnique({ where: { id: userId } }),
        db.habit.findMany({ 
          where: { userId, isActive: true },
          orderBy: { order: 'asc' }
        }),
        db.habitEntry.findMany({
          where: { 
            habit: { userId },
            date: targetDate 
          },
          include: { habit: true }
        }),
        db.dailyScore.findUnique({
          where: { userId_date: { userId, date: targetDate } }
        }),
        db.habitStreak.findMany({
          where: { 
            habit: { userId },
            isActive: true 
          },
          include: { habit: true },
          orderBy: { length: 'desc' },
          take: 5
        }),
        (async () => {
          const weekStart = new Date(targetDate);
          weekStart.setDate(targetDate.getDate() - 6);
          return await db.dailyScore.findMany({
            where: {
              userId,
              date: { gte: weekStart, lte: targetDate }
            },
            orderBy: { date: 'asc' }
          });
        })()
      ]);

      return {
        user,
        habits,
        dailyEntries,
        dailyScore,
        activeStreaks,
        weeklyProgress
      };
    }
  },

  Mutation: {
    // Habit mutations
    createHabit: async (_: any, { userId, input }: { userId: string; input: CreateHabitInput }) => {
      const maxOrder = await db.habit.aggregate({
        where: { userId },
        _max: { order: true }
      });

      return await db.habit.create({
        data: {
          ...input,
          userId,
          order: input.order ?? (maxOrder._max.order ?? 0) + 1,
          color: input.color ?? '#EF4444',
          isActive: true
        }
      });
    },

    updateHabit: async (_: any, { id, input }: { id: string; input: UpdateHabitInput }) => {
      return await db.habit.update({
        where: { id },
        data: input
      });
    },

    deleteHabit: async (_: any, { id }: { id: string }) => {
      try {
        await db.habit.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error('Error deleting habit:', error);
        return false;
      }
    },

    reorderHabits: async (_: any, { userId, habitIds }: { userId: string; habitIds: string[] }) => {
      const updates = habitIds.map((habitId, index) => 
        db.habit.update({
          where: { id: habitId, userId },
          data: { order: index + 1 }
        })
      );

      await Promise.all(updates);

      return await db.habit.findMany({
        where: { id: { in: habitIds } },
        orderBy: { order: 'asc' }
      });
    },

    // Entry mutations
    logHabitEntry: async (_: any, { input }: { input: LogHabitEntryInput }) => {
      const entry = await db.habitEntry.upsert({
        where: {
          habitId_date: {
            habitId: input.habitId,
            date: new Date(input.date)
          }
        },
        update: {
          status: input.status,
          value: input.value,
          textValue: input.textValue,
          note: input.note,
          timeSpent: input.timeSpent,
          difficulty: input.difficulty,
          mood: input.mood
        },
        create: {
          habitId: input.habitId,
          date: new Date(input.date),
          status: input.status,
          value: input.value,
          textValue: input.textValue,
          note: input.note,
          timeSpent: input.timeSpent,
          difficulty: input.difficulty,
          mood: input.mood
        },
        include: { habit: true }
      });

      // Recalculate streaks for this habit
      await HabitService.calculateStreaks(input.habitId);
      
      // Get user ID and recalculate daily score
      const habit = await db.habit.findUnique({ where: { id: input.habitId } });
      if (habit) {
        await HabitService.calculateDailyScore(habit.userId, input.date);
      }

      return entry;
    },

    updateHabitEntry: async (_: any, { id, input }: { id: string; input: LogHabitEntryInput }) => {
      const entry = await db.habitEntry.update({
        where: { id },
        data: {
          status: input.status,
          value: input.value,
          textValue: input.textValue,
          note: input.note,
          timeSpent: input.timeSpent,
          difficulty: input.difficulty,
          mood: input.mood
        },
        include: { habit: true }
      });

      // Recalculate streaks and daily score
      await HabitService.calculateStreaks(entry.habitId);
      await HabitService.calculateDailyScore(entry.habit.userId, input.date);

      return entry;
    },

    deleteHabitEntry: async (_: any, { id }: { id: string }) => {
      try {
        const entry = await db.habitEntry.findUnique({
          where: { id },
          include: { habit: true }
        });

        if (entry) {
          await db.habitEntry.delete({ where: { id } });
          
          // Recalculate streaks and daily score
          await HabitService.calculateStreaks(entry.habitId);
          await HabitService.calculateDailyScore(entry.habit.userId, entry.date.toISOString().split('T')[0]);
        }

        return true;
      } catch (error) {
        console.error('Error deleting habit entry:', error);
        return false;
      }
    },

    // Batch operations
    logMultipleEntries: async (_: any, { entries }: { entries: LogHabitEntryInput[] }) => {
      const results = [];

      for (const entryInput of entries) {
        const entry = await db.habitEntry.upsert({
          where: {
            habitId_date: {
              habitId: entryInput.habitId,
              date: new Date(entryInput.date)
            }
          },
          update: {
            status: entryInput.status,
            value: entryInput.value,
            textValue: entryInput.textValue,
            note: entryInput.note,
            timeSpent: entryInput.timeSpent,
            difficulty: entryInput.difficulty,
            mood: entryInput.mood
          },
          create: {
            habitId: entryInput.habitId,
            date: new Date(entryInput.date),
            status: entryInput.status,
            value: entryInput.value,
            textValue: entryInput.textValue,
            note: entryInput.note,
            timeSpent: entryInput.timeSpent,
            difficulty: entryInput.difficulty,
            mood: entryInput.mood
          },
          include: { habit: true }
        });

        results.push(entry);

        // Recalculate streaks for each habit
        await HabitService.calculateStreaks(entryInput.habitId);
      }

      // Recalculate daily scores for each unique user/date combination
      const userDates = new Set<string>();
      for (const entry of results) {
        const key = `${entry.habit.userId}-${entry.date.toISOString().split('T')[0]}`;
        userDates.add(key);
      }

      for (const userDate of userDates) {
        const [userId, date] = userDate.split('-');
        await HabitService.calculateDailyScore(userId, date);
      }

      return results;
    },

    calculateDailyScore: async (_: any, { userId, date }: { userId: string; date: string }) => {
      return await HabitService.calculateDailyScore(userId, date);
    }
  }
}; 