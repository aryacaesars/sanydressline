/*
  Warnings:

  - You are about to drop the column `ForeignID` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_Dress_ForeignID_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_PageContent_ForeignID_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "ForeignID",
ADD COLUMN     "DressID" INTEGER,
ADD COLUMN     "PageContentID" INTEGER;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_DressID_fkey" FOREIGN KEY ("DressID") REFERENCES "Dress"("DressID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_PageContentID_fkey" FOREIGN KEY ("PageContentID") REFERENCES "PageContent"("ContentID") ON DELETE SET NULL ON UPDATE CASCADE;
