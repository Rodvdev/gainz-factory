-- CreateEnum
CREATE TYPE "public"."TestimonialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."LandingConfig" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroDescription" TEXT,
    "heroCtaPrimary" TEXT NOT NULL DEFAULT 'Comenzar Ahora',
    "heroCtaSecondary" TEXT NOT NULL DEFAULT 'Ver Recetas',
    "heroCtaPrimaryLink" TEXT NOT NULL DEFAULT '/onboarding/welcome',
    "heroCtaSecondaryLink" TEXT NOT NULL DEFAULT '/ebook',
    "statsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "stat1Title" TEXT NOT NULL DEFAULT '100%',
    "stat1Subtitle" TEXT NOT NULL DEFAULT 'Personalizado',
    "stat2Title" TEXT NOT NULL DEFAULT '24/7',
    "stat2Subtitle" TEXT NOT NULL DEFAULT 'Soporte',
    "stat3Title" TEXT NOT NULL DEFAULT '∞',
    "stat3Subtitle" TEXT NOT NULL DEFAULT 'Resultados',
    "productsTitle" TEXT NOT NULL DEFAULT 'Productos y Servicios',
    "productsSubtitle" TEXT NOT NULL DEFAULT 'Descubre todo lo que necesitas para tu transformación física y mental',
    "footerDescription" TEXT NOT NULL DEFAULT 'Tu plataforma integral para transformación física y mental.',
    "instagramHandle" TEXT NOT NULL DEFAULT '@elchepaaa',
    "whatsappNumber" TEXT NOT NULL DEFAULT '51978381334',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LandingProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#DC2626',
    "link" TEXT NOT NULL,
    "linkType" TEXT NOT NULL DEFAULT 'page',
    "motivational" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonial" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userImage" TEXT,
    "userLocation" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "beforeImage" TEXT,
    "afterImage" TEXT,
    "videoUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "rating" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."TestimonialStatus" NOT NULL DEFAULT 'PENDING',
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandingConfig_isActive_idx" ON "public"."LandingConfig"("isActive");

-- CreateIndex
CREATE INDEX "LandingProduct_isActive_idx" ON "public"."LandingProduct"("isActive");

-- CreateIndex
CREATE INDEX "LandingProduct_order_idx" ON "public"."LandingProduct"("order");

-- CreateIndex
CREATE INDEX "Testimonial_status_idx" ON "public"."Testimonial"("status");

-- CreateIndex
CREATE INDEX "Testimonial_isActive_idx" ON "public"."Testimonial"("isActive");

-- CreateIndex
CREATE INDEX "Testimonial_isFeatured_idx" ON "public"."Testimonial"("isFeatured");

-- CreateIndex
CREATE INDEX "Testimonial_category_idx" ON "public"."Testimonial"("category");
