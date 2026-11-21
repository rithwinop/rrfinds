"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Loader2, Filter, X, ChevronDown, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ResultGrid, Pagination } from "@/components/results/ResultGrid";
import { PlatformFilter } from "@/components/search/PlatformFilter";
import { Spinner } from "@/components/ui/Spinner";
import type { MarketplaceItem, Platform, SearchResult } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "sales_desc", label: "Best Selling" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

const PRICE_RANGES = [
  { value: "", label: "Any Price" },
  { value: "0-50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-200", label: "$100 - $200" },
  { value: "200-500", label: "$200 - $500" },
  { value: "500-", label: "Over $500" },
];

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const query = params.query as string;
  const mode = (searchParams.get("mode") as "url" | "keyword" | "image") || "keyword";
  const platformParam = searchParams.get("platform");
  const initialPlatforms = platformParam ? platformParam.split(",") : ["taobao", "1688", "weidian"];
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialPageSize = parseInt(searchParams.get("limit") || "20", 10);
  const initialSort = searchParams.get("sort") || "relevance";
  const initialPriceRange = searchParams.get("priceRange") || "";
  const sellerId = searchParams.get("sellerId") || undefined;
  const itemId = searchParams.get("itemId") || undefined;
  const skuId = searchParams.get("skuId") || undefined;
  const hash = searchParams.get("hash") || undefined;

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(initialPlatforms as Platform[]);
  const [variant, setVariant] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      searchParams.set("q", query);
      searchParams.set("mode", mode);
      searchParams.set("page", currentPage.toString());
      searchParams.set("limit", pageSize.toString());
      searchParams.set("sort", sort);
      if (priceRange) searchParams.set("priceRange", priceRange);
      if (selectedPlatforms.length > 0 && selectedPlatforms.length < 3) {
        searchParams.set("platform", selectedPlatforms.join(","));
      }
      if (sellerId) searchParams.set("sellerId", sellerId);
      if (itemId) searchParams.set("itemId", itemId);
      if (skuId) searchParams.set("skuId", skuId);
      if (hash) searchParams.set("hash", hash);

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch results");
      }

      const result = data as SearchResult;
      setItems(result.items);
      setTotalItems(result.total);
      setTotalPages(Math.ceil(result.total / result.pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setItems([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [query, mode, currentPage, pageSize, sort, priceRange, selectedPlatforms, sellerId, itemId, skuId, hash]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/results/${encodeURIComponent(query)}?${params.toString()}`, { scroll: false });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newPageSize.toString());
    params.set("page", "1");
    router.push(`/results/${encodeURIComponent(query)}?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/results/${encodeURIComponent(query)}?${params.toString()}`, { scroll: false });
  };

  const handlePriceRangeChange = (newPriceRange: string) => {
    setPriceRange(newPriceRange);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (newPriceRange) {
      params.set("priceRange", newPriceRange);
    } else {
      params.delete("priceRange");
    }
    params.set("page", "1");
    router.push(`/results/${encodeURIComponent(query)}?${params.toString()}`, { scroll: false });
  };

  const handlePlatformChange = (platforms: Platform[]) => {
    setSelectedPlatforms(platforms);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (platforms.length > 0 && platforms.length < 3) {
      params.set("platform", platforms.join(","));
    } else {
      params.delete("platform");
    }
    params.set("page", "1");
    router.push(`/results/${encodeURIComponent(query)}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setSort("relevance");
    setPriceRange("");
    setSelectedPlatforms(["taobao", "1688", "weidian"]);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sort");
    params.delete("priceRange");
    params.delete("platform");
    params.set("page", "1");
    router.push(`/results/${encodeURIComponent(query)}?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters = sort !== "relevance" || priceRange || selectedPlatforms.length !== 3;

  const displayQuery = query === "image-search" ? "Visual Search Results" : query;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2" aria-label="QCLens Home">
              <svg
                className="w-8 h-8 text-amber-400"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2" />
                <circle cx="16" cy="16" r="3" fill="currentColor" />
              </svg>
              <span className="font-bold text-xl text-slate-100">QCLens</span>
            </a>
            <nav className="flex items-center gap-4">
              <a
                href="/search"
                className="text-sm font-medium text-amber-400"
                aria-current="page"
              >
                Search
              </a>
              <a href="/" className="text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors">
                Home
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container-main py-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                Results for{" "}
                <span className="text-amber-400">"{displayQuery}"</span>
              </h1>
              <p className="text-slate-400 mt-1">
                {totalItems > 0
                  ? `Found ${totalItems.toLocaleString()} result${totalItems !== 1 ? "s" : ""}`
                  : "No results found"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant={variant === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setVariant("grid")}
                  aria-label="Grid view"
                  aria-pressed={variant === "grid"}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={variant === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setVariant("list")}
                  aria-label="List view"
                  aria-pressed={variant === "list"}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>

              <Select value={sort} onChange={(e) => handleSortChange(e.target.value)} className="w-48 hidden sm:block" options={SORT_OPTIONS} />

              <Select value={priceRange} onChange={(e) => handlePriceRangeChange(e.target.value)} className="w-40 hidden sm:block" options={PRICE_RANGES} />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn("gap-2", hasActiveFilters && "border-amber-500/50 text-amber-400")}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 animate-in">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-100">Filters</h2>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-slate-400 hover:text-amber-400">
                      <X className="w-3.5 h-3.5 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>
                <PlatformFilter
                  selectedPlatforms={selectedPlatforms}
                  onChange={handlePlatformChange}
                  showAll
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-500/30 text-red-400 flex items-center gap-3 animate-in" role="alert">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
              <Button variant="ghost" size="sm" onClick={fetchResults} className="ml-auto">
                Retry
              </Button>
            </div>
          )}

          <ResultGrid
            items={items}
            loading={loading}
            variant={variant}
            emptyMessage={query === "image-search" ? "No visually similar items found" : `No results for "${displayQuery}"`}
            emptyAction={
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => router.push("/search")}>
                  Try a Different Search
                </Button>
                <Button onClick={() => router.push(`/search?mode=image`)}>
                  Visual Search Instead
                </Button>
              </div>
            }
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              showPageSize
              pageSizeOptions={[20, 40, 60, 100]}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="container-main py-8">
          <p className="text-center text-sm text-slate-500">
            © 2024 QCLens. Not affiliated with Taobao, 1688, or Weidian.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Spinner size="lg" />
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}