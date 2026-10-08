
export const ASSET_STATUSES = [
  'AVAILABLE',
  'ASSIGNED',
  'DAMAGED',
  'UNDER_REPAIR',
  'LOST',
  'RETIRED',
] as const;

export type AssetStatus =
  (typeof ASSET_STATUSES)[number];

export const ASSET_CONDITIONS = [
  'NEW',
  'GOOD',
  'FAIR',
  'DAMAGED',
] as const;

export type AssetCondition =
  (typeof ASSET_CONDITIONS)[number];

export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  serialNumber: string | null;
  brand: string | null;
  model: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  status: AssetStatus;
  condition: AssetCondition;
  purchaseDate: string | null;
  purchasePrice: string | null;
  warrantyExpiryDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AssetQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: AssetStatus | '';
  categoryId?: string;
  sortBy?: 'createdAt' | 'name' | 'assetCode' | 'status';
  sortOrder?: 'asc' | 'desc';
};

// Single asset registration
// Asset code is generated automatically by the backend.
export interface CreateAssetInput {
  name: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  categoryId: string;
  condition?: AssetCondition;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiryDate?: string;
  notes?: string;
}

// Editing an existing asset
export type UpdateAssetInput =
  Partial<CreateAssetInput>;

// Bulk asset registration
export interface BulkCreateAssetsInput {
  asset: Omit<CreateAssetInput, 'serialNumber'>;
  quantity: number;
  serialNumbers?: string[];
}

// Bulk creation API response
export interface BulkCreateAssetsResponse {
  message: string;
  count: number;
  assets: Asset[];
}

export interface ChangeAssetStatusInput {
  status: AssetStatus;
  reason?: string;
}

export interface AssetHistory {
  id: string;
  assetId: string;
  action: string;
  previousStatus: AssetStatus | null;
  newStatus: AssetStatus | null;
  performedBy: string | null;
  description: string | null;
  createdAt: string;
}
