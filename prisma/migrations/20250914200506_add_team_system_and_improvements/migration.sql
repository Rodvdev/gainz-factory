-- CreateEnum
CREATE TYPE "public"."TeamRole" AS ENUM ('TRAINER', 'NUTRITIONIST', 'YOGA_INSTRUCTOR', 'LIFE_COACH', 'CONTENT_CREATOR');

-- AlterTable
ALTER TABLE "public"."Programme" ADD COLUMN     "autoStart" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."UserProgramme" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgramme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProgrammeSequence" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "nextProgrammeId" TEXT,
    "autoStart" BOOLEAN NOT NULL DEFAULT false,
    "delayDays" INTEGER NOT NULL DEFAULT 0,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgrammeSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."TeamRole" NOT NULL,
    "specialty" TEXT[],
    "bio" TEXT,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hourlyRate" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CalendarEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "programmeId" TEXT,
    "teamMemberId" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" JSONB,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProgressMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "photoUrl" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClientAssignment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "ClientAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserProgramme_userId_idx" ON "public"."UserProgramme"("userId");

-- CreateIndex
CREATE INDEX "UserProgramme_programmeId_idx" ON "public"."UserProgramme"("programmeId");

-- CreateIndex
CREATE INDEX "UserProgramme_status_idx" ON "public"."UserProgramme"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgramme_userId_programmeId_key" ON "public"."UserProgramme"("userId", "programmeId");

-- CreateIndex
CREATE INDEX "UserAssignment_userId_idx" ON "public"."UserAssignment"("userId");

-- CreateIndex
CREATE INDEX "UserAssignment_contentType_idx" ON "public"."UserAssignment"("contentType");

-- CreateIndex
CREATE INDEX "UserAssignment_assignedBy_idx" ON "public"."UserAssignment"("assignedBy");

-- CreateIndex
CREATE INDEX "UserAssignment_isActive_idx" ON "public"."UserAssignment"("isActive");

-- CreateIndex
CREATE INDEX "ProgrammeSequence_programmeId_idx" ON "public"."ProgrammeSequence"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_userId_key" ON "public"."TeamMember"("userId");

-- CreateIndex
CREATE INDEX "TeamMember_role_idx" ON "public"."TeamMember"("role");

-- CreateIndex
CREATE INDEX "TeamMember_isActive_idx" ON "public"."TeamMember"("isActive");

-- CreateIndex
CREATE INDEX "TeamMember_isAvailable_idx" ON "public"."TeamMember"("isAvailable");

-- CreateIndex
CREATE INDEX "Schedule_teamMemberId_idx" ON "public"."Schedule"("teamMemberId");

-- CreateIndex
CREATE INDEX "Schedule_dayOfWeek_idx" ON "public"."Schedule"("dayOfWeek");

-- CreateIndex
CREATE INDEX "CalendarEvent_userId_idx" ON "public"."CalendarEvent"("userId");

-- CreateIndex
CREATE INDEX "CalendarEvent_type_idx" ON "public"."CalendarEvent"("type");

-- CreateIndex
CREATE INDEX "CalendarEvent_startTime_idx" ON "public"."CalendarEvent"("startTime");

-- CreateIndex
CREATE INDEX "CalendarEvent_teamMemberId_idx" ON "public"."CalendarEvent"("teamMemberId");

-- CreateIndex
CREATE INDEX "ProgressMetrics_userId_idx" ON "public"."ProgressMetrics"("userId");

-- CreateIndex
CREATE INDEX "ProgressMetrics_metricType_idx" ON "public"."ProgressMetrics"("metricType");

-- CreateIndex
CREATE INDEX "ProgressMetrics_date_idx" ON "public"."ProgressMetrics"("date");

-- CreateIndex
CREATE INDEX "ClientAssignment_clientId_idx" ON "public"."ClientAssignment"("clientId");

-- CreateIndex
CREATE INDEX "ClientAssignment_teamMemberId_idx" ON "public"."ClientAssignment"("teamMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAssignment_clientId_teamMemberId_key" ON "public"."ClientAssignment"("clientId", "teamMemberId");

-- AddForeignKey
ALTER TABLE "public"."UserProgramme" ADD CONSTRAINT "UserProgramme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgramme" ADD CONSTRAINT "UserProgramme_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "public"."Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAssignment" ADD CONSTRAINT "UserAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgrammeSequence" ADD CONSTRAINT "ProgrammeSequence_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "public"."Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "public"."TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarEvent" ADD CONSTRAINT "CalendarEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarEvent" ADD CONSTRAINT "CalendarEvent_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "public"."Programme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarEvent" ADD CONSTRAINT "CalendarEvent_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "public"."TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgressMetrics" ADD CONSTRAINT "ProgressMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientAssignment" ADD CONSTRAINT "ClientAssignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientAssignment" ADD CONSTRAINT "ClientAssignment_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "public"."TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
