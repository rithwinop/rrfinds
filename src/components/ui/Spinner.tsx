import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "brand" | "white";
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizes = {
      sm: "w-4 h-4 border-2",
      md: "w-6 h-6 border-2",
      lg: "w-8 h-8 border-3",
      xl: "w-12 h-12 border-4",
    };

    const variants = {
      default: "border-slate-700 border-t-brand-500",
      brand: "border-slate-700/50 border-t-brand-500",
      white: "border-slate-300/30 border-t-white",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full",
          sizes[size],
          variants[variant],
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export interface SpinnerOverlayProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const SpinnerOverlay = forwardRef<HTMLDivElement, SpinnerOverlayProps>(
  ({ className, message, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center",
        "bg-slate-950/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <Spinner size="lg" variant="brand" />
      {message && (
        <p className="mt-4 text-sm text-slate-400 text-center max-w-xs">{message}</p>
      )}
    </div>
  )
);

SpinnerOverlay.displayName = "SpinnerOverlay";