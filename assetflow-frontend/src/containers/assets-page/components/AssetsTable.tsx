import Link from 'next/link';

import Badge from '@/components/Badge';

import { Asset } from '@/types/asset.types';

import {
  statusLabel,
  statusTone,
} from '../utils/asset-filters';

import {
  allowedNextStatuses,
} from '../utils/asset-transitions';

interface Props {
  assets: Asset[];
  hasFilters: boolean;
  onEdit: (asset: Asset) => void;
  onChangeStatus: (
    asset: Asset,
  ) => void;
}

export default function AssetsTable({
  assets,
  hasFilters,
  onEdit,
  onChangeStatus,
}: Props) {
  if (assets.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <AssetIcon />
        </div>

        <p className="mt-4 font-medium text-gray-700">
          {hasFilters
            ? 'No matching assets'
            : 'No assets yet'}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {hasFilters
            ? 'Try changing or clearing your filters.'
            : 'Add your first asset to get started.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="font-semibold text-gray-900">
          Asset Inventory
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {assets.length} asset
          {assets.length === 1 ? '' : 's'} shown
          on this page
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-4">
                Code
              </th>

              <th className="px-6 py-4">
                Asset
              </th>

              <th className="px-6 py-4">
                Category
              </th>

              <th className="px-6 py-4">
                Serial Number
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Condition
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {assets.map((asset) => {
              const canChangeStatus =
                allowedNextStatuses(
                  asset.status,
                ).length > 0;

              return (
                <tr
                  key={asset.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {asset.assetCode}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {asset.name}
                    </p>

                    {(asset.brand ||
                      asset.model) && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {[
                          asset.brand,
                          asset.model,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {asset.category.name}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {asset.serialNumber ??
                      '—'}
                  </td>

                  <td className="px-6 py-4">
                    <Badge
                      tone={statusTone(
                        asset.status,
                      )}
                    >
                      {statusLabel(
                        asset.status,
                      )}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {statusLabel(
                      asset.condition,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/assets/${asset.id}`}
                        className="font-medium text-blue-600 transition hover:text-blue-800"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(asset)
                        }
                        className="font-medium text-gray-600 transition hover:text-gray-900"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onChangeStatus(
                            asset,
                          )
                        }
                        disabled={
                          !canChangeStatus
                        }
                        title={
                          canChangeStatus
                            ? 'Change asset status'
                            : 'No further status changes allowed'
                        }
                        className="font-medium text-gray-600 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
                      >
                        Status
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

function AssetIcon() {
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
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />

      <path d="m3.3 7 8.7 5 8.7-5" />

      <path d="M12 22V12" />
    </svg>
  );
}