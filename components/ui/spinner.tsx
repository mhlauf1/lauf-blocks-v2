import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
  xl: "h-12 w-12 border-4",
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-primary border-t-transparent",
          sizeClasses[size],
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

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  blur?: boolean;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, loading = true, blur = true, children, ...props }, ref) => {
    if (!loading) return <>{children}</>;

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          className={cn(
            "absolute inset-0 z-50 flex items-center justify-center bg-background/80",
            blur && "backdrop-blur-sm"
          )}
        >
          <Spinner size="lg" />
        </div>
        <div className="opacity-50 pointer-events-none">{children}</div>
      </div>
    );
  }
);
LoadingOverlay.displayName = "LoadingOverlay";

export { Spinner, LoadingOverlay };
