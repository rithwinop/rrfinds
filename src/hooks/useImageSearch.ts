import { useState, useCallback, useRef } from "react";
import { computeHash, hammingDistance } from "@/lib/phash";
import type { MarketplaceItem } from "@/types";

interface UseImageSearchState {
  isLoading: boolean;
  error: string | null;
  uploadedImage: File | null;
  imagePreview: string | null;
  imageHash: string | null;
  similarItems: MarketplaceItem[];
  progress: number;
}

interface UseImageSearchReturn extends UseImageSearchState {
  uploadImage: (file: File) => Promise<void>;
  removeImage: () => void;
  searchSimilar: (items: MarketplaceItem[]) => Promise<void>;
  reset: () => void;
}

export function useImageSearch(): UseImageSearchReturn {
  const [state, setState] = useState<UseImageSearchState>({
    isLoading: false,
    error: null,
    uploadedImage: null,
    imagePreview: null,
    imageHash: null,
    similarItems: [],
    progress: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setState((prev) => ({ ...prev, error: "Please select an image file" }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setState((prev) => ({ ...prev, error: "Image must be less than 10MB" }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      uploadedImage: file,
      progress: 0,
    }));

    try {
      const preview = URL.createObjectURL(file);
      setState((prev) => ({ ...prev, imagePreview: preview, progress: 20 }));

      setState((prev) => ({ ...prev, progress: 40 }));
      const hash = await computeHash(file);
      setState((prev) => ({ ...prev, imageHash: hash, progress: 80 }));

      setState((prev) => ({ ...prev, isLoading: false, progress: 100 }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to process image",
        progress: 0,
      }));
    }
  }, []);

  const removeImage = useCallback(() => {
    if (state.imagePreview) {
      URL.revokeObjectURL(state.imagePreview);
    }
    setState({
      isLoading: false,
      error: null,
      uploadedImage: null,
      imagePreview: null,
      imageHash: null,
      similarItems: [],
      progress: 0,
    });
  }, [state.imagePreview]);

  const searchSimilar = useCallback(async (items: MarketplaceItem[]) => {
    if (!state.imageHash) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const response = await fetch("/api/image-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: state.imageHash, items }),
        signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Visual search failed");
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        similarItems: data.items || [],
      }));
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Visual search failed",
      }));
    }
  }, [state.imageHash]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    removeImage();
  }, [removeImage]);

  return {
    ...state,
    uploadImage,
    removeImage,
    searchSimilar,
    reset,
  };
}