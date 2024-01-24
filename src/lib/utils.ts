import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ellipsisAddressHard(address: string | undefined) {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 6,
    address.length
  )}`;
}

export function ellipsisAddress(address: string | undefined) {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 21)}...${address.slice(
    address.length - 8,
    address.length
  )}`;
}