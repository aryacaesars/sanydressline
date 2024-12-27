/*
  Warnings:

  - You are about to drop the column `Content` on the `PageContent` table. All the data in the column will be lost.
  - You are about to drop the column `SubSection` on the `PageContent` table. All the data in the column will be lost.
  - Added the required column `Img` to the `PageContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Paragraph` to the `PageContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Title` to the `PageContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageContent" DROP COLUMN "Content",
DROP COLUMN "SubSection",
ADD COLUMN     "Img" JSONB NOT NULL,
ADD COLUMN     "Paragraph" TEXT NOT NULL,
ADD COLUMN     "Title" TEXT NOT NULL;
