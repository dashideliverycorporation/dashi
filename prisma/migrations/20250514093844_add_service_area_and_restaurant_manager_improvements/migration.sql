-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "serviceArea" TEXT;

-- CreateIndex
CREATE INDEX "RestaurantManager_restaurantId_idx" ON "RestaurantManager"("restaurantId");
