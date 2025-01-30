import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// src/lib/utils.ts
export const normalizeString = (str: string): string =>
  str.toLowerCase().trim().replace(/\s+/g, " ");
