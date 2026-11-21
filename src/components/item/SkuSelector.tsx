"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";
import type { SKU } from "@/types";

interface SkuSelectorProps {
  skus: SKU[];
  selectedSku?: SKU;
  onSelect: (sku: SKU) => void;
  className?: string;
}

export const SkuSelector = ({ skus, selectedSku, onSelect, className }: SkuSelectorProps) => {
  if (!skus || skus.length === 0) return null;

  const colorSkus = skus.filter((sku) => sku.color && !sku.size);
  const sizeSkus = skus.filter((sku) => sku.size && !sku.color);
  const variantSkus = skus.filter((sku) => sku.color && sku.size);

  const groupedByColor: Record<string, SKU[]> = {};
  const groupedBySize: Record<string, SKU[]> = {};

  if (variantSkus.length > 0) {
    variantSkus.forEach((sku) => {
      if (sku.color) {
        if (!groupedByColor[sku.color]) groupedByColor[sku.color] = [];
        groupedByColor[sku.color].push(sku);
      }
      if (sku.size) {
        if (!groupedBySize[sku.size]) groupedBySize[sku.size] = [];
        groupedBySize[sku.size].push(sku);
      }
    });
  }

  const allSkus = variantSkus.length > 0 ? variantSkus : skus;

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-slate-100">Select Variant</h2>

      {Object.keys(groupedByColor).length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Color</label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color options">
            {Object.entries(groupedByColor).map(([color, colorSkus]) => {
              const representative = colorSkus[0];
              const isSelected = selectedSku?.color === color;
              const isOutOfStock = colorSkus.every((s) => s.stock === 0);

              return (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={isOutOfStock}
                  onClick={() => !isOutOfStock && onSelect(representative)}
                  disabled={isOutOfStock}
                  className={cn(
                    "relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 min-w-[80px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    isSelected
                      ? "border-brand-500 bg-brand-500/10 text-brand-400"
                      : isOutOfStock
                      ? "border-slate-700 bg-slate-800/50 text-slate-500 cursor-not-allowed line-through"
                      : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100"
                  )}
                >
                  {color}
                  {isSelected && (
                    <Check className="absolute top-1 right-1 w-4 h-4 text-brand-500" aria-hidden="true" />
                  )}
                  {isOutOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                      OOS
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {Object.keys(groupedBySize).length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Size</label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size options">
            {Object.entries(groupedBySize)
              .sort(([a], [b]) => {
                const numA = parseFloat(a);
                const numB = parseFloat(b);
                if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                return a.localeCompare(b);
              })
              .map(([size, sizeSkus]) => {
                const representative = sizeSkus[0];
                const isSelected = selectedSku?.size === size;
                const isOutOfStock = sizeSkus.every((s) => s.stock === 0);

                return (
                  <button
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={isOutOfStock}
                    onClick={() => !isOutOfStock && onSelect(representative)}
                    disabled={isOutOfStock}
                    className={cn(
                      "relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 min-w-[80px]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                      isSelected
                        ? "border-brand-500 bg-brand-500/10 text-brand-400"
                        : isOutOfStock
                        ? "border-slate-700 bg-slate-800/50 text-slate-500 cursor-not-allowed line-through"
                        : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100"
                    )}
                  >
                    {size}
                    {isSelected && (
                      <Check className="absolute top-1 right-1 w-4 h-4 text-brand-500" aria-hidden="true" />
                    )}
                    {isOutOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                        OOS
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {colorSkus.length > 0 && sizeSkus.length === 0 && variantSkus.length === 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Options</label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Product options">
            {colorSkus.map((sku) => {
              const isSelected = selectedSku?.id === sku.id;
              const isOutOfStock = sku.stock === 0;

              return (
                <button
                  key={sku.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={isOutOfStock}
                  onClick={() => !isOutOfStock && onSelect(sku)}
                  disabled={isOutOfStock}
                  className={cn(
                    "relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    isSelected
                      ? "border-brand-500 bg-brand-500/10 text-brand-400"
                      : isOutOfStock
                      ? "border-slate-700 bg-slate-800/50 text-slate-500 cursor-not-allowed line-through"
                      : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100"
                  )}
                >
                  {sku.color || sku.size || sku.id}
                  {isSelected && (
                    <Check className="absolute top-1 right-1 w-4 h-4 text-brand-500" aria-hidden="true" />
                  )}
                  {isOutOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                      OOS
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedSku && (
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                {selectedSku.image ? (
                  <img src={selectedSku.image} alt={selectedSku.color || selectedSku.size || "SKU"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <div>
                <p className="font-medium text-slate-100">
                  {selectedSku.color && selectedSku.size
                    ? `${selectedSku.color} / ${selectedSku.size}`
                    : selectedSku.color || selectedSku.size || selectedSku.id}
                </p>
                <p className="text-sm text-slate-400">SKU: {selectedSku.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-brand-400">{formatPrice(selectedSku.price)}</p>
              <p className={cn("text-sm", selectedSku.stock > 0 ? "text-green-400" : "text-red-400")}>
                {selectedSku.stock > 0 ? `In Stock (${selectedSku.stock})` : "Out of Stock"}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};