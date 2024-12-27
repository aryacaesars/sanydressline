/*
  Warnings:

  - You are about to drop the column `Status` on the `Dress` table. All the data in the column will be lost.
  - You are about to drop the column `Stock` on the `Dress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dress" DROP COLUMN "Status",
DROP COLUMN "Stock";
