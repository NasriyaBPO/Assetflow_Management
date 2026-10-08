import { AssetStatus } from '@/types/asset.types';

// Mirrors the backend's MANUAL_STATUS_TRANSITIONS so the UI only offers valid choices.
// The backend still enforces the rules; this only improves the user experience.
export const MANUAL_STATUS_TRANSITIONS: Record<AssetStatus, AssetStatus[]> = {
  AVAILABLE: ['DAMAGED', 'LOST', 'RETIRED'],
  ASSIGNED: ['LOST'],
  DAMAGED: ['UNDER_REPAIR', 'RETIRED'],
  UNDER_REPAIR: ['AVAILABLE', 'RETIRED'],
  LOST: [],
  RETIRED: [],
};

export const allowedNextStatuses = (status: AssetStatus): AssetStatus[] =>
  MANUAL_STATUS_TRANSITIONS[status];