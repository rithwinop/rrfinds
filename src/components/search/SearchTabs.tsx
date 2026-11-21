"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Image, Search, Link } from "lucide-react";

export type SearchMode = "url" | "keyword" | "image";

interface SearchTabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode: SearchMode;
  active: boolean;
  onClick: () => void;
}

const SearchTabButton = forwardRef<HTMLButtonElement, SearchTabButtonProps>(
  ({ mode, active, onClick, className, children, ...props }, ref) => {
    const icons = {
      url: Link,
      keyword: Search,
      image: Image,
    };

    const labels = {
      url: "URL / ID",
      keyword: "Keyword",
      image: "Image",
    };

    const Icon = icons[mode];

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          active
            ? "bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/25"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
          className
        )}
        {...props}
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
        <span>{labels[mode]}</span>
      </button>
    );
  }
);

SearchTabButton.displayName = "SearchTabButton";

interface SearchTabsProps {
  activeMode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  className?: string;
}

export const SearchTabs = ({ activeMode, onModeChange, className }: SearchTabsProps) => (
  <div
    role="tablist"
    aria-label="Search mode"
    className={cn("flex items-center gap-1 bg-slate-800/50 rounded-lg p-1", className)}
  >
    {(["url", "keyword", "image"] as SearchMode[]).map((mode) => (
      <SearchTabButton
        key={mode}
        mode={mode}
        active={activeMode === mode}
        onClick={() => onModeChange(mode)}
        role="tab"
        aria-selected={activeMode === mode}
        aria-controls={`${mode}-panel`}
        id={`${mode}-tab`}
      />
    ))}
  </div>
);