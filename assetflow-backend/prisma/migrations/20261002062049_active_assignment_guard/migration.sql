-- CreateIndex
CREATE INDEX "AssetAssignment_assetId_status_idx" ON "AssetAssignment"("assetId", "status");

-- An asset may have at most one ACTIVE assignment at a time
CREATE UNIQUE INDEX "AssetAssignment_one_active_per_asset"
ON "AssetAssignment" ("assetId")
WHERE "status" = 'ACTIVE';