/**
 * 백엔드가 내려주는 fileUrl/resumeFileUrl 등은 순수 key가 아니라
 * 이미 "/files/download?key=실제키" 형태의 경로로 내려온다.
 * 우리 Next API 라우트(/api/files/download)는 진짜 key 값만 필요하므로,
 * 여기서 그 안에 든 key 쿼리 파라미터를 추출한다.
 *
 * 혹시 향후 백엔드가 순수 key만 내려주는 경우에도 대응하기 위해,
 * "/files/download?key=" 형태가 아니면 입력값을 그대로 key로 취급한다.
 */
export function extractFileKey(fileUrl: string): string {
  if (!fileUrl) return '';

  // "/files/download?key=xxx" 또는 "https://.../files/download?key=xxx" 형태인지 확인
  const match = fileUrl.match(/\/files\/download\?key=([^&]+)/);
  if (match) {
    // 백엔드가 이미 인코딩해서 내려줬을 수 있으므로 디코딩 후 반환
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  // 이미 순수 key 형태인 경우 그대로 반환
  return fileUrl;
}

/**
 * 우리 Next API 라우트(/api/files/download)를 거치는 다운로드 링크를 생성한다.
 */
export function buildDownloadHref(fileUrl: string): string {
  const key = extractFileKey(fileUrl);
  return `/api/files/download?key=${encodeURIComponent(key)}`;
}