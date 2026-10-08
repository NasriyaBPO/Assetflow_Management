
'use client';

import { FormEvent, useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';

import {
  AssetCondition,
  ASSET_CONDITIONS,
  CreateAssetInput,
} from '@/types/asset.types';

import { Category } from '@/types/category.types';
import { statusLabel } from '../utils/asset-filters';

interface Props {
  categories: Category[];
  saving: boolean;
  error: string | null;
  onSubmit: (input: CreateAssetInput) => Promise<boolean>;
  onCancel: () => void;
}

const EMPTY = {
  name: '',
  serialNumber: '',
  brand: '',
  model: '',
  categoryId: '',
  condition: 'NEW',
  purchaseDate: '',
  purchasePrice: '',
  notes: '',
};

type FormValues = typeof EMPTY;

type FormErrors =
  Partial<Record<keyof FormValues, string>>;

const optional = (value: string) =>
  value.trim() || undefined;

export default function CreateAssetForm({
  categories,
  saving,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] =
    useState<FormValues>({ ...EMPTY });

  const [errors, setErrors] =
    useState<FormErrors>({});

  const set =
    (field: keyof FormValues) =>
    (value: string) =>
      setValues((previous) => ({
        ...previous,
        [field]: value,
      }));

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!values.name.trim()) {
      errs.name = 'Name is required';
    }

    if (!values.categoryId) {
      errs.categoryId = 'Select a category';
    }

    if (
      values.purchasePrice !== '' &&
      (
        !Number.isFinite(Number(values.purchasePrice)) ||
        Number(values.purchasePrice) < 0
      )
    ) {
      errs.purchasePrice = 'Enter a valid price';
    }

    return errs;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (saving) return;

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    const input: CreateAssetInput = {
      name: values.name.trim(),
      serialNumber: optional(values.serialNumber),
      brand: optional(values.brand),
      model: optional(values.model),
      categoryId: values.categoryId,
      condition: values.condition as AssetCondition,
      purchaseDate: optional(values.purchaseDate),
      purchasePrice:
        values.purchasePrice === ''
          ? undefined
          : Number(values.purchasePrice),
      notes: optional(values.notes),
    };

    const ok = await onSubmit(input);

    if (ok) {
      setValues({ ...EMPTY });
      setErrors({});
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <div className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
        Asset code will be generated automatically
        based on the selected category.
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Name"
          value={values.name}
          onChange={(event) =>
            set('name')(event.target.value)
          }
          placeholder="Dell Latitude 5450"
          error={errors.name}
        />

        <Input
          label="Serial number"
          value={values.serialNumber}
          onChange={(event) =>
            set('serialNumber')(event.target.value)
          }
          placeholder="Optional"
        />

        <Select
          label="Category"
          value={values.categoryId}
          onChange={(event) =>
            set('categoryId')(event.target.value)
          }
          options={categories
            .filter((category) => category.active)
            .map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          placeholder="Select a category"
          error={errors.categoryId}
        />

        <Input
          label="Brand"
          value={values.brand}
          onChange={(event) =>
            set('brand')(event.target.value)
          }
        />

        <Input
          label="Model"
          value={values.model}
          onChange={(event) =>
            set('model')(event.target.value)
          }
        />

        <Select
          label="Condition"
          value={values.condition}
          onChange={(event) =>
            set('condition')(event.target.value)
          }
          options={ASSET_CONDITIONS.map(
            (condition) => ({
              value: condition,
              label: statusLabel(condition),
            }),
          )}
        />

        <Input
          label="Purchase date"
          type="date"
          value={values.purchaseDate}
          onChange={(event) =>
            set('purchaseDate')(event.target.value)
          }
        />

        <Input
          label="Purchase price"
          type="number"
          min="0"
          step="0.01"
          value={values.purchasePrice}
          onChange={(event) =>
            set('purchasePrice')(event.target.value)
          }
          error={errors.purchasePrice}
        />
      </div>

      <Input
        label="Notes"
        value={values.notes}
        onChange={(event) =>
          set('notes')(event.target.value)
        }
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={saving}
        >
          Create asset
        </Button>
      </div>
    </form>
  );
}
