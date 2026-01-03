import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes with tailwind-merge.
 * This prevents duplicate Tailwind classes and handles conditional classes.
 *
 * @example
 * cn("px-4 py-2", "bg-blue-500", condition && "text-white")
 * cn("p-4", { "bg-red-500": isError, "bg-green-500": isSuccess })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
