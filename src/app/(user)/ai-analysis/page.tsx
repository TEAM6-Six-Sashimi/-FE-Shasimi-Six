import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchUserMeStrict, GUEST_USER } from '@/services/user.service';
import { fetchMyResume } from '@/services/resume.service';
import {
  fetchLatestCoverLetterReviewAction,
  fetchMyCoverLetterAction,
} from '@/features/user/self-introduction/actions';
import { fetchLatestAiReviewAction } from '@/features/user/resume/actions';
import { fetchMySubscriptionAction } from '@/features/user/payments/actions';
import AiAnalysisPageClient from '@/features/user/ai-analysis/components/AiAnalysisPageClient';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export const metadata: Metadata = {
  title: 'AI 이력서, 자기소개서 작성 & 평가',
  description: '템플릿으로 이력서 및 자기소개서를 작성하고 AI가 점수와 개선 방향까지 알려드립니다.',
  openGraph: {
    title: 'AI 이력서 작성 & 평가 | 핏(Fit)-격',
    description: '템플릿으로 이력서를 작성하고 AI가 점수와 개선 방향까지 알려드립니다.',
    url: '/ai-analysis',
  },
};

export default async function AiAnalysisPage() {
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

  let savedResume, savedCoverLetter, latestCoverLetterReview, mySubscription, latestAiReview;
  try {
    [savedResume, savedCoverLetter, latestCoverLetterReview, mySubscription] = await Promise.all([
      isLoggedIn ? fetchMyResume(accessToken!) : Promise.resolve(null),
      isLoggedIn ? fetchMyCoverLetterAction() : Promise.resolve(null),
      isLoggedIn ? fetchLatestCoverLetterReviewAction() : Promise.resolve(null),
      fetchMySubscriptionAction(),
    ]);

    latestAiReview =
      isLoggedIn && savedResume ? await fetchLatestAiReviewAction(savedResume.resumeId) : null;
  } catch (e) {
    // 세션이 완전히 끊긴 경우 - 로그아웃 처리
    if (e instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={e.message} />;
    }
    throw e;
  }

  return (
    <AiAnalysisPageClient
      userName={user.name}
      userPhone={user.phone}
      userEmail={user.email}
      savedResume={savedResume}
      savedCoverLetter={savedCoverLetter}
      latestCoverLetterReview={latestCoverLetterReview}
      latestAiReview={latestAiReview}
      mySubscription={mySubscription}
      isLoggedIn={isLoggedIn}
    />
  );
}
