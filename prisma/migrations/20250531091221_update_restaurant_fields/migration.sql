/*
  Warnings:

  - Made the column `imageUrl` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MenuItem" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "category" TEXT,
ADD COLUMN     "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "preparationTime" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;
