import { PrismaClient } from '@prisma/client';

// Tipos de GraphQL para el sistema de crecimiento personal

// Usuario
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
  
  // Relaciones
  habits: Habit[];
  dailyScores: DailyScore[];
  challenges: Challenge[];
}

// Hábito
export interface Habit {
  id: string;
  userId: string;
  user: User;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetCount: number;
  trackingType: TrackingType;
  targetValue?: number;
  targetUnit?: string;
  points: number;
  color?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  
  // Relaciones
  entries: HabitEntry[];
  streaks: HabitStreak[];
  
  // Campos calculados
  currentStreak?: number;
  completedToday?: boolean;
  completionRate?: number;
}

// Resto de tipos existentes con ajustes para multi-usuario...
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

// Enums
export enum HabitCategory {
  MORNING_ROUTINE = 'MORNING_ROUTINE',
  PHYSICAL_TRAINING = 'PHYSICAL_TRAINING',
  NUTRITION = 'NUTRITION',
  DEEP_WORK = 'DEEP_WORK',
  PERSONAL_DEVELOPMENT = 'PERSONAL_DEVELOPMENT',
  SOCIAL_CHARISMA = 'SOCIAL_CHARISMA',
  REFLECTION = 'REFLECTION',
  SLEEP_RECOVERY = 'SLEEP_RECOVERY',
}

export enum HabitFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum EntryStatus {
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
}

export enum TrackingType {
  BINARY = 'BINARY',
  NUMERIC = 'NUMERIC',
  DURATION = 'DURATION',
  RATING = 'RATING',
  TEXT = 'TEXT',
}

// Input types para mutaciones
export interface NewUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  phoneNumber?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface NewHabitInput {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetCount?: number;
  trackingType?: TrackingType;
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
  targetCount?: number;
  trackingType?: TrackingType;
  targetValue?: number;
  targetUnit?: string;
  points?: number;
  color?: string;
  icon?: string;
  isActive?: boolean;
  order?: number;
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

// Contexto de GraphQL con usuario autenticado
export interface GraphQLContext {
  db: PrismaClient;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Tipos de categorías con metadata
export interface CategoryStats {
  category: HabitCategory;
  totalHabits: number;
  completedToday: number;
  averageScore: number;
  streak: number;
}

// Tipos para rankings y leaderboards
export interface UserRanking {
  user: User;
  totalPoints: number;
  rank: number;
  percentile: number;
} 