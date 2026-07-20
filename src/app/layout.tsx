import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import { cookies } from 'next/headers';
import { cn } from '@/lib/utils';
import { ToastProvider } from '@/components/ui/ToastContext';
import { MaintenanceProvider } from '@/components/system/MaintenanceProvider';
import Header from '@/components/layout/Header';
import { fetchUserMe, GUEST_USER } from '@/services/user.service';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sixsashimi.com.market-app.org/'),

  title: {
    default: '핏(Fit)-격 - 당신에게 딱 맞는 자격증을 합격하기 위한 강의가 여기에,',
    template: '%s | 핏(Fit)-격',
  },
  description:
    '취업 준비생의 자격증 취득을 단순 강의 제공을 넘어, 채용공고 기반 역량 분석 → 맞춤형 강의 추천 → AI 이력서 평가 → 취업 지원까지 하나의 흐름으로 연결하는 통합 학습 플랫폼입니다.',
  keywords: [
    '취준생',
    '자격증',
    '국가 자격증',
    '채용공고 분석',
    '채용공고',
    '역량 분석',
    '맞춤 강의 추천',
    '이력서 평가',
    '자소서 평가',
    '자격증 추천',
    'AI',
    '취업 지원',
    '인터넷 학습',
  ],
  authors: [{ name: 'Team Six-Sashimi', url: 'https://github.com/TEAM6-Six-Sashimi' }],
  creator: 'Team Six-Sashimi',
  publisher: 'Team Six-Sashimi',

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: '핏(Fit)-격',
    title: '핏(Fit)-격 - 당신에게 딱 맞는 자격증을 합격하기 위한 강의가 여기에,',
    description:
      '취업 준비생의 자격증 취득을 단순 강의 제공을 넘어, 채용공고 기반 역량 분석 → 맞춤형 강의 추천 → AI 이력서/자소서 평가 → 취업 지원까지 하나의 흐름으로 연결하는 통합 학습 플랫폼입니다.',
    images: [
      {
        url: '/FitGyeok-share2.png',
        width: 1200,
        height: 630,
        alt: '핏(Fit)-격 로고',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: '핏(Fit)-격 - 당신에게 딱 맞는 자격증을 합격하기 위한 강의가 여기에,',
    description:
      '취업 준비생의 자격증 취득을 단순 강의 제공을 넘어, 채용공고 기반 역량 분석 → 맞춤형 강의 추천 → AI 이력서/자소서 평가 → 취업 지원까지 하나의 흐름으로 연결하는 통합 학습 플랫폼입니다.',
    images: '/FitGyeok-share2.png',
    creator: '@Team_Six_Sashimi',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const user = accessToken ? await fetchUserMe(accessToken) : GUEST_USER;

  return (
    <html lang="ko" className={cn('font-sans', geist.variable)}>
      <body className="flex-1">
        <MaintenanceProvider isAdmin={user.role === 'ADMIN'}>
          <ToastProvider>
            <Header user={user} accessToken={accessToken} />
            <main>{children}</main>
          </ToastProvider>
        </MaintenanceProvider>
      </body>
    </html>
  );
}
