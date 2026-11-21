"use client";

import { useState, useCallback, FormEvent, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Search, Link, Image, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SearchTabs, type SearchMode } from "./SearchTabs";
import { ImageUploadZone } from "./ImageUploadZone";
import { parseListingInput } from "@/lib/url-parser";
import type { ParsedListingRef } from "@/types";

interface SearchBarProps {
  onSearch: (query: string, mode: SearchMode, parsedRef?: ParsedListingRef) => void;
  onImageSearch: (hash: string) => void;
  initialMode?: SearchMode;
  className?: string;
}

export const SearchBar = ({
  onSearch,
  onImageSearch,
  initialMode = "url",
  className,
}: SearchBarProps) => {
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageHash, setImageHash] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParsedListingRef | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setError(null);
    setParseResult(null);

    if (mode === "url" && value.trim()) {
      const parsed = parseListingInput(value.trim());
      if (parsed) {
        setParseResult(parsed);
      }
    }
  }, [mode]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (isLoading) return;

      if (mode === "image") {
        if (!imageHash) {
          setError("Please upload an image first");
          return;
        }
        setIsLoading(true);
        try {
          onImageSearch(imageHash);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      const trimmed = inputValue.trim();
      if (!trimmed) {
        setError("Please enter a search term or URL");
        return;
      }

      setIsLoading(true);
      try {
        onSearch(trimmed, mode, parseResult || undefined);
      } finally {
        setIsLoading(false);
      }
    },
    [mode, inputValue, imageHash, parseResult, isLoading, onSearch, onImageSearch]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as FormEvent);
      }
    },
    [handleSubmit]
  );

  const handleImageSelect = useCallback((file: File, hash: string, preview: string) => {
    setImageFile(file);
    setImageHash(hash);
    setImagePreview(preview);
    setError(null);
  }, []);

  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    setImageHash(null);
    setImagePreview(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const placeholderText = {
    url: "Paste Taobao, 1688, Weidian URL or item ID...",
    keyword: "Search keywords, brand, seller, or category...",
    image: "",
  };

  const inputIcons = {
    url: Link,
    keyword: Search,
    image: Image,
  };

  const InputIcon = inputIcons[mode];

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-4xl mx-auto", className)}>
      <SearchTabs activeMode={mode} onModeChange={setMode} />

      <div className="mt-4 space-y-4">
        {mode === "image" ? (
          <ImageUploadZone
            onImageSelect={handleImageSelect}
            onRemove={handleImageRemove}
            selectedFile={imageFile}
            hash={imageHash}
            preview={imagePreview}
            disabled={isLoading}
          />
        ) : (
          <div className="relative">
            <InputIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" aria-hidden="true" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText[mode]}
              disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg pl-12 pr-14 py-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={mode === "url" ? "Paste marketplace URL or item ID" : "Search keywords"}
              autoComplete="off"
              spellCheck={false}
            />
            {parseResult && mode === "url" && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/20 border border-brand-500/30 rounded-lg text-xs font-medium text-brand-400">
                  <span className="font-mono">{parseResult.itemId}</span>
                  <span className="px-2 py-0.5 bg-brand-500 text-slate-950 rounded text-[10px] font-semibold">
                    {parseResult.platform.toUpperCase()}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400 flex items-center gap-1.5" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          loading={isLoading}
          disabled={mode === "image" ? !imageHash : !inputValue.trim()}
        >
          {mode === "image" ? "Search Similar Items" : "Search"}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
};