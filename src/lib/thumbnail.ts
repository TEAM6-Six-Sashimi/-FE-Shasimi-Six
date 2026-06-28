const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function isValidAbsoluteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return !!parsed.hostname && parsed.hostname.includes('.');
  } catch {
    return false;
  }
}

export function getThumbnailUrl(thumbnail?: string | null): string | null {
  if (!thumbnail) return null;

  if (thumbnail.startsWith('http')) {
    return isValidAbsoluteUrl(thumbnail) ? thumbnail : null;
  }

  return `${API_BASE_URL}/${thumbnail}`;
}