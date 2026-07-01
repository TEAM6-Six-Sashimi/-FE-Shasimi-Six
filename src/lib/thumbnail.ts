const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function isLocalhostUrl(url: string): boolean {
  return url.includes('localhost') || url.includes('127.0.0.1');
}

export function isValidAbsoluteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname) return false;
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return true;
    return parsed.hostname.includes('.');
  } catch {
    return false;
  }
}

export function getThumbnailUrl(thumbnail?: string | null): string | null {
  if (!thumbnail) return null;

  let result: string | null;

  if (thumbnail.startsWith('http')) {
    result = isValidAbsoluteUrl(thumbnail) ? thumbnail : null;
  } else {
    const normalizedPath = thumbnail.startsWith('/') ? thumbnail : `/${thumbnail}`;
    result = `${API_BASE_URL}${normalizedPath}`;
  }

  return result;
}