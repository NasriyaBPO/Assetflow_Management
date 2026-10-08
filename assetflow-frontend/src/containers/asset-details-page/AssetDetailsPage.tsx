'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { assetsService } from '@/services/assets/assets.service';
import {
  Asset,
  AssetHistory,
} from '@/types/asset.types';

interface AssetDetailsPageProps {
  assetId: string;
}

export default function AssetDetailsPage({
  assetId,
}: AssetDetailsPageProps) {
  const [asset, setAsset] =
    useState<Asset | null>(null);

  const [history, setHistory] =
    useState<AssetHistory[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function loadAsset() {
      try {
        setLoading(true);
        setError('');

        const [
          assetResponse,
          historyResponse,
        ] = await Promise.all([
          assetsService.get(assetId),
          assetsService.getHistory(assetId),
        ]);

        setAsset(assetResponse);
        setHistory(historyResponse);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load asset details.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadAsset();
  }, [assetId]);

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading asset details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>

        <Link
          href="/assets"
          className="mt-4 inline-block text-sm font-medium underline"
        >
          ← Back to Assets
        </Link>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-8">
        Asset not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">

      {/* Header */}
      <div>
        <Link
          href="/assets"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to Assets
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {asset.name}
            </h1>

            <p className="mt-1 text-gray-500">
              {asset.assetCode}
            </p>
          </div>

          <div className="flex gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {asset.status}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {asset.condition}
            </span>
          </div>
        </div>
      </div>

      {/* Asset Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Asset Information
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <Detail
            label="Asset Code"
            value={asset.assetCode}
          />

          <Detail
            label="Category"
            value={asset.category?.name}
          />

          <Detail
            label="Serial Number"
            value={asset.serialNumber}
          />

          <Detail
            label="Brand"
            value={asset.brand}
          />

          <Detail
            label="Model"
            value={asset.model}
          />

          <Detail
            label="Status"
            value={asset.status}
          />

          <Detail
            label="Condition"
            value={asset.condition}
          />

          <Detail
            label="Purchase Date"
            value={
              asset.purchaseDate
                ? new Date(
                    asset.purchaseDate,
                  ).toLocaleDateString()
                : null
            }
          />

          <Detail
            label="Purchase Price"
            value={
              asset.purchasePrice
                ? asset.purchasePrice
                : null
            }
          />

          <Detail
            label="Warranty Expiry"
            value={
              asset.warrantyExpiryDate
                ? new Date(
                    asset.warrantyExpiryDate,
                  ).toLocaleDateString()
                : null
            }
          />

        </div>

        {asset.notes && (
          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-sm font-medium text-gray-500">
              Notes
            </p>

            <p className="mt-1 text-gray-700">
              {asset.notes}
            </p>
          </div>
        )}
      </div>

      {/* Lifecycle History */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <h2 className="text-lg font-semibold text-gray-900">
          Asset Lifecycle History
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Complete history of this asset
        </p>

        {history.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No history recorded.
          </div>
        ) : (
          <div className="mt-6 space-y-4">

            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row">

                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.action}
                    </p>

                    {item.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      item.createdAt,
                    ).toLocaleString()}
                  </p>

                </div>

                {(item.previousStatus ||
                  item.newStatus) && (
                  <div className="mt-3 flex items-center gap-2 text-sm">

                    <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                      {item.previousStatus ??
                        '—'}
                    </span>

                    <span className="text-gray-400">
                      →
                    </span>

                    <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">
                      {item.newStatus ??
                        '—'}
                    </span>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-gray-900">
        {value || '—'}
      </p>
    </div>
  );
}