/*
  Warnings:

  - Made the column `phoneNumber` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;
