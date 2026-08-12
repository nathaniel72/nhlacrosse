-- CreateEnum
CREATE TYPE "HeroImageRole" AS ENUM ('BEFORE', 'AFTER');

-- AlterTable
ALTER TABLE "GalleryPhoto" ADD COLUMN     "heroRole" "HeroImageRole";
