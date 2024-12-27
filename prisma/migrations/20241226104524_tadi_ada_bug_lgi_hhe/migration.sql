/*
  Warnings:

  - You are about to drop the column `DressID` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `PageContentID` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `UseIn` on the `Image` table. All the data in the column will be lost.
  - Added the required column `EntityType` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ForeignID` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_DressID_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_PageContentID_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "DressID",
DROP COLUMN "PageContentID",
DROP COLUMN "UseIn",
ADD COLUMN     "EntityType" TEXT NOT NULL,
ADD COLUMN     "ForeignID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Dress_ForeignID" FOREIGN KEY ("ForeignID") REFERENCES "Dress"("DressID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "PageContent_ForeignID" FOREIGN KEY ("ForeignID") REFERENCES "PageContent"("ContentID") ON DELETE RESTRICT ON UPDATE CASCADE;
