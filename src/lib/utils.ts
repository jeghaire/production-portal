import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatToApiDateFormat(dateStr: string): string {
  const [dd, mm, yyyy] = dateStr.split("-");
  return `${parseInt(mm)}/${parseInt(dd)}/${yyyy}`;
}

export const formatToUrlDate = (date: Date): string => {
  return format(date, "dd-MM-yyyy");
};