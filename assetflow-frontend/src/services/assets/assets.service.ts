
import { apiClient } from '@/libs/api/api-client';

import {
  Asset,
  AssetHistory,
  AssetQuery,
  BulkCreateAssetsInput,
  BulkCreateAssetsResponse,
  ChangeAssetStatusInput,
  CreateAssetInput,
  UpdateAssetInput,
} from '@/types/asset.types';

import { Paginated } from '@/types/common.types';

export const assetsService = {
  list: (query: AssetQuery, signal?: AbortSignal) =>
    apiClient.get<Paginated<Asset>>(
      '/assets',
      query,
      signal,
    ),

  get: (id: string) =>
    apiClient.get<Asset>(`/assets/${id}`),

  getHistory: (id: string) =>
    apiClient.get<AssetHistory[]>(
      `/assets/${id}/history`,
    ),

  // Single asset creation
  create: (input: CreateAssetInput) =>
    apiClient.post<Asset>(
      '/assets',
      input,
    ),

  // Bulk asset creation
  createBulk: (input: BulkCreateAssetsInput) =>
    apiClient.post<BulkCreateAssetsResponse>(
      '/assets/bulk',
      input,
    ),

  update: (
    id: string,
    input: UpdateAssetInput,
  ) =>
    apiClient.patch<Asset>(
      `/assets/${id}`,
      input,
    ),

  changeStatus: (
    id: string,
    input: ChangeAssetStatusInput,
  ) =>
    apiClient.patch<Asset>(
      `/assets/${id}/status`,
      input,
    ),
};
