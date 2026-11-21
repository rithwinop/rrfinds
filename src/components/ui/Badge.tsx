import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", dot, children, ...props }, ref) => {
    const variants = {
      default: "bg-slate-800 text-slate-200 border border-slate-700",
      success: "bg-green-900/30 text-green-300 border border-green-800",
      warning: "bg-amber-900/30 text-amber-300 border border-amber-800",
      danger: "bg-red-900/30 text-red-300 border border-red-800",
      info: "bg-blue-900/30 text-blue-300 border border-blue-800",
      outline: "bg-transparent text-slate-300 border border-slate-600",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs gap-1",
      md: "px-2.5 py-1 text-xs gap-1.5",
      lg: "px-3 py-1.5 text-sm gap-2",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full border",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "rounded-full",
              variant === "success" && "bg-green-400",
              variant === "warning" && "bg-amber-400",
              variant === "danger" && "bg-red-400",
              variant === "info" && "bg-blue-400",
              variant === "default" && "bg-slate-400",
              variant === "outline" && "bg-slate-500",
              size === "sm" && "w-1.5 h-1.5",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-2.5 h-2.5"
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";