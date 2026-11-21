"use client";

import { cn } from "@/lib/utils";
import { Heart, ShoppingBag, Share2, Tag, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlatformBadge } from "@/components/search/PlatformFilter";
import { formatPrice, formatNumber } from "@/lib/utils";
import type { MarketplaceItem } from "@/types";

interface ItemHeaderProps {
  item: MarketplaceItem;
  className?: string;
}

export const ItemHeader = ({ item, className }: ItemHeaderProps) => {
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountPercent = hasDiscount
    ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
    : 0;

  return (
    <header className={cn("space-y-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <PlatformBadge platform={item.platform} />
            {hasDiscount && (
              <Badge variant="success" className="text-sm">
                -{discountPercent}%
              </Badge>
            )}
            {item.qcPhotos.length > 0 && (
              <Badge variant="outline" className="gap-1 text-brand-400 border-brand-500/30 bg-brand-500/10">
                <span className="w-3 h-3" aria-hidden="true">📸</span>
                {item.qcPhotos.length} QC Photos
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3 line-clamp-3">
            {item.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400" />
              {item.rating.toFixed(1)} ({formatNumber(item.reviewCount)} reviews)
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              {formatNumber(item.salesCount)} sold
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {item.category}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brand-400">{formatPrice(item.price)}</span>
            {hasDiscount && (
              <span className="text-lg text-slate-500 line-through self-end">{formatPrice(item.originalPrice!)}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 bg-slate-800 rounded">Free Shipping</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <Truck className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Shipping</p>
              <p className="font-medium text-slate-100">{item.shipping.from} → {item.shipping.to}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <span className="text-xl">⏱</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">Processing Time</p>
              <p className="font-medium text-slate-100">{item.shipping.processingDays} days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">Weight</p>
              <p className="font-medium text-slate-100">{item.shipping.weight}g</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-400 hover:bg-red-900/20" aria-label="Add to favorites">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-brand-400 hover:bg-brand-500/20" aria-label="Share item">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="primary" className="gap-2">
            <ShoppingBag className="w-5 h-5" />
            Buy Now
          </Button>
        </div>
      </div>
    </header>
  );
};