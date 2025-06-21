/*
  Warnings:

  - A unique constraint covering the columns `[displayOrderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayOrderNumber` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First add the columns with NULL allowed
ALTER TABLE "Order" ADD COLUMN "orderNumber" SERIAL,
ADD COLUMN "displayOrderNumber" TEXT;

-- Update existing records with sequential order numbers
UPDATE "Order" SET "displayOrderNumber" = CONCAT('#', LPAD(CAST("orderNumber" AS TEXT), 4, '0'));

-- Now make displayOrderNumber NOT NULL
ALTER TABLE "Order" ALTER COLUMN "displayOrderNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_displayOrderNumber_key" ON "Order"("displayOrderNumber");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");
