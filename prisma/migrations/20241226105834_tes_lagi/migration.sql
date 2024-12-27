/*
  Warnings:

  - Added the required column `EntityType` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "EntityType" TEXT NOT NULL;
