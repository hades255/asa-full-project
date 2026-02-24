-- AlterTable
-- Make profileId optional in Review table to allow vendor reviews of customers
ALTER TABLE "Review" ALTER COLUMN "profileId" DROP NOT NULL;

