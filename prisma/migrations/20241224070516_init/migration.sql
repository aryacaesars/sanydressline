/*
  Warnings:

  - Added the required column `SubSection` to the `PageContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageContent" ADD COLUMN     "SubSection" TEXT NOT NULL;
