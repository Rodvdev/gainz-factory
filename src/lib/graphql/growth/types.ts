import { PrismaClient } from '@prisma/client';

// GraphQL Context interface
export interface GraphQLContext {
  db: PrismaClient;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    bio?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

// Enums
export enum HabitCategory {
  MORNING_ROUTINE = 'MORNING_ROUTINE',
  PHYSICAL_TRAINING = 'PHYSICAL_TRAINING',
  NUTRITION = 'NUTRITION',
  DEEP_WORK = 'DEEP_WORK',
  PERSONAL_DEVELOPMENT = 'PERSONAL_DEVELOPMENT',
  SOCIAL_CHARISMA = 'SOCIAL_CHARISMA',
  REFLECTION = 'REFLECTION',
  SLEEP_RECOVERY = 'SLEEP_RECOVERY'
}

export enum HabitFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

export enum TrackingType {
  BINARY = 'BINARY',
  NUMERIC = 'NUMERIC',
  DURATION = 'DURATION',
  RATING = 'RATING',
  TEXT = 'TEXT'
}

export enum EntryStatus {
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED'
}

// Core types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  isActive: boolean;
  emailVerified?: string;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  habits: Habit[];
  dailyScores: DailyScore[];
  challenges: Challenge[];
}

export interface Habit {
  id: string;
  userId: string;
  user: User;
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
  isActive: boolean;
  order: number;
  entries: HabitEntry[];
  streaks: HabitStreak[];
  createdAt: string;
  updatedAt: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  habit: Habit;
  date: string;
  status: EntryStatus;
  value?: number;
  textValue?: string;
  note?: string;
  timeSpent?: number;
  difficulty?: number;
  mood?: number;
  createdAt: string;
}

export interface HabitStreak {
  id: string;
  habitId: string;
  habit: Habit;
  startDate: string;
  endDate?: string;
  length: number;
  isActive: boolean;
  createdAt: string;
}

export interface DailyScore {
  id: string;
  userId: string;
  user: User;
  date: string;
  totalPoints: number;
  completedHabits: number;
  totalHabits: number;
  morningScore: number;
  physicalScore: number;
  nutritionScore: number;
  workScore: number;
  developmentScore: number;
  socialScore: number;
  reflectionScore: number;
  sleepScore: number;
  percentile?: number;
  rank?: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  userId: string;
  user: User;
  name: string;
  description?: string;
  category?: HabitCategory;
  startDate: string;
  endDate: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  reward?: string;
  createdAt: string;
}

// Profile and Calendar specific types
export interface ProfileStats {
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  completedHabits: number;
  totalPoints: number;
  averageScore: number;
  satisfactionRating: number;
}

export interface CalendarDay {
  date: string;
  completedHabits: number;
  totalHabits: number;
  points: number;
  completionPercentage: number;
  hasStreak: boolean;
  entries: HabitEntry[];
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalDays: number;
  activeDays: number;
  averageCompletion: number;
  longestStreak: number;
  totalPoints: number;
  categoryBreakdown: CategoryStats[];
}

export interface CategoryStats {
  category: HabitCategory;
  totalHabits: number;
  completedToday: number;
  averageScore: number;
  streak: number;
}

// Input types
export interface NewHabitInput {
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  trackingType?: TrackingType;
  description?: string;
  targetCount?: number;
  targetValue?: number;
  targetUnit?: string;
  points?: number;
  color?: string;
  icon?: string;
  order?: number;
}

export interface UpdateHabitInput {
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

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface HabitEntryInput {
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

export interface NewChallengeInput {
  name: string;
  description?: string;
  category?: HabitCategory;
  startDate: string;
  endDate: string;
  targetValue: number;
  reward?: string;
}

export interface ResetProgressResult {
  success: boolean;
  message: string;
  resetsCount: number;
} 