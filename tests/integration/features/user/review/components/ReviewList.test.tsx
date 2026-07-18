import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewList from '@/features/user/review/components/ReviewList';
import { CourseReview } from '@/features/user/review/types';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn(), back: jest.fn() }),
}));

jest.mock('@/components/ui/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('@/features/auth/actions', () => ({
  logoutAction: jest.fn(),
}));

jest.mock('@/features/user/review/actions', () => ({
  deleteReviewAction: jest.fn(),
  reportReviewAction: jest.fn(),
}));

const reviews: CourseReview[] = [
  {
    reviewId: 1,
    rating: 5,
    content: '만족스러운 강의였습니다.',
    writerLoginId: 'other_user',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    reviewId: 2,
    rating: 4,
    content: '제가 쓴 리뷰입니다.',
    writerLoginId: 'me',
    createdAt: '2026-01-02T00:00:00.000Z',
  },
];

describe('ReviewList', () => {
  it('비로그인 게스트에게는 신고/삭제 버튼이 전혀 보이지 않는다', () => {
    render(<ReviewList courseId={1} reviews={reviews} currentUserLoginId={null} />);

    expect(screen.queryByLabelText('수강평 신고')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('수강평 삭제')).not.toBeInTheDocument();
  });

  it('로그인한 사용자는 남의 리뷰엔 신고 버튼, 내 리뷰엔 삭제 버튼을 본다', () => {
    render(<ReviewList courseId={1} reviews={reviews} currentUserLoginId="me" />);

    // 본인 글이 항상 최상단으로 정렬되므로 삭제 버튼이 1개, 신고 버튼이 1개 존재해야 한다
    expect(screen.getAllByLabelText('수강평 삭제')).toHaveLength(1);
    expect(screen.getAllByLabelText('수강평 신고')).toHaveLength(1);
  });

  it('신고 버튼을 누르면 신고 모달이 열린다', async () => {
    const user = userEvent.setup();
    render(<ReviewList courseId={1} reviews={reviews} currentUserLoginId="me" />);

    await user.click(screen.getByLabelText('수강평 신고'));

    expect(screen.getByText('신고 사유를 선택해 주세요.')).toBeInTheDocument();
  });
});
