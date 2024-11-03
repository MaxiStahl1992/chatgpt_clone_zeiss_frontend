import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility functions for handling CSS class merging and CSRF token retrieval.
 * 
 * - `cn`: Merges multiple class names, removing duplicates using `clsx` and `twMerge`.
 * - `getCookie`: Retrieves a specific cookie value by name.
 * - `getCsrfToken`: Returns the CSRF token from the cookies (if available) for secure API requests.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export const getCsrfToken = () => getCookie("csrftoken");