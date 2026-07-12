import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchUserMeStrict, GUEST_USER } from '@/services/user.service';
import { fetchMyResume } from '@/services/resume.service';
import ResumePageClient from '@/features/user/resume/components/ResumePageClient';
import { fetchMySubscriptionAction } from '@/features/user/payments/actions';

export const metadata: Metadata = {
  title: 'AI 이력서 작성 & 평가',
  description: '템플릿으로 이력서를 작성하고 AI가 점수와 개선 방향까지 알려드립니다.',
  openGraph: {
    title: 'AI 이력서 작성 & 평가 | 핏(Fit)-격',
    description: '템플릿으로 이력서를 작성하고 AI가 점수와 개선 방향까지 알려드립니다.',
    url: '/resume',
  },
};

export default async function ResumePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let user = GUEST_USER;
  let isLoggedIn = false;
  if (accessToken) {
    try {
      user = await fetchUserMeStrict(accessToken);
      isLoggedIn = true;
    } catch {
      // 세션이 죽은 경우 - 이 페이지는 비로그인도 지원하므로 강제 로그아웃하지 않고 게스트로 표시
    }
  }

  const [savedResume, mySubscription] = await Promise.all([
    isLoggedIn ? fetchMyResume(accessToken!) : Promise.resolve(null),
    fetchMySubscriptionAction(),
  ]);

  return (
    <ResumePageClient
      userName={user.name}
      userPhone={user.phone}
      userEmail={user.email}
      savedResume={savedResume}
      mySubscription={mySubscription}
      isLoggedIn={isLoggedIn}
    />
  );
}
