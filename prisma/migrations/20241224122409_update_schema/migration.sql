/*
  Warnings:

  - Made the column `Description` on table `Dress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dress" ALTER COLUMN "Description" SET NOT NULL;

-- CreateTable
CREATE TABLE "Size" (
    "SizeID" SERIAL NOT NULL,
    "Size" TEXT NOT NULL,
    "DressID" INTEGER NOT NULL,
    "Stock" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("SizeID")
);

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_DressID_fkey" FOREIGN KEY ("DressID") REFERENCES "Dress"("DressID") ON DELETE RESTRICT ON UPDATE CASCADE;
