-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('NEW_HEAD', 'RESTRING_ONLY');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "serviceType" "ServiceType" NOT NULL DEFAULT 'NEW_HEAD';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "rushRequested" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "athleteName" TEXT NOT NULL,
    "resultOrTeam" TEXT,
    "quote" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInquiry" (
    "id" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "teamOrOrg" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamInquiry_pkey" PRIMARY KEY ("id")
);
