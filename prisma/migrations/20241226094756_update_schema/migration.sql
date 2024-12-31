/*
  Warnings:

  - You are about to drop the column `DressID` on the `Image` table. All the data in the column will be lost.
  - Added the required column `ForeignID` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UseIn` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_DressID_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "DressID",
ADD COLUMN     "ForeignID" INTEGER NOT NULL,
ADD COLUMN     "UseIn" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_Dress_ForeignID_fkey" FOREIGN KEY ("ForeignID") REFERENCES "Dress"("DressID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_PageContent_ForeignID_fkey" FOREIGN KEY ("ForeignID") REFERENCES "PageContent"("ContentID") ON DELETE RESTRICT ON UPDATE CASCADE;
