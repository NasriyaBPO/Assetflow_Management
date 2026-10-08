import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';

import { AssetStatus } from '@/types/asset.types';
import { Category } from '@/types/category.types';

import { STATUS_OPTIONS } from '../utils/asset-filters';

interface Props {
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: AssetStatus | '';
  onStatusChange: (
    value: AssetStatus | '',
  ) => void;
  categoryId: string;
  onCategoryChange: (
    value: string,
  ) => void;
  categories: Category[];
  hasFilters: boolean;
  onReset: () => void;
}

export default function AssetFilters(
  props: Props,
) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-semibold text-gray-900">
          Filter Assets
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Search or narrow the asset list by
          status and category.
        </p>
      </div>

      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 xl:grid-cols-[minmax(240px,2fr)_minmax(180px,1fr)_minmax(180px,1fr)_auto]">
        <Input
          label="Search"
          value={props.searchInput}
          onChange={(e) =>
            props.onSearchChange(
              e.target.value,
            )
          }
          placeholder="Code, name, serial or brand..."
        />

        <Select
          label="Status"
          value={props.status}
          onChange={(e) =>
            props.onStatusChange(
              e.target
                .value as AssetStatus | '',
            )
          }
          options={STATUS_OPTIONS}
          placeholder="All statuses"
        />

        <Select
          label="Category"
          value={props.categoryId}
          onChange={(e) =>
            props.onCategoryChange(
              e.target.value,
            )
          }
          options={props.categories.map(
            (category) => ({
              value: category.id,
              label: category.name,
            }),
          )}
          placeholder="All categories"
        />

        <Button
          variant="secondary"
          onClick={props.onReset}
          disabled={!props.hasFilters}
        >
          Clear Filters
        </Button>
      </div>
    </section>
  );
}