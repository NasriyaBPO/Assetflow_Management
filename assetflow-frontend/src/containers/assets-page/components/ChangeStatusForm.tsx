'use client';

import { FormEvent, useState } from 'react';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Asset, AssetStatus, ChangeAssetStatusInput } from '@/types/asset.types';
import { allowedNextStatuses } from '../utils/asset-transitions';
import { statusLabel, statusTone } from '../utils/asset-filters';

interface Props {
  asset: Asset;
  saving: boolean;
  error: string | null;
  onSubmit: (input: ChangeAssetStatusInput) => Promise<boolean>;
  onCancel: () => void;
}

export default function ChangeStatusForm({ asset, saving, error, onSubmit, onCancel }: Props) {
  const [status, setStatus] = useState<AssetStatus | ''>('');
  const [reason, setReason] = useState('');
  const [statusError, setStatusError] = useState<string | null>(null);

  const options = allowedNextStatuses(asset.status).map((s) => ({
    value: s,
    label: statusLabel(s),
  }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!status) {
      setStatusError('Select the new status');
      return;
    }
    setStatusError(null);
    await onSubmit({ status, reason: reason.trim() || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm">
        <span className="font-medium">{asset.assetCode}</span> · {asset.name} is currently{' '}
        <Badge tone={statusTone(asset.status)}>{statusLabel(asset.status)}</Badge>
      </p>

      <Select
        label="New status"
        value={status}
        onChange={(e) => setStatus(e.target.value as AssetStatus | '')}
        options={options}
        placeholder="Select new status"
        error={statusError}
      />

      {status === 'LOST' && asset.status === 'ASSIGNED' && (
        <p className="rounded bg-yellow-50 p-2 text-sm text-yellow-800">
          This asset is assigned. Marking it as lost will close the active assignment.
        </p>
      )}
      {status === 'RETIRED' && (
        <p className="rounded bg-yellow-50 p-2 text-sm text-yellow-800">
          Retired assets cannot be assigned again.
        </p>
      )}

      <Input
        label="Reason (optional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="e.g. Screen cracked"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Change status
        </Button>
      </div>
    </form>
  );
}