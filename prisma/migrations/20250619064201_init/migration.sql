-- CreateEnum
CREATE TYPE "HabitFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('COMPLETED', 'SKIPPED', 'PARTIAL', 'FAILED');

-- CreateEnum
CREATE TYPE "HabitCategory" AS ENUM ('MORNING_ROUTINE', 'PHYSICAL_TRAINING', 'NUTRITION', 'DEEP_WORK', 'PERSONAL_DEVELOPMENT', 'SOCIAL_CHARISMA', 'REFLECTION', 'SLEEP_RECOVERY');

-- CreateEnum
CREATE TYPE "TrackingType" AS ENUM ('BINARY', 'NUMERIC', 'DURATION', 'RATING', 'TEXT');

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "HabitCategory" NOT NULL,
    "frequency" "HabitFrequency" NOT NULL,
    "targetCount" INTEGER NOT NULL DEFAULT 1,
    "trackingType" "TrackingType" NOT NULL DEFAULT 'BINARY',
    "targetValue" DOUBLE PRECISION,
    "targetUnit" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "color" TEXT DEFAULT '#3B82F6',
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitEntry" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "EntryStatus" NOT NULL,
    "value" DOUBLE PRECISION,
    "textValue" TEXT,
    "note" TEXT,
    "timeSpent" INTEGER,
    "difficulty" INTEGER,
    "mood" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitStreak" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "length" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "completedHabits" INTEGER NOT NULL DEFAULT 0,
    "totalHabits" INTEGER NOT NULL DEFAULT 0,
    "morningScore" INTEGER NOT NULL DEFAULT 0,
    "physicalScore" INTEGER NOT NULL DEFAULT 0,
    "nutritionScore" INTEGER NOT NULL DEFAULT 0,
    "workScore" INTEGER NOT NULL DEFAULT 0,
    "developmentScore" INTEGER NOT NULL DEFAULT 0,
    "socialScore" INTEGER NOT NULL DEFAULT 0,
    "reflectionScore" INTEGER NOT NULL DEFAULT 0,
    "sleepScore" INTEGER NOT NULL DEFAULT 0,
    "percentile" DOUBLE PRECISION,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "HabitCategory",
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "reward" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Habit_userId_idx" ON "Habit"("userId");

-- CreateIndex
CREATE INDEX "Habit_category_idx" ON "Habit"("category");

-- CreateIndex
CREATE INDEX "HabitEntry_habitId_idx" ON "HabitEntry"("habitId");

-- CreateIndex
CREATE INDEX "HabitEntry_date_idx" ON "HabitEntry"("date");

-- CreateIndex
CREATE UNIQUE INDEX "HabitEntry_habitId_date_key" ON "HabitEntry"("habitId", "date");

-- CreateIndex
CREATE INDEX "HabitStreak_habitId_idx" ON "HabitStreak"("habitId");

-- CreateIndex
CREATE INDEX "HabitStreak_isActive_idx" ON "HabitStreak"("isActive");

-- CreateIndex
CREATE INDEX "DailyScore_userId_idx" ON "DailyScore"("userId");

-- CreateIndex
CREATE INDEX "DailyScore_date_idx" ON "DailyScore"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyScore_userId_date_key" ON "DailyScore"("userId", "date");

-- CreateIndex
CREATE INDEX "Challenge_userId_idx" ON "Challenge"("userId");

-- CreateIndex
CREATE INDEX "Challenge_isCompleted_idx" ON "Challenge"("isCompleted");

-- AddForeignKey
ALTER TABLE "HabitEntry" ADD CONSTRAINT "HabitEntry_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitStreak" ADD CONSTRAINT "HabitStreak_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
