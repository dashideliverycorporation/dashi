-- DropIndex
DROP INDEX "Order_orderNumber_idx";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "orderNumber" DROP NOT NULL,
ALTER COLUMN "orderNumber" DROP DEFAULT;
DROP SEQUENCE "Order_orderNumber_seq";

-- CreateIndex
CREATE INDEX "Order_displayOrderNumber_idx" ON "Order"("displayOrderNumber");
