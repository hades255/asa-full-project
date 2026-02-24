/*
  Warnings:

  - The values [LEISURE,OTHER,COMFORT] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryType_new" AS ENUM ('WORKSPACE', 'RELAXATION', 'DINING', 'SLEEP', 'TRAVEL', 'POLICIES', 'SPECIAL_OFFERS', 'BEACH_CLUB');
ALTER TABLE "Category" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Category" ALTER COLUMN "type" TYPE "CategoryType_new" USING ("type"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "CategoryType_old";
ALTER TABLE "Category" ALTER COLUMN "type" SET DEFAULT 'WORKSPACE';
COMMIT;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "type" SET DEFAULT 'WORKSPACE';

-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferenceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_title_key" ON "Preference"("title");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_preferenceId_key" ON "UserPreference"("userId", "preferenceId");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Preference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "Preference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
