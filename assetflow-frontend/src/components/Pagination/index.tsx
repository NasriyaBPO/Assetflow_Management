import Button from '../Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  const safeTotalPages = Math.max(
    totalPages,
    1,
  );

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Page Information */}
      <p className="text-sm text-gray-500">
        Page{' '}
        <span className="font-medium text-gray-700">
          {page}
        </span>{' '}
        of{' '}
        <span className="font-medium text-gray-700">
          {safeTotalPages}
        </span>
        {' · '}
        <span className="font-medium text-gray-700">
          {total}
        </span>{' '}
        {total === 1 ? 'item' : 'items'}
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          Previous
        </Button>

        <Button
          variant="secondary"
          disabled={
            page >= safeTotalPages ||
            total === 0
          }
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}