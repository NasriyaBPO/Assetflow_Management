'use client';

import {
  FormEvent,
  useState,
} from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';

import {
  Category,
  UpdateCategoryInput,
} from '@/types/category.types';

interface Props {
  category: Category;
  saving: boolean;
  error: string | null;

  onSubmit: (
    input: UpdateCategoryInput,
  ) => Promise<boolean>;

  onCancel: () => void;
}

export default function EditCategoryForm({
  category,
  saving,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] =
    useState(category.name);

  const [description, setDescription] =
    useState(
      category.description ?? '',
    );

  const [nameError, setNameError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setNameError(
        'Name is required',
      );

      return;
    }

    setNameError(null);

    const ok = await onSubmit({
      name: name.trim(),

      description:
        description.trim() || undefined,
    });

    if (!ok) {
      return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Name"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        error={nameError}
      />

      <Input
        label="Description"
        value={description}
        onChange={(event) =>
          setDescription(
            event.target.value,
          )
        }
        placeholder="Optional"
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={saving}
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}