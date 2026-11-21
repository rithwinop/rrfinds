"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { ItemCard } from "./ItemCard";
import type { MarketplaceItem } from "@/types";

interface ResultGridProps {
  items: MarketplaceItem[];
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  variant?: "grid" | "list";
  columns?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  onQuickView?: (item: MarketplaceItem) => void;
  className?: string;
}

export const ResultGrid = ({
  items,
  loading = false,
  emptyMessage = "No items found",
  emptyAction,
  variant = "grid",
  columns = { base: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  onQuickView,
  className,
}: ResultGridProps) => {
  if (loading) {
    return (
      <div
        className={cn(
          "grid gap-4",
          variant === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            : "grid-cols-1",
          className
        )}
        role="status"
        aria-label="Loading results"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <ItemCardSkeleton key={i} variant={variant === "list" ? "compact" : "default"} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-1">{emptyMessage}</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-md">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "gap-4",
        variant === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          : "grid grid-cols-1",
        className
      )}
      role="list"
      aria-label="Search results"
    >
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          variant={variant === "list" ? "compact" : "default"}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};

interface ItemCardSkeletonProps {
  variant?: "default" | "compact";
}

const ItemCardSkeleton = ({ variant = "default" }: ItemCardSkeletonProps) => {
  if (variant === "compact") {
    return (
      <div className="group flex gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-xl animate-pulse">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-800" />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 w-1/3 bg-slate-800 rounded" />
            <div className="h-4 w-3/4 bg-slate-800 rounded" />
            <div className="h-5 w-1/2 bg-slate-800 rounded" />
          </div>
          <div className="h-4 w-1/4 bg-slate-800 rounded mt-2" />
        </div>
      </div>
    );
  }

  return (
    <article className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
          <div className="h-8 w-8 bg-slate-800 rounded-lg" />
        </div>
        <div className="h-4 w-3/4 bg-slate-800 rounded" />
        <div className="h-4 w-1/2 bg-slate-800 rounded" />
        <div className="flex items-center gap-3">
          <div className="h-3 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
          <div className="h-3 w-16 bg-slate-800 rounded" />
        </div>
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="h-3 w-20 bg-slate-800 rounded" />
          <div className="h-3 w-12 bg-slate-800 rounded" />
        </div>
      </div>
    </article>
  );
};

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  showPageSize = false,
  pageSizeOptions = [20, 40, 60, 100],
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav
      className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-800", className)}
      aria-label="Pagination"
    >
      <div className="text-sm text-slate-400">
        Showing <span className="text-slate-100 font-medium">{startItem}</span> to{" "}
        <span className="text-slate-100 font-medium">{endItem}</span> of{" "}
        <span className="text-slate-100 font-medium">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
          aria-disabled={currentPage === 1}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                currentPage === 1
                  ? "bg-brand-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
              )}
              aria-label="Page 1"
              aria-current={currentPage === 1 ? "page" : undefined}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-slate-500" aria-hidden="true">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[40px]",
              currentPage === page
                ? "bg-brand-500 text-slate-950 shadow-brand-500/25"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            )}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-slate-500" aria-hidden="true">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                currentPage === totalPages
                  ? "bg-brand-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
              )}
              aria-label={`Page ${totalPages}`}
              aria-current={currentPage === totalPages ? "page" : undefined}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
          aria-disabled={currentPage === totalPages}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {showPageSize && (
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-slate-400">
            Per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageChange(1)}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
};