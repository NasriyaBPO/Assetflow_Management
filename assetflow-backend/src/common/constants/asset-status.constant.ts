import { AssetStatus } from '@prisma/client';

// Transitions allowed through the manual status endpoint.
// ASSIGNED is not here as a target: only the assignment workflow can set it.
// Return transitions (ASSIGNED -> AVAILABLE/DAMAGED) belong to the return workflow.
export const MANUAL_STATUS_TRANSITIONS: Record<AssetStatus, AssetStatus[]> = {
  AVAILABLE: ['DAMAGED', 'LOST', 'RETIRED'],
  ASSIGNED: ['LOST'],
  DAMAGED: ['UNDER_REPAIR', 'RETIRED'],
  UNDER_REPAIR: ['AVAILABLE', 'RETIRED'],
  LOST: [],
  RETIRED: [],
};