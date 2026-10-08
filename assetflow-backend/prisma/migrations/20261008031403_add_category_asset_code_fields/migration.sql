/*
  Warnings:

  - A unique constraint covering the columns `[codePrefix]` on the table `AssetCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AssetCategory" ADD COLUMN     "codePrefix" TEXT,
ADD COLUMN     "nextAssetNumber" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "AssetCategory_codePrefix_key" ON "AssetCategory"("codePrefix");
