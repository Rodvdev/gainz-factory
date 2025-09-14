-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "fitnessLevel" TEXT,
ADD COLUMN     "intensityPreference" TEXT,
ADD COLUMN     "motivationType" TEXT,
ADD COLUMN     "notificationPreferences" JSONB DEFAULT '[]',
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStep" TEXT DEFAULT 'welcome',
ADD COLUMN     "personalManifesto" TEXT,
ADD COLUMN     "preferredLanguage" TEXT DEFAULT 'es',
ADD COLUMN     "primaryGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "timezone" TEXT DEFAULT 'America/Lima',
ADD COLUMN     "weeklyCommitment" INTEGER DEFAULT 3;

-- CreateTable
CREATE TABLE "public"."OnboardingData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "objectivesCompletedAt" TIMESTAMP(3),
    "questionnaireAnswers" JSONB,
    "questionnaireCompletedAt" TIMESTAMP(3),
    "selectedHabits" JSONB,
    "habitsCompletedAt" TIMESTAMP(3),
    "scheduleData" JSONB,
    "scheduleCompletedAt" TIMESTAMP(3),
    "profileCompletedAt" TIMESTAMP(3),
    "personalBio" TEXT,
    "customManifesto" TEXT,
    "currentStep" TEXT NOT NULL DEFAULT 'welcome',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HabitSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "specificTime" TEXT NOT NULL,
    "daysOfWeek" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reminderMinutes" INTEGER DEFAULT 15,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingData_userId_key" ON "public"."OnboardingData"("userId");

-- CreateIndex
CREATE INDEX "OnboardingData_userId_idx" ON "public"."OnboardingData"("userId");

-- CreateIndex
CREATE INDEX "OnboardingData_isCompleted_idx" ON "public"."OnboardingData"("isCompleted");

-- CreateIndex
CREATE INDEX "HabitSchedule_userId_idx" ON "public"."HabitSchedule"("userId");

-- CreateIndex
CREATE INDEX "HabitSchedule_daysOfWeek_idx" ON "public"."HabitSchedule"("daysOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "HabitSchedule_habitId_key" ON "public"."HabitSchedule"("habitId");

-- CreateIndex
CREATE INDEX "User_onboardingCompleted_idx" ON "public"."User"("onboardingCompleted");

-- AddForeignKey
ALTER TABLE "public"."OnboardingData" ADD CONSTRAINT "OnboardingData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitSchedule" ADD CONSTRAINT "HabitSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitSchedule" ADD CONSTRAINT "HabitSchedule_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "public"."Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
