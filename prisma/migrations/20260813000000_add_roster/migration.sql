-- CreateTable
CREATE TABLE "RosterAthlete" (
    "id" TEXT NOT NULL,
    "athleteName" TEXT NOT NULL,
    "program" TEXT,
    "photoUrl" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RosterAthlete_pkey" PRIMARY KEY ("id")
);
