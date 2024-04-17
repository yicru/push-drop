import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createFileChunks(
  base64String: string,
  chunkSize: number,
): string[] {
  const chunks: string[] = []
  for (let i = 0; i < base64String.length; i += chunkSize) {
    chunks.push(base64String.substring(i, i + chunkSize))
  }
  return chunks
}

export function joinFileChunks(chunks: string[]): string {
  return chunks.join('')
}
