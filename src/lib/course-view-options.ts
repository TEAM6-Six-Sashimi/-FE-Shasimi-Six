import { CourseDetailFromAPI } from '@/features/user/courses/types';
import { ReviewMode } from '@/features/user/review/types';

export type ActionType =
  | 'purchase' // 구매하기/장바구니 (PUBLIC)
  | 'continue-watching' // 이어보기/다시보기 (ENROLLED)
  | 'manage' // 운영관리 (OWNER/ADMIN, APPROVED/CLOSED)
  | 'approve-reject' // 승인/반려 (ADMIN, PENDING)
  | 'none'; // 버튼 없음 (OWNER의 PENDING/REJECTED 등)

export interface CourseViewOptions {
  showProgress: boolean;
  allSessionsPlayable: boolean;
  reviewMode: ReviewMode;
  actionType: ActionType;
}

export function resolveCourseViewOptions(course: CourseDetailFromAPI): CourseViewOptions {
  const { viewerType, status, reviewCount } = course;

  switch (viewerType) {
    case 'PUBLIC':
      return {
        showProgress: false,
        allSessionsPlayable: false, // preview만 재생 가능
        reviewMode: reviewCount === 0 ? 'no-reviews' : 'readonly',
        actionType: 'purchase',
      };

    case 'ENROLLED':
      return {
        showProgress: true,
        allSessionsPlayable: true,
        reviewMode: 'writable',
        actionType: 'continue-watching',
      };

    case 'OWNER':
      return {
        showProgress: false,
        allSessionsPlayable: true,
        reviewMode: reviewCount === 0 ? 'no-reviews' : 'hidden-form',
        actionType: status === 'APPROVED' || status === 'CLOSED' ? 'manage' : 'none',
      };

    case 'ADMIN':
      return {
        showProgress: false,
        allSessionsPlayable: true,
        reviewMode: reviewCount === 0 ? 'no-reviews' : 'hidden-form',
        actionType:
          status === 'PENDING'
            ? 'approve-reject'
            : status === 'APPROVED' || status === 'CLOSED'
              ? 'manage'
              : 'none',
      };

    default:
      return {
        showProgress: false,
        allSessionsPlayable: false,
        reviewMode: 'no-reviews',
        actionType: 'none',
      };
  }
}