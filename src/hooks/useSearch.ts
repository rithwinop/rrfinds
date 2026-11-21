import { useState, useCallback, useEffect } from "react";
import type { MarketplaceItem, SearchParams, SearchResponse } from "@/types";

interface UseSearchState {
  items: MarketplaceItem[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

interface UseSearchReturn extends UseSearchState {
  search: (params: SearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
  setPage: (page: number) => void;
}

export function useSearch(): UseSearchReturn {
  const [state, setState] = useState<UseSearchState>({
    items: [],
    isLoading: false,
    error: null,
    totalResults: 0,
    currentPage: 1,
    totalPages: 0,
    hasMore: false,
  });

  const [lastParams, setLastParams] = useState<SearchParams | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    setLastParams(params);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data: SearchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setState({
        items: data.items,
        isLoading: false,
        error: null,
        totalResults: data.totalResults,
        currentPage: data.page,
        totalPages: data.totalPages,
        hasMore: data.page < data.totalPages,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Search failed",
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastParams || state.isLoading || !state.hasMore) return;

    const nextPage = state.currentPage + 1;
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const queryParams = new URLSearchParams();
      Object.entries({ ...lastParams, page: nextPage }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data: SearchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load more results");
      }

      setState((prev) => ({
        ...prev,
        items: [...prev.items, ...data.items],
        isLoading: false,
        currentPage: data.page,
        totalPages: data.totalPages,
        hasMore: data.page < data.totalPages,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load more results",
      }));
    }
  }, [lastParams, state.currentPage, state.isLoading, state.hasMore]);

  const clearResults = useCallback(() => {
    setState({
      items: [],
      isLoading: false,
      error: null,
      totalResults: 0,
      currentPage: 1,
      totalPages: 0,
      hasMore: false,
    });
    setLastParams(null);
  }, []);

  const setPage = useCallback((page: number) => {
    if (!lastParams || page < 1 || page > state.totalPages) return;
    search({ ...lastParams, page });
  }, [lastParams, state.totalPages, search]);

  return {
    ...state,
    search,
    loadMore,
    clearResults,
    setPage,
  };
}