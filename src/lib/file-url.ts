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
  if (!fileUrl) return '';

  // 백엔드가 이미 완전한(서명된) URL을 내려주는 경우 - 가공하지 않고 그대로 사용.
  // (우리 자체 /files/download?key=... 프록시 형태만 예외적으로 재조립 대상)
  if (/^https?:\/\//i.test(fileUrl) && !fileUrl.includes('/files/download')) {
    return fileUrl;
  }

  const key = extractFileKey(fileUrl);
  return `/api/files/download?key=${encodeURIComponent(key)}`;
}
