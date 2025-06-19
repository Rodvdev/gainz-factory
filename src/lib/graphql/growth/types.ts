import { PrismaClient } from '@prisma/client';

export interface GraphQLContext {
  db: PrismaClient;
  tenantId: string;
  user: {
    id: string;
    email?: string;
  };
}

export interface NewHabitInput {
  name: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  description?: string;
  targetCount?: number;
}

export interface UpdateHabitInput {
  name?: string;
  description?: string;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  targetCount?: number;
  isActive?: boolean;
  order?: number;
}

export interface HabitEntryInput {
  habitId: string;
  date: string;
  status: 'COMPLETED' | 'SKIPPED' | 'PARTIAL' | 'FAILED';
  note?: string;
} 