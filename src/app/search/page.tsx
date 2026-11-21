"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { PlatformFilter } from "@/components/search/PlatformFilter";
import { Spinner } from "@/components/ui/Spinner";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode = (searchParams.get("mode") as "url" | "keyword" | "image") || "url";
  const initialPlatforms = searchParams.get("platform")?.split(",") || ["taobao", "1688", "weidian"];

  const handleSearch = (query: string, mode: "url" | "keyword" | "image", parsedRef?: { platform: string; itemId: string; skuId?: string }) => {
    const params = new URLSearchParams();
    params.set("q", query);
    params.set("mode", mode);
    if (parsedRef) {
      params.set("platform", parsedRef.platform);
      params.set("itemId", parsedRef.itemId);
      if (parsedRef.skuId) params.set("skuId", parsedRef.skuId);
    }
    router.push(`/results/${encodeURIComponent(query)}?${params.toString()}`);
  };

  const handleImageSearch = (hash: string) => {
    router.push(`/results/image-search?hash=${hash}`);
  };

  const handlePlatformChange = (platforms: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (platforms.length > 0 && platforms.length < 3) {
      params.set("platform", platforms.join(","));
    } else {
      params.delete("platform");
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
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

      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-12 animate-in">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
                Search QC Photos & Listings
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Paste a URL, search by keyword, or upload an image to find quality control photos
                across Taobao, 1688, and Weidian.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 animate-in" style={{ animationDelay: "100ms" }}>
              <SearchBar
                onSearch={handleSearch}
                onImageSearch={handleImageSearch}
                initialMode={initialMode}
              />
            </div>

            <div className="mt-8 animate-in" style={{ animationDelay: "200ms" }}>
              <PlatformFilter
                selectedPlatforms={initialPlatforms as ("taobao" | "1688" | "weidian")[]}
                onChange={handlePlatformChange}
                showAll
              />
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in" style={{ animationDelay: "300ms" }}>
              <a
                href="/search?mode=url"
                className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">URL / ID Search</h3>
                </div>
                <p className="text-sm text-slate-400">Paste Taobao, 1688, Weidian URLs or raw item IDs</p>
              </a>
              <a
                href="/search?mode=keyword"
                className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">Keyword Search</h3>
                </div>
                <p className="text-sm text-slate-400">Search by brand, model, seller, or category</p>
              </a>
              <a
                href="/search?mode=image"
                className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">Visual Search</h3>
                </div>
                <p className="text-sm text-slate-400">Upload an image to find similar items</p>
              </a>
            </div>
          </div>
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Spinner size="lg" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}