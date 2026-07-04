export function extractFileKey(fileUrl: string): string {
  if (!fileUrl) return '';

  // 파일 url 형태 확인
  const match = fileUrl.match(/\/files\/download\?key=([^&]+)/);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  return fileUrl;
}

// 다운로드 링크 생성
export function buildDownloadHref(fileUrl: string): string {
  const key = extractFileKey(fileUrl);
  return `/api/files/download?key=${encodeURIComponent(key)}`;
}
