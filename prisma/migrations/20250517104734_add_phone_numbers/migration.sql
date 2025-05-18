/*
  Warnings:

  - Made the column `phoneNumber` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `phoneNumber` to the `RestaurantManager` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column with a default value
ALTER TABLE "RestaurantManager" ADD COLUMN "phoneNumber" TEXT NOT NULL DEFAULT '+00000000000';

-- Then remove the default constraint
ALTER TABLE "RestaurantManager" ALTER COLUMN "phoneNumber" DROP DEFAULT;
