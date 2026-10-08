import { Tone } from '@/components/Badge';
import { AssetQuery, AssetStatus, ASSET_STATUSES } from '@/types/asset.types';

export const DEFAULT_LIMIT = 10;

export const DEFAULT_FILTERS: AssetQuery = {
  page: 1,
  limit: DEFAULT_LIMIT,
  search: '',
  status: '',
  categoryId: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function statusLabel(status: string): string {
  const text = status.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function statusTone(status: AssetStatus): Tone {
  const tones: Record<AssetStatus, Tone> = {
    AVAILABLE: 'green',
    ASSIGNED: 'blue',
    DAMAGED: 'red',
    UNDER_REPAIR: 'yellow',
    LOST: 'red',
    RETIRED: 'gray',
  };
  return tones[status];
}

export const STATUS_OPTIONS = ASSET_STATUSES.map((s) => ({ value: s, label: statusLabel(s) }));

export function hasActiveFilters(f: AssetQuery): boolean {
  return Boolean(f.search || f.status || f.categoryId);
}