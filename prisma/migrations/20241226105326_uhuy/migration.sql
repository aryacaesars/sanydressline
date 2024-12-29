/*
  Warnings:

  - You are about to drop the column `EntityType` on the `Image` table. All the data in the column will be lost.
  - Added the required column `UseIn` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "EntityType",
ADD COLUMN     "UseIn" TEXT NOT NULL;

-- RenameForeignKey
ALTER TABLE "Image" RENAME CONSTRAINT "Dress_ForeignID" TO "Image_Dress_ForeignID_fkey";

-- RenameForeignKey
ALTER TABLE "Image" RENAME CONSTRAINT "PageContent_ForeignID" TO "Image_PageContent_ForeignID_fkey";
