'use client';

import { FormEvent, useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { CreateCategoryInput } from '@/types/category.types';

interface Props {
  saving: boolean;
  error: string | null;
  onSubmit: (input: CreateCategoryInput) => Promise<boolean>;
}

export default function CategoryForm({ saving, error, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    setNameError(null);
    const ok = await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    if (ok) {
      setName('');
      setDescription('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="font-semibold">Add category</h2>

      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Laptop"
        error={nameError}
      />
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" loading={saving}>
        Add category
      </Button>
    </form>
  );
}