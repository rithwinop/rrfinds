"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { MarketplaceItem } from "@/types";

interface SimilarItemsProps {
  items: MarketplaceItem[];
  className?: string;
}

export const SimilarItems = ({ items, className }: SimilarItemsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemsPerView = 4;

  if (!items || items.length === 0) return null;

  const totalPages = Math.ceil(items.length / itemsPerView);
  const currentPage = Math.floor(selectedIndex / itemsPerView);
  const startIndex = currentPage * itemsPerView;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerView);

  const handleNext = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
  };

  return (
    <section className={cn("space-y-4", className)} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Similar Items</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={currentPage === 0}
            aria-label="Previous items"
            className="text-slate-400 hover:text-slate-100 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-slate-500 w-20 text-center">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            aria-label="Next items"
            className="text-slate-400 hover:text-slate-100 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleItems.map((item, index) => (
          <article
            key={item.id}
            className={cn(
              "group relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300",
              "hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl hover:shadow-brand-500/5"
            )}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {item.qcPhotos.length > 0 && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900/80 backdrop-blur text-xs text-brand-400 rounded-full border border-brand-500/30">
                    📸 {item.qcPhotos.length}
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-slate-900/80 backdrop-blur text-xs text-slate-300 rounded-full border border-slate-700">
                  {item.platform.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="font-medium text-slate-100 line-clamp-2 group-hover:text-brand-400 transition-colors">
                {item.title}
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-brand-400">{item.price.toLocaleString()}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-slate-500 line-through">{item.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <span className="text-xs text-slate-500">{item.salesCount.toLocaleString()} sold</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span>★</span>
                  {item.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <span>📦</span>
                  {item.shipping.from}
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full text-sm gap-2 group-hover:bg-brand-500/10 group-hover:border-brand-500/50 group-hover:text-brand-400"
                onClick={() => window.open(item.canonicalUrl, "_blank", "noopener,noreferrer")}
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};