import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetSrc(asset: string | { src: string }): string {
  return typeof asset === 'string' ? asset : asset.src;
}
