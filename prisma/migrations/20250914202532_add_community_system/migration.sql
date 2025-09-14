-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."CommunityBlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featuredImage" TEXT,
    "status" "public"."PostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "authorId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityBlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Forum" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ForumTopic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "forumId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "lastReplyAt" TIMESTAMP(3),
    "lastReplyBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ForumReply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isSolution" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_BlogCategoryToCommunityBlogPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogCategoryToCommunityBlogPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_BlogTagToCommunityBlogPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogTagToCommunityBlogPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityBlogPost_slug_key" ON "public"."CommunityBlogPost"("slug");

-- CreateIndex
CREATE INDEX "CommunityBlogPost_status_idx" ON "public"."CommunityBlogPost"("status");

-- CreateIndex
CREATE INDEX "CommunityBlogPost_publishedAt_idx" ON "public"."CommunityBlogPost"("publishedAt");

-- CreateIndex
CREATE INDEX "CommunityBlogPost_authorId_idx" ON "public"."CommunityBlogPost"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_name_key" ON "public"."BlogCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "public"."BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTag_name_key" ON "public"."BlogTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTag_slug_key" ON "public"."BlogTag"("slug");

-- CreateIndex
CREATE INDEX "BlogComment_postId_idx" ON "public"."BlogComment"("postId");

-- CreateIndex
CREATE INDEX "BlogComment_authorId_idx" ON "public"."BlogComment"("authorId");

-- CreateIndex
CREATE INDEX "BlogComment_isApproved_idx" ON "public"."BlogComment"("isApproved");

-- CreateIndex
CREATE UNIQUE INDEX "Forum_slug_key" ON "public"."Forum"("slug");

-- CreateIndex
CREATE INDEX "Forum_isActive_idx" ON "public"."Forum"("isActive");

-- CreateIndex
CREATE INDEX "Forum_order_idx" ON "public"."Forum"("order");

-- CreateIndex
CREATE INDEX "ForumTopic_forumId_idx" ON "public"."ForumTopic"("forumId");

-- CreateIndex
CREATE INDEX "ForumTopic_authorId_idx" ON "public"."ForumTopic"("authorId");

-- CreateIndex
CREATE INDEX "ForumTopic_isPinned_idx" ON "public"."ForumTopic"("isPinned");

-- CreateIndex
CREATE INDEX "ForumTopic_lastReplyAt_idx" ON "public"."ForumTopic"("lastReplyAt");

-- CreateIndex
CREATE INDEX "ForumReply_topicId_idx" ON "public"."ForumReply"("topicId");

-- CreateIndex
CREATE INDEX "ForumReply_authorId_idx" ON "public"."ForumReply"("authorId");

-- CreateIndex
CREATE INDEX "ForumReply_isSolution_idx" ON "public"."ForumReply"("isSolution");

-- CreateIndex
CREATE INDEX "_BlogCategoryToCommunityBlogPost_B_index" ON "public"."_BlogCategoryToCommunityBlogPost"("B");

-- CreateIndex
CREATE INDEX "_BlogTagToCommunityBlogPost_B_index" ON "public"."_BlogTagToCommunityBlogPost"("B");

-- AddForeignKey
ALTER TABLE "public"."CommunityBlogPost" ADD CONSTRAINT "CommunityBlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."CommunityBlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogComment" ADD CONSTRAINT "BlogComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."BlogComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumTopic" ADD CONSTRAINT "ForumTopic_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumTopic" ADD CONSTRAINT "ForumTopic_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "public"."Forum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumReply" ADD CONSTRAINT "ForumReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumReply" ADD CONSTRAINT "ForumReply_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForumReply" ADD CONSTRAINT "ForumReply_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."ForumReply"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogCategoryToCommunityBlogPost" ADD CONSTRAINT "_BlogCategoryToCommunityBlogPost_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogCategoryToCommunityBlogPost" ADD CONSTRAINT "_BlogCategoryToCommunityBlogPost_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."CommunityBlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogTagToCommunityBlogPost" ADD CONSTRAINT "_BlogTagToCommunityBlogPost_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BlogTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BlogTagToCommunityBlogPost" ADD CONSTRAINT "_BlogTagToCommunityBlogPost_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."CommunityBlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
