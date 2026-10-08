import Badge from '@/components/Badge';
import { Category } from '@/types/category.types';

interface Props {
  categories: Category[];

  onEdit: (category: Category) => void;

  onToggleStatus: (
    category: Category,
  ) => void;

  onDelete: (
    category: Category,
  ) => void;
}

export default function CategoriesTable({
  categories,
  onEdit,
  onToggleStatus,
  onDelete,
}: Props) {
  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <CategoryIcon />
        </div>

        <p className="mt-4 font-medium text-gray-700">
          No categories yet
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Create your first category to organize company assets.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Table header section */}
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="font-semibold text-gray-900">
          Category List
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {categories.length}{' '}
          {categories.length === 1
            ? 'category'
            : 'categories'}{' '}
          available
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-4">
                Category
              </th>

              <th className="px-6 py-4">
                Description
              </th>

              <th className="px-6 py-4">
                Assets
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => {
              const assetCount =
                category._count?.assets ?? 0;

              return (
                <tr
                  key={category.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  {/* Category name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                        {category.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="font-semibold text-gray-800">
                        {category.name}
                      </span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="max-w-sm px-6 py-4 text-gray-500">
                    {category.description ??
                      '—'}
                  </td>

                  {/* Asset count */}
                  <td className="px-6 py-4">
                    <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      {assetCount}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <Badge
                      tone={
                        category.active
                          ? 'green'
                          : 'gray'
                      }
                    >
                      {category.active
                        ? 'Active'
                        : 'Inactive'}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(category)
                        }
                        className="font-medium text-blue-600 transition hover:text-blue-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onToggleStatus(
                            category,
                          )
                        }
                        className="font-medium text-amber-600 transition hover:text-amber-700"
                      >
                        {category.active
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(category)
                        }
                        className="font-medium text-red-600 transition hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />
    </svg>
  );
}