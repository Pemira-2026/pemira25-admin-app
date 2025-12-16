import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
}

/**
 * Fixes timezone mismatch for server timestamps.
 * The backend sends Local Time (WIB) but tags it with 'Z' (UTC).
 * Example: 18:30 WIB is sent as "18:30 Z" (which is technically 01:30 WIB next day).
 * We fix this by removing the 'Z', causing the browser to parse "18:30" as Local Time.
 */
export function fixUtcToWib(dateString: string | Date): Date {
     if (dateString instanceof Date) return dateString;
     if (!dateString) return new Date();

     // Now that backend sends proper ISO string with timezone, we just parse it.
     return new Date(dateString);
}
