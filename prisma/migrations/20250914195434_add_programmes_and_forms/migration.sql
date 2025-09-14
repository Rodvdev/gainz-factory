-- CreateEnum
CREATE TYPE "public"."ContentCategory" AS ENUM ('EXERCISE', 'ROUTINE', 'DIET', 'MINDSET');

-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('WORKOUT', 'CARDIO', 'VIDEO', 'NUTRITION', 'RECORD_PROGRESS', 'PHOTO', 'SESSION', 'MESSAGE', 'FORM');

-- CreateEnum
CREATE TYPE "public"."InputType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'PASSWORD', 'DATE', 'TIME', 'SELECT', 'MULTISELECT', 'RADIO', 'CHECKBOX', 'FILE', 'RATING', 'SLIDER', 'URL', 'PHONE', 'COLOR');

-- CreateEnum
CREATE TYPE "public"."AchievementRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "public"."AchievementCategory" AS ENUM ('STREAK', 'HABITS', 'CHALLENGES', 'MILESTONE', 'SOCIAL', 'CONSISTENCY');

-- AlterTable
ALTER TABLE "public"."Exercise" ADD COLUMN     "category" "public"."ContentCategory" NOT NULL DEFAULT 'EXERCISE';

-- AlterTable
ALTER TABLE "public"."Recipe" ADD COLUMN     "category" "public"."ContentCategory" NOT NULL DEFAULT 'DIET';

-- AlterTable
ALTER TABLE "public"."WorkoutRoutine" ADD COLUMN     "category" "public"."ContentCategory" NOT NULL DEFAULT 'ROUTINE';

-- CreateTable
CREATE TABLE "public"."MindsetContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "category" "public"."ContentCategory" NOT NULL DEFAULT 'MINDSET',
    "level" "public"."UserLevel",
    "type" TEXT,
    "duration" INTEGER,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MindsetContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Programme" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."ContentCategory" NOT NULL,
    "level" "public"."UserLevel",
    "duration" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeeklyPlan" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DailyTask" (
    "id" TEXT NOT NULL,
    "weeklyPlanId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "taskType" "public"."TaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskData" JSONB,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "estimatedDuration" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "submittedData" JSONB,
    "files" TEXT[],
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Form" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."ContentCategory",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InputField" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "public"."InputType" NOT NULL,
    "placeholder" TEXT,
    "helpText" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "minLength" INTEGER,
    "maxLength" INTEGER,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "pattern" TEXT,
    "options" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "width" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InputField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FormSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "files" TEXT[],
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "feedback" TEXT,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" "public"."AchievementRarity" NOT NULL DEFAULT 'COMMON',
    "category" "public"."AchievementCategory" NOT NULL DEFAULT 'HABITS',
    "points" INTEGER NOT NULL DEFAULT 10,
    "requirements" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isViewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserLevelData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "currentLevelXP" INTEGER NOT NULL DEFAULT 0,
    "nextLevelXP" INTEGER NOT NULL DEFAULT 100,
    "levelName" TEXT NOT NULL DEFAULT 'Novato GF',
    "avatarEmoji" TEXT NOT NULL DEFAULT '🥚',
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "achievementsUnlocked" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLevelData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LevelConfig" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "requiredXP" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "benefits" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LevelConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Programme_isActive_idx" ON "public"."Programme"("isActive");

-- CreateIndex
CREATE INDEX "Programme_category_idx" ON "public"."Programme"("category");

-- CreateIndex
CREATE INDEX "WeeklyPlan_programmeId_idx" ON "public"."WeeklyPlan"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPlan_programmeId_weekNumber_key" ON "public"."WeeklyPlan"("programmeId", "weekNumber");

-- CreateIndex
CREATE INDEX "DailyTask_weeklyPlanId_dayOfWeek_idx" ON "public"."DailyTask"("weeklyPlanId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "DailyTask_taskType_idx" ON "public"."DailyTask"("taskType");

-- CreateIndex
CREATE INDEX "TaskSubmission_userId_idx" ON "public"."TaskSubmission"("userId");

-- CreateIndex
CREATE INDEX "TaskSubmission_taskId_idx" ON "public"."TaskSubmission"("taskId");

-- CreateIndex
CREATE INDEX "TaskSubmission_completedAt_idx" ON "public"."TaskSubmission"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TaskSubmission_userId_taskId_key" ON "public"."TaskSubmission"("userId", "taskId");

-- CreateIndex
CREATE INDEX "Form_isActive_idx" ON "public"."Form"("isActive");

-- CreateIndex
CREATE INDEX "Form_category_idx" ON "public"."Form"("category");

-- CreateIndex
CREATE INDEX "InputField_formId_idx" ON "public"."InputField"("formId");

-- CreateIndex
CREATE INDEX "InputField_order_idx" ON "public"."InputField"("order");

-- CreateIndex
CREATE INDEX "FormSubmission_formId_idx" ON "public"."FormSubmission"("formId");

-- CreateIndex
CREATE INDEX "FormSubmission_userId_idx" ON "public"."FormSubmission"("userId");

-- CreateIndex
CREATE INDEX "FormSubmission_submittedAt_idx" ON "public"."FormSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "FormSubmission_status_idx" ON "public"."FormSubmission"("status");

-- CreateIndex
CREATE INDEX "Achievement_rarity_idx" ON "public"."Achievement"("rarity");

-- CreateIndex
CREATE INDEX "Achievement_category_idx" ON "public"."Achievement"("category");

-- CreateIndex
CREATE INDEX "Achievement_isActive_idx" ON "public"."Achievement"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_title_category_key" ON "public"."Achievement"("title", "category");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "public"."UserAchievement"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_unlockedAt_idx" ON "public"."UserAchievement"("unlockedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "public"."UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLevelData_userId_key" ON "public"."UserLevelData"("userId");

-- CreateIndex
CREATE INDEX "UserLevelData_userId_idx" ON "public"."UserLevelData"("userId");

-- CreateIndex
CREATE INDEX "UserLevelData_currentLevel_idx" ON "public"."UserLevelData"("currentLevel");

-- CreateIndex
CREATE UNIQUE INDEX "LevelConfig_level_key" ON "public"."LevelConfig"("level");

-- CreateIndex
CREATE INDEX "LevelConfig_level_idx" ON "public"."LevelConfig"("level");

-- CreateIndex
CREATE INDEX "LevelConfig_isActive_idx" ON "public"."LevelConfig"("isActive");

-- AddForeignKey
ALTER TABLE "public"."WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "public"."Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DailyTask" ADD CONSTRAINT "DailyTask_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "public"."WeeklyPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskSubmission" ADD CONSTRAINT "TaskSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskSubmission" ADD CONSTRAINT "TaskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."DailyTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InputField" ADD CONSTRAINT "InputField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "public"."Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLevelData" ADD CONSTRAINT "UserLevelData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
