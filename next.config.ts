import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/files/**',
      },
      {
        // 운영 백엔드 도메인으로 교체 필요 (예: api.fitgyuk.com)
        protocol: 'https',
        hostname: 'YOUR_PRODUCTION_API_DOMAIN',
        pathname: '/**',
      },
    ],
  },
};

// 번들 분석기 설정
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true', // 빌드시 ANALYZE 환경변수 true일 경우 번들 분석기 활성화
  openAnalyzer: true, // 번들 분석기 활성화 된 채로 빌드 완료 => 분석 결과 페이지 브라우저로 자동 열기
});

export default bundleAnalyzer(nextConfig);
