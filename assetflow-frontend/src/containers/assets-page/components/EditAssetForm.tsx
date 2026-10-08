'use client';

import { FormEvent, useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Asset, AssetCondition, ASSET_CONDITIONS, UpdateAssetInput } from '@/types/asset.types';
import { Category } from '@/types/category.types';
import { statusLabel } from '../utils/asset-filters';

interface Props {
  asset: Asset;
  categories: Category[];
  saving: boolean;
  error: string | null;
  onSubmit: (input: UpdateAssetInput) => Promise<boolean>;
  onCancel: () => void;
}

type FormValues = {
  name: string;
  serialNumber: string;
  brand: string;
  model: string;
  categoryId: string;
  condition: string;
  purchaseDate: string;
  purchasePrice: string;
  notes: string;
};
type FormErrors = Partial<Record<keyof FormValues, string>>;

const optional = (v: string) => v.trim() || undefined;

export default function EditAssetForm({ asset, categories, saving, error, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>({
    name: asset.name,
    serialNumber: asset.serialNumber ?? '',
    brand: asset.brand ?? '',
    model: asset.model ?? '',
    categoryId: asset.categoryId,
    condition: asset.condition,
    purchaseDate: asset.purchaseDate ? asset.purchaseDate.slice(0, 10) : '',
    purchasePrice: asset.purchasePrice ?? '',
    notes: asset.notes ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [info, setInfo] = useState<string | null>(null);

  const set = (field: keyof FormValues) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setInfo(null);

    const errs: FormErrors = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!values.categoryId) errs.categoryId = 'Select a category';
    if (
      values.purchasePrice !== '' &&
      (Number.isNaN(Number(values.purchasePrice)) || Number(values.purchasePrice) < 0)
    ) {
      errs.purchasePrice = 'Enter a valid price';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const next = {
      name: values.name.trim(),
      serialNumber: optional(values.serialNumber),
      brand: optional(values.brand),
      model: optional(values.model),
      categoryId: values.categoryId,
      condition: values.condition,
      purchaseDate: optional(values.purchaseDate),
      purchasePrice: values.purchasePrice === '' ? undefined : Number(values.purchasePrice),
      notes: optional(values.notes),
    };
    const before = {
      name: asset.name,
      serialNumber: asset.serialNumber ?? undefined,
      brand: asset.brand ?? undefined,
      model: asset.model ?? undefined,
      categoryId: asset.categoryId,
      condition: asset.condition as string,
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.slice(0, 10) : undefined,
      purchasePrice: asset.purchasePrice !== null ? Number(asset.purchasePrice) : undefined,
      notes: asset.notes ?? undefined,
    };

    // Send only what actually changed
    const changes: Record<string, unknown> = {};
    (Object.keys(next) as (keyof typeof next)[]).forEach((key) => {
      if (next[key] !== undefined && next[key] !== before[key]) changes[key] = next[key];
    });

    if (Object.keys(changes).length === 0) {
      setInfo('No changes to save.');
      return;
    }
    await onSubmit(changes as UpdateAssetInput);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-gray-600">
        Asset code: <span className="font-medium text-gray-900">{asset.assetCode}</span> (cannot be
        changed)
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Name"
          value={values.name}
          onChange={(e) => set('name')(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Serial number"
          value={values.serialNumber}
          onChange={(e) => set('serialNumber')(e.target.value)}
        />
        <Select
          label="Category"
          value={values.categoryId}
          onChange={(e) => set('categoryId')(e.target.value)}
          options={categories
            .filter((c) => c.active || c.id === asset.categoryId)
            .map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Select a category"
          error={errors.categoryId}
        />
        <Select
          label="Condition"
          value={values.condition}
          onChange={(e) => set('condition')(e.target.value)}
          options={ASSET_CONDITIONS.map((c: AssetCondition) => ({ value: c, label: statusLabel(c) }))}
        />
        <Input label="Brand" value={values.brand} onChange={(e) => set('brand')(e.target.value)} />
        <Input label="Model" value={values.model} onChange={(e) => set('model')(e.target.value)} />
        <Input
          label="Purchase date"
          type="date"
          value={values.purchaseDate}
          onChange={(e) => set('purchaseDate')(e.target.value)}
        />
        <Input
          label="Purchase price"
          type="number"
          min="0"
          step="0.01"
          value={values.purchasePrice}
          onChange={(e) => set('purchasePrice')(e.target.value)}
          error={errors.purchasePrice}
        />
      </div>

      <Input label="Notes" value={values.notes} onChange={(e) => set('notes')(e.target.value)} />

      {info && <p className="text-sm text-gray-600">{info}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}