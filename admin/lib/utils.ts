import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  // Remove non-digits but keep leading + if present
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it starts with +620, 620, or 0, normalization is needed
  // However, the user specifically wants to allow 0, 62, or +62
  // but prevent +620... or 620...
  
  if (cleaned.startsWith('+620')) {
    cleaned = '+62' + cleaned.substring(4);
  } else if (cleaned.startsWith('620')) {
    cleaned = '62' + cleaned.substring(3);
  }
  
  return cleaned;
}

export function getPhoneNumberVariations(phone: string): string[] {
  // Strip all non-digits
  let digits = phone.replace(/\D/g, '');
  
  // If starts with 62, get the base (strip 62)
  if (digits.startsWith('62')) {
    digits = digits.substring(2);
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  
  // Return all 3 common formats
  return [
    `0${digits}`,
    `62${digits}`,
    `+62${digits}`
  ];
}
