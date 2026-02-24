-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_profileId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
