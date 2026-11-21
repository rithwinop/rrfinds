"use client";

import { cn } from "@/lib/utils";
import { Heart, ShoppingBag, Eye, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlatformBadge } from "@/components/search/PlatformFilter";
import { formatPrice, formatNumber } from "@/lib/utils";
import type { MarketplaceItem } from "@/types";
import Link from "next/link";

interface ItemCardProps {
  item: MarketplaceItem;
  variant?: "default" | "compact";
  showQCCount?: boolean;
  onQuickView?: (item: MarketplaceItem) => void;
  className?: string;
}

export const ItemCard = ({
  item,
  variant = "default",
  showQCCount = true,
  onQuickView,
  className,
}: ItemCardProps) => {
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountPercent = hasDiscount
    ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
    : 0;

  const handleClick = (e: React.MouseEvent) => {
    if (onQuickView && e.currentTarget === e.target) {
      e.preventDefault();
      onQuickView(item);
    }
  };

  if (variant === "compact") {
    return (
      <Link
        href={`/item/${item.platform}/${item.itemId}`}
        className={cn(
          "group flex gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-xl",
          "hover:border-slate-700 hover:bg-slate-900 transition-all duration-200",
          className
        )}
        onClick={handleClick}
      >
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
          <img
            src={item.mainImage}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <PlatformBadge platform={item.platform} className="mb-1" />
            <h3 className="font-medium text-slate-100 truncate group-hover:text-brand-400 transition-colors">
              {item.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="font-semibold text-brand-400">{formatPrice(item.price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-slate-500 line-through">{formatPrice(item.originalPrice!)}</span>
                  <Badge variant="success" size="sm">-{discountPercent}%</Badge>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">{formatNumber(item.salesCount)} sold</span>
            {showQCCount && item.qcPhotos.length > 0 && (
              <span className="flex items-center gap-1 text-brand-400">
                <Eye className="w-3 h-3" />
                {item.qcPhotos.length} QC
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={cn(
        "group relative bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden",
        "hover:border-slate-700 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300",
        className
      )}
      onClick={handleClick}
    >
      <Link href={`/item/${item.platform}/${item.itemId}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-800">
          <img
            src={item.mainImage}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {hasDiscount && (
            <Badge variant="success" className="absolute top-3 left-3">
              -{discountPercent}%
            </Badge>
          )}
          {item.qcPhotos.length > 0 && showQCCount && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-slate-950/90 backdrop-blur rounded-full">
              <Eye className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-xs font-medium text-slate-100">{item.qcPhotos.length}</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-100">Quick View</span>
              <Eye className="w-4 h-4 text-brand-400" />
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <PlatformBadge platform={item.platform} />
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-red-400 hover:bg-red-900/20"
              aria-label="Add to favorites"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-brand-400 hover:bg-brand-500/20"
              aria-label="View item"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Link href={`/item/${item.platform}/${item.itemId}`} className="block">
          <h3 className="font-medium text-slate-100 line-clamp-2 group-hover:text-brand-400 transition-colors">
            {item.title}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-brand-400">{formatPrice(item.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-slate-500 line-through">{formatPrice(item.originalPrice!)}</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {formatNumber(item.salesCount)} sold
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            {item.rating.toFixed(1)} ({formatNumber(item.reviewCount)})
          </span>
          {showQCCount && item.qcPhotos.length > 0 && (
            <span className="flex items-center gap-1 text-brand-400">
              <Eye className="w-3 h-3" />
              {item.qcPhotos.length} QC
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 truncate max-w-[150px]">
            {item.seller.name}
          </span>
          <span className="text-xs text-slate-500">{item.platform.toUpperCase()}</span>
        </div>
      </div>
    </article>
  );
};