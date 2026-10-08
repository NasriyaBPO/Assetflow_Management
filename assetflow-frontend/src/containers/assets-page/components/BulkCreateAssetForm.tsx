
'use client';

import { FormEvent, useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';

import {
  AssetCondition,
  ASSET_CONDITIONS,
  BulkCreateAssetsInput,
} from '@/types/asset.types';

import { Category } from '@/types/category.types';
import { statusLabel } from '../utils/asset-filters';

interface Props {
  categories: Category[];
  saving: boolean;
  error: string | null;
  onSubmit: (input: BulkCreateAssetsInput) => Promise<boolean>;
  onCancel: () => void;
}

const EMPTY = {
  name: '',
  brand: '',
  model: '',
  categoryId: '',
  condition: 'NEW',
  purchaseDate: '',
  purchasePrice: '',
  notes: '',
  quantity: '1',
  serialNumbers: '',
};

type FormValues = typeof EMPTY;
type FormErrors = Partial<Record<keyof FormValues, string>>;

const optional = (value: string) =>
  value.trim() || undefined;

export default function BulkCreateAssetForm({
  categories,
  saving,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState<FormValues>({
    ...EMPTY,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const set =
    (field: keyof FormValues) =>
    (value: string) => {
      setValues((current) => ({
        ...current,
        [field]: value,
      }));

      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    };

  const quantity = Number(values.quantity);

  // Enter one serial number per line.
  const serialNumbers = values.serialNumbers
    .split(/\r?\n/)
    .map((serial) => serial.trim())
    .filter(Boolean);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!values.name.trim()) {
      errs.name = 'Asset name is required';
    }

    if (!values.categoryId) {
      errs.categoryId = 'Select a category';
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      errs.quantity =
        'Quantity must be between 1 and 100';
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

    if (
      serialNumbers.length > 0 &&
      serialNumbers.length !== quantity
    ) {
      errs.serialNumbers =
        `Enter exactly ${quantity} serial numbers, or leave empty`;
    }

    if (
      new Set(serialNumbers).size !== serialNumbers.length
    ) {
      errs.serialNumbers =
        'Duplicate serial numbers are not allowed';
    }

    return errs;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (saving) return;

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    const input: BulkCreateAssetsInput = {
      asset: {
        name: values.name.trim(),
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
      },
      quantity,
      ...(serialNumbers.length > 0 && {
        serialNumbers,
      }),
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
      className="space-y-4"
    >
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        Asset codes will be generated automatically.
        All assets will share the details below, except
        their asset codes and optional serial numbers.
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Asset name"
          value={values.name}
          onChange={(event) =>
            set('name')(event.target.value)
          }
          placeholder="Dell Latitude 5450"
          error={errors.name}
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
          options={ASSET_CONDITIONS.map((condition) => ({
            value: condition,
            label: statusLabel(condition),
          }))}
        />

        <Input
          label="Quantity"
          type="number"
          min="1"
          max="100"
          step="1"
          value={values.quantity}
          onChange={(event) =>
            set('quantity')(event.target.value)
          }
          error={errors.quantity}
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

      <div className="space-y-1">
        <label
          htmlFor="bulk-serial-numbers"
          className="block text-sm font-medium text-gray-700"
        >
          Serial numbers (optional)
        </label>

        <textarea
          id="bulk-serial-numbers"
          rows={4}
          value={values.serialNumbers}
          onChange={(event) =>
            set('serialNumbers')(event.target.value)
          }
          placeholder={
            'SN-001\nSN-002\nSN-003'
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <p className="text-xs text-gray-500">
          Enter one serial number per line. If provided,
          the number of serial numbers must match the quantity.
        </p>

        {errors.serialNumbers && (
          <p className="text-sm text-red-600">
            {errors.serialNumbers}
          </p>
        )}
      </div>

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
          Register {quantity > 0 && Number.isInteger(quantity)
            ? quantity
            : ''} Assets
        </Button>
      </div>
    </form>
  );
}
