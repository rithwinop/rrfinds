"use client";

import { cn } from "@/lib/utils";
import type { Platform } from "@/types";

interface PlatformFilterProps {
  selectedPlatforms: Platform[];
  onChange: (platforms: Platform[]) => void;
  className?: string;
  showAll?: boolean;
}

const PLATFORM_INFO: Record<Platform, { label: string; color: string; icon: string }> = {
  taobao: { label: "Taobao", color: "orange", icon: "🟠" },
  "1688": { label: "1688", color: "green", icon: "🟢" },
  weidian: { label: "Weidian", color: "purple", icon: "🟣" },
};

export const PlatformFilter = ({
  selectedPlatforms,
  onChange,
  className,
  showAll = true,
}: PlatformFilterProps) => {
  const platforms: Platform[] = ["taobao", "1688", "weidian"];

  const togglePlatform = (platform: Platform) => {
    const newSelection = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];
    onChange(newSelection);
  };

  const handleSelectAll = () => {
    onChange(platforms);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const isAllSelected = selectedPlatforms.length === platforms.length;
  const isNoneSelected = selectedPlatforms.length === 0;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {showAll && (
        <button
          type="button"
          onClick={isAllSelected ? handleClearAll : handleSelectAll}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            isAllSelected
              ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
              : "bg-brand-500/20 text-brand-400 border border-brand-500/30 hover:bg-brand-500/30"
          )}
          aria-pressed={isAllSelected}
        >
          {isAllSelected ? "Clear All" : "All Platforms"}
        </button>
      )}

      <div className="flex items-center gap-2" role="group" aria-label="Platform filters">
        {platforms.map((platform) => {
          const info = PLATFORM_INFO[platform];
          const isSelected = selectedPlatforms.includes(platform);

          return (
            <button
              key={platform}
              type="button"
              onClick={() => togglePlatform(platform)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                isSelected
                  ? `bg-${info.color}-500/20 text-${info.color}-400 border border-${info.color}-500/30 hover:bg-${info.color}-500/30 shadow-${info.color}-500/10`
                  : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-slate-100"
              )}
              aria-pressed={isSelected}
              role="switch"
            >
              <span aria-hidden="true">{info.icon}</span>
              <span>{info.label}</span>
              {isSelected && (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const PlatformBadge = ({ platform, className }: { platform: Platform; className?: string }) => {
  const info = PLATFORM_INFO[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        `bg-${info.color}-500/20 text-${info.color}-400 border border-${info.color}-500/30`,
        className
      )}
    >
      <span aria-hidden="true">{info.icon}</span>
      {info.label}
    </span>
  );
};