import { buildDownloadHref } from '@/lib/file-url';

describe('buildDownloadHref', () => {
  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(buildDownloadHref('')).toBe('');
  });

  it('절대 URL(백엔드 presigned URL 등)은 가공하지 않고 그대로 반환한다', () => {
    const url = 'https://s3.example.com/videos/a.mp4?X-Amz-Signature=abc';
    expect(buildDownloadHref(url)).toBe(url);
  });

  it('백엔드의 상대경로(/files/download?key=...) 형태는 프론트 프록시 경로로 재조립한다', () => {
    expect(buildDownloadHref('/files/download?key=resume/abc.pdf')).toBe(
      '/api/files/download?key=resume%2Fabc.pdf',
    );
  });

  it('절대 URL이어도 /files/download를 포함하면 key를 추출해 프록시 경로로 재조립한다', () => {
    expect(
      buildDownloadHref('https://api.example.com/files/download?key=resume/abc.pdf'),
    ).toBe('/api/files/download?key=resume%2Fabc.pdf');
  });
});
