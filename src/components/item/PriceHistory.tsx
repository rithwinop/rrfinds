"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { PricePoint } from "@/types";

interface PriceHistoryProps {
  data: PricePoint[];
  className?: string;
}

export const PriceHistory = ({ data, className }: PriceHistoryProps) => {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const prices = sortedData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const currentPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const priceChange = currentPrice - firstPrice;
  const priceChangePercent = ((priceChange / firstPrice) * 100).toFixed(1);

  const width = 100;
  const height = 120;
  const padding = { top: 20, right: 10, bottom: 20, left: 50 };

  const getX = (index: number) => padding.left + (index / (sortedData.length - 1 || 1)) * (width - padding.left - padding.right);
  const getY = (price: number) => padding.top + (1 - (price - minPrice) / priceRange) * (height - padding.top - padding.bottom);

  const pathData = sortedData
    .map((_, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(prices[i])}`)
    .join(" ");

  const areaPathData = [
    `M ${getX(0)} ${height - padding.bottom}`,
    pathData.replace("M", "L"),
    `L ${getX(sortedData.length - 1)} ${height - padding.bottom}`,
    "Z",
  ].join(" ");

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Price History</h2>
        <div className="flex items-center gap-4 text-sm">
          <span
            className={cn(
              "font-medium",
              priceChange >= 0 ? "text-red-400" : "text-green-400"
            )}
          >
            {priceChange >= 0 ? "+" : ""}{formatPrice(priceChange)} ({priceChangePercent}%)
          </span>
          <span className="text-slate-500">Low: {formatPrice(minPrice)}</span>
          <span className="text-slate-500">High: {formatPrice(maxPrice)}</span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect
            x={padding.left}
            y={padding.top}
            width={width - padding.left - padding.right}
            height={height - padding.top - padding.bottom}
            fill="url(#priceGradient)"
            className="area-path"
          />

          <path
            d={pathData}
            stroke="#fbbf24"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="line-path"
          />

          {sortedData.map((point, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(point.price)}
              r="3"
              fill="#fbbf24"
              stroke="#030712"
              strokeWidth="2"
              className="data-point"
            />
          ))}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-between px-4 text-xs text-slate-500">
          <span>{new Date(sortedData[0].date).toLocaleDateString()}</span>
          <span>{new Date(sortedData[sortedData.length - 1].date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-500 mb-1">Current Price</p>
          <p className="text-xl font-bold text-brand-400">{formatPrice(currentPrice)}</p>
        </div>
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-500 mb-1">All-Time Low</p>
          <p className="text-xl font-bold text-green-400">{formatPrice(minPrice)}</p>
        </div>
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-500 mb-1">All-Time High</p>
          <p className="text-xl font-bold text-red-400">{formatPrice(maxPrice)}</p>
        </div>
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-500 mb-1">Avg Price</p>
          <p className="text-xl font-bold text-slate-300">
            {formatPrice(prices.reduce((a, b) => a + b, 0) / prices.length)}
          </p>
        </div>
      </div>
    </section>
  );
};