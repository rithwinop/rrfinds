"use client";

import { forwardRef, SelectHTMLAttributes, OptionHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none bg-slate-900 border border-slate-700 text-slate-100",
              "rounded-lg transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-800",
              "py-2.5 pl-4 pr-10 text-sm",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="mt-1.5 text-sm text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export interface MultiSelectOption extends SelectOption {
  selected?: boolean;
}

export interface MultiSelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxDisplay?: number;
  className?: string;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ label, error, hint, options, selectedValues, onChange, placeholder, maxDisplay = 2, className, ...props }, ref) => {
    const selectId = label?.toLowerCase().replace(/\s+/g, "-") || "multiselect";
    const isOpen = false;

    const handleToggle = (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onChange(newValues);
    };

    const displayValues = selectedValues.slice(0, maxDisplay);
    const remainingCount = selectedValues.length - maxDisplay;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <button
          type="button"
          id={selectId}
          className={cn(
            "w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg",
            "transition-colors text-left p-2.5 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-800",
            error && "border-red-500 focus:ring-red-500"
          )}
          aria-haspopup="listbox"
          aria-expanded={false}
          disabled={false}
        >
          <div className="flex flex-wrap items-center gap-1.5 min-h-[2.5rem]">
            {selectedValues.length === 0 && (
              <span className="text-slate-500 w-full">{placeholder || "Select options..."}</span>
            )}
            {displayValues.map((value) => {
              const option = options.find((o) => o.value === value);
              return (
                <Badge key={value} variant="outline" size="sm" className="shrink-0">
                  {option?.label || value}
                </Badge>
              );
            })}
            {remainingCount > 0 && (
              <Badge variant="outline" size="sm" className="shrink-0">
                +{remainingCount} more
              </Badge>
            )}
          </div>
        </button>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="mt-1.5 text-sm text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";