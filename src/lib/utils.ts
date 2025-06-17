import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToApiDateFormat(dateStr: string): string {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${parseInt(mm)}/${parseInt(dd)}/${yyyy}`;
  }
