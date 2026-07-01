import { test, expect, Page } from '@playwright/test';

// ── 공통 상수 ──────────────────────────────────────────────────────────────
const COURSE_URL = '/courses/정보처리기사/1';
const CATEGORY = '정보처리기사';
const COURSE_ID = 1;

// ── mock 헬퍼 ──────────────────────────────────────────────────────────────

/** 기본 강의 상세 응답 빌더 */
function buildCourseDetailResponse(
  overrides: {
    viewerType?: string;
    reviews?: object[];
    reviewCount?: number;
    ratingAvg?: number;
  } = {},
) {
  const { viewerType = 'ENROLLED', reviews = [], reviewCount = 0, ratingAvg = 0 } = overrides;

  return {
    courseId: COURSE_ID,
    categoryId: 1,
    categoryName: CATEGORY,
    title: '정보처리기사 필기 완전정복',
    description: '테스트 강의 설명',
    instructorName: '김강사',
    instructorId: 10,
    price: 50000,
    difficulty: 'BEGINNER',
    thumbnail: 'images/test.jpg',
    status: 'APPROVED',
    viewerType,
    ratingAvg,
    reviewCount,
    studentCount: 100,
    totalDuration: 3600,
    progressRate: viewerType === 'ENROLLED' ? 50 : 0,
    completed: false,
    ratingDistribution: [
      { star: 5, count: 0 },
      { star: 4, count: 0 },
      { star: 3, count: 0 },
      { star: 2, count: 0 },
      { star: 1, count: 0 },
    ],
    reviews,
    sessions: [
      {
        sessionId: 101,
        sessionUid: 'uid-101',
        title: '1강. 소개',
        videoUrl: 'videos/lectures/test.mp4',
        durationSeconds: 600,
        sessionOrder: 1,
        preview: false,
        attachmentName: '',
        attachmentUrl: '',
        attachmentType: '',
        attachmentSize: 0,
        sessionProgressRate: 50,
        lastPositionSeconds: 300,
        sessionCompleted: false,
      },
    ],
  };
}

/** 강의 상세 API를 mock하는 헬퍼 */
async function mockCourseDetail(
  page: Page,
  overrides: Parameters<typeof buildCourseDetailResponse>[0] = {},
) {
  await page.route(`**/api/courses/${COURSE_ID}**`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildCourseDetailResponse(overrides)),
    }),
  );
}

/** 로그인 상태 mock (쿠키 세팅) */
async function mockLogin(page: Page, overrides: { loginId?: string; role?: string } = {}) {
  const { loginId = 'testuser123', role = 'STUDENT' } = overrides;

  // 1. 실제 브라우저에 인증 쿠키가 있는 것처럼 속임
  await page.context().addCookies([
    {
      name: 'accessToken', // 프로젝트에서 사용하는 토큰 쿠키 이름으로 변경하세요
      value: 'mocked-completed-token',
      domain: 'localhost',
      path: '/',
    },
  ]);

  // 2. /users/me mock
  await page.route('**/users/me**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, loginId, name: '테스트유저', email: 'test@test.com', role }),
    }),
  );
}

/** 수강평 등록 API mock */
async function mockCreateReview(page: Page, status = 200, message?: string) {
  await page.route(`**/users/*/courses/${COURSE_ID}/reviews`, (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(status === 200 ? {} : { message: message ?? '오류가 발생했습니다.' }),
      });
    } else {
      route.continue();
    }
  });
}

/** 수강평 삭제 API mock */
async function mockDeleteReview(page: Page, reviewId: number, status = 200) {
  await page.route(`**/users/*/courses/${COURSE_ID}/reviews/${reviewId}/delete`, (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(status === 200 ? {} : { message: '삭제에 실패했습니다.' }),
    }),
  );
}

/** 수강평 신고 API mock */
async function mockReportReview(page: Page, reviewId: number, status = 200) {
  await page.route(`**/reviews/${reviewId}/reports`, (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(
        status === 200
          ? {}
          : status === 409
            ? { message: '이미 신고한 수강평입니다.' }
            : { message: '신고 처리에 실패했습니다.' },
      ),
    }),
  );
}

// ── 테스트: 수강평 작성 ────────────────────────────────────────────────────

test.describe('수강평 작성', () => {
  test('별점과 내용을 모두 입력하면 리뷰가 등록된다', async ({ page }) => {
    await mockLogin(page);
    await mockCourseDetail(page, { viewerType: 'ENROLLED' });
    await mockCreateReview(page, 200);

    await page.goto(COURSE_URL);
    await page.waitForSelector('#course-reviews');

    // 별점 4점 선택
    await page.getByRole('button', { name: '4점' }).click();

    // 내용 입력
    await page.getByLabel('수강평 내용').fill('정말 유익한 강의였습니다!');

    // 등록 버튼 클릭
    await page.getByRole('button', { name: '리뷰 등록' }).click();

    // 확인 모달
    await expect(page.getByText('리뷰를 등록하시겠습니까?')).toBeVisible();
    await page.getByRole('button', { name: '확인' }).click();

    // 성공 토스트
    await expect(page.getByText('리뷰가 등록되었습니다.')).toBeVisible();
  });

  test('별점 없이 등록 시 유효성 에러가 표시된다', async ({ page }) => {
    await mockLogin(page);
    await mockCourseDetail(page, { viewerType: 'ENROLLED' });

    await page.goto(COURSE_URL);
    await page.waitForSelector('#course-reviews');

    // 내용만 입력하고 별점은 선택하지 않음
    await page.getByLabel('수강평 내용').fill('내용만 입력했습니다.');
    await page.getByRole('button', { name: '리뷰 등록' }).click();

    // 유효성 에러 표시 확인
    await expect(page.getByText('평점을 선택해주세요.')).toBeVisible();

    // 확인 모달이 뜨지 않아야 함
    await expect(page.getByText('리뷰를 등록하시겠습니까?')).not.toBeVisible();
  });

  test('내용 없이 등록 시 유효성 에러가 표시된다', async ({ page }) => {
    await mockLogin(page);
    await mockCourseDetail(page, { viewerType: 'ENROLLED' });

    await page.goto(COURSE_URL);
    await page.waitForSelector('#course-reviews');

    // 별점만 선택하고 내용은 입력하지 않음
    await page.getByRole('button', { name: '3점' }).click();
    await page.getByRole('button', { name: '리뷰 등록' }).click();

    await expect(page.getByText('내용을 입력해주세요.')).toBeVisible();
    await expect(page.getByText('리뷰를 등록하시겠습니까?')).not.toBeVisible();
  });

  test('서버 오류 시 에러 토스트가 표시된다', async ({ page }) => {
    await mockLogin(page);
    await mockCourseDetail(page, { viewerType: 'ENROLLED' });
    await mockCreateReview(page, 500, '서버 오류가 발생했습니다.');

    await page.goto(COURSE_URL);
    await page.waitForSelector('#course-reviews');

    await page.getByRole('button', { name: '5점' }).click();
    await page.getByLabel('수강평 내용').fill('좋아요!');
    await page.getByRole('button', { name: '리뷰 등록' }).click();
    await page.getByRole('button', { name: '확인' }).click();

    await expect(page.getByText('서버 오류가 발생했습니다.')).toBeVisible();
  });

  test('미구매자(PUBLIC)는 수강평 작성 폼이 보이지 않는다', async ({ page }) => {
    await mockLogin(page);
    await mockCourseDetail(page, { viewerType: 'PUBLIC' });

    await page.goto(COURSE_URL);
    await page.waitForSelector('#course-reviews');

    await expect(page.getByText('수강평 작성하기')).not.toBeVisible();
    await expect(page.getByText('강의 구매 후 리뷰를 작성할 수 있습니다.')).toBeVisible();
  });

  test('강사 본인 강의에서는 수강평 폼과 안내문구가 보이지 않는다', async ({ page }) => {
    // 강사의 id를 10으로 설정하여 강의의 instructorId(10)와 일치시킵니다.
    await mockLogin(page, { role: 'INSTRUCTOR' });

    // 혹은 mockLogin 함수 내부에 id: 10을 명시적으로 넣어주거나
    // 아래처럼 강사 ID와 일치하도록 맞춰줍니다.
    await page.route('**/users/me**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 10, // instructorId와 동일하게 변경!
          loginId: 'instructor123',
          name: '김강사',
          role: 'INSTRUCTOR',
        }),
      }),
    );

    await mockCourseDetail(page, { viewerType: 'OWNER' });

    await page.goto(COURSE_URL);
    await page.waitForSelector('#course-reviews');

    await expect(page.getByText('수강평 작성하기')).not.toBeVisible();
    await expect(page.getByText('강의 구매 후 리뷰를 작성할 수 있습니다.')).not.toBeVisible();
  });

  // ── 테스트: 수강평 삭제 ────────────────────────────────────────────────────

  test.describe('수강평 삭제', () => {
    const MY_REVIEW = {
      reviewId: 201,
      rating: 4,
      content: '좋은 강의입니다.',
      writerLoginId: 'testuser123',
      createdAt: '2026-06-01T10:00:00',
    };

    const OTHER_REVIEW = {
      reviewId: 202,
      rating: 3,
      content: '보통입니다.',
      writerLoginId: 'other_user',
      createdAt: '2026-06-02T10:00:00',
    };

    test('본인 리뷰에는 삭제 버튼이 표시된다', async ({ page }) => {
      await mockLogin(page, { loginId: 'testuser123' });
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews: [MY_REVIEW],
        reviewCount: 1,
        ratingAvg: 4,
      });

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await expect(page.getByRole('button', { name: '수강평 삭제' })).toBeVisible();
    });

    test('타인 리뷰에는 삭제 버튼이 없고 신고 버튼만 있다', async ({ page }) => {
      await mockLogin(page, { loginId: 'testuser123' });
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews: [OTHER_REVIEW],
        reviewCount: 1,
        ratingAvg: 3,
      });

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await expect(page.getByRole('button', { name: '수강평 삭제' })).not.toBeVisible();
      await expect(page.getByRole('button', { name: '수강평 신고' })).toBeVisible();
    });

    test('삭제 확인 후 리뷰가 삭제된다', async ({ page }) => {
      await mockLogin(page, { loginId: 'testuser123' });
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews: [MY_REVIEW],
        reviewCount: 1,
        ratingAvg: 4,
      });
      await mockDeleteReview(page, MY_REVIEW.reviewId, 200);

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await page.getByRole('button', { name: '수강평 삭제' }).click();
      await expect(page.getByText('삭제하시겠습니까?')).toBeVisible();
      await page.getByRole('button', { name: '확인' }).click();

      await expect(page.getByText('수강평이 삭제되었습니다.')).toBeVisible();
    });

    test('삭제 후 재작성 시 에러가 표시된다', async ({ page }) => {
      await mockLogin(page, { loginId: 'testuser123' });
      // 삭제 후에는 reviews가 비어있는 상태로 재진입
      await mockCourseDetail(page, { viewerType: 'ENROLLED', reviews: [] });
      await mockCreateReview(page, 409, '이미 작성한 수강평이 있습니다.');

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await page.getByRole('button', { name: '5점' }).click();
      await page.getByLabel('수강평 내용').fill('재작성 시도합니다.');
      await page.getByRole('button', { name: '리뷰 등록' }).click();
      await page.getByRole('button', { name: '확인' }).click();

      await expect(page.getByText('이미 작성한 수강평이 있습니다.')).toBeVisible();
    });
  });

  // ── 테스트: 수강평 신고 ────────────────────────────────────────────────────

  test.describe('수강평 신고', () => {
    const OTHER_REVIEW = {
      reviewId: 301,
      rating: 1,
      content: '이 강의는 별로입니다.',
      writerLoginId: 'spammer',
      createdAt: '2026-06-01T10:00:00',
    };

    test('신고 버튼 클릭 시 신고 모달이 열린다', async ({ page }) => {
      await mockLogin(page, { loginId: 'testuser123' });
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews: [OTHER_REVIEW],
        reviewCount: 1,
        ratingAvg: 1,
      });

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await page.getByRole('button', { name: '수강평 신고' }).click();

      // 신고 모달이 열려야 함
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('신고 카테고리 선택 후 제출하면 신고가 접수된다', async ({ page }) => {
      await mockLogin(page, { loginId: 'testuser123' });
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews: [OTHER_REVIEW],
        reviewCount: 1,
        ratingAvg: 1,
      });
      await mockReportReview(page, OTHER_REVIEW.reviewId, 200);

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await page.getByRole('button', { name: '수강평 신고' }).click();

      // 카테고리 선택 (SPAM)
      await page.getByRole('radio', { name: '스팸' }).click();

      // 신고 제출
      await page.getByRole('button', { name: '신고하기' }).click();

      await expect(page.getByText('신고가 접수되었습니다.')).toBeVisible();
    });

    test('기타 카테고리 선택 시 상세 사유 입력란이 표시된다', async ({ page }) => {
      await mockLogin(page, { loginId: 'testuser123' });
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews: [OTHER_REVIEW],
        reviewCount: 1,
        ratingAvg: 1,
      });

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await page.getByRole('button', { name: '수강평 신고' }).click();
      await page.getByRole('radio', { name: '기타' }).click();

      // 기타 선택 시 사유 입력란이 나타나야 함
      await expect(page.getByPlaceholder(/신고 사유/)).toBeVisible();
    });

    test('중복 신고 시 409 에러 토스트가 표시된다', async ({ page }) => {
      await mockLogin(page, { loginId: 'testuser123' });
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews: [OTHER_REVIEW],
        reviewCount: 1,
        ratingAvg: 1,
      });
      await mockReportReview(page, OTHER_REVIEW.reviewId, 409);

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await page.getByRole('button', { name: '수강평 신고' }).click();
      await page.getByRole('radio', { name: '스팸' }).click();
      await page.getByRole('button', { name: '신고하기' }).click();

      await expect(page.getByText('이미 신고한 수강평입니다.')).toBeVisible();
    });
  });

  // ── 테스트: 정렬 ──────────────────────────────────────────────────────────

  test.describe('수강평 정렬', () => {
    const reviews = [
      {
        reviewId: 401,
        rating: 5,
        content: '최신 리뷰',
        writerLoginId: 'user_a',
        createdAt: '2026-06-10T10:00:00',
      },
      {
        reviewId: 402,
        rating: 2,
        content: '오래된 리뷰',
        writerLoginId: 'user_b',
        createdAt: '2026-05-01T10:00:00',
      },
    ];

    test('최신순 정렬 시 최신 리뷰가 먼저 표시된다', async ({ page }) => {
      await mockLogin(page);
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews,
        reviewCount: 2,
        ratingAvg: 3.5,
      });

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      const items = page.locator('ol[aria-label="수강평 목록"] li');
      await expect(items.first()).toContainText('최신 리뷰');
    });

    test('추천순 정렬 클릭 시 높은 별점 리뷰가 먼저 표시된다', async ({ page }) => {
      await mockLogin(page);
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews,
        reviewCount: 2,
        ratingAvg: 3.5,
      });

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      await page.getByRole('button', { name: '추천순' }).click();

      const items = page.locator('ol[aria-label="수강평 목록"] li');
      await expect(items.first()).toContainText('최신 리뷰'); // rating 5점
    });

    test('본인 리뷰는 정렬 기준과 관계없이 항상 최상단에 표시된다', async ({ page }) => {
      const myReview = {
        reviewId: 403,
        rating: 1,
        content: '내 리뷰 (가장 오래됨, 낮은 별점)',
        writerLoginId: 'testuser123',
        createdAt: '2026-01-01T10:00:00',
      };

      await mockLogin(page, { loginId: 'testuser123' });
      await mockCourseDetail(page, {
        viewerType: 'ENROLLED',
        reviews: [...reviews, myReview],
        reviewCount: 3,
        ratingAvg: 2.7,
      });

      await page.goto(COURSE_URL);
      await page.waitForSelector('#course-reviews');

      const items = page.locator('ol[aria-label="수강평 목록"] li');

      // 최신순에서도 내 리뷰가 최상단
      await expect(items.first()).toContainText('내 리뷰 (가장 오래됨, 낮은 별점)');

      // 추천순으로 바꿔도 내 리뷰가 최상단
      await page.getByRole('button', { name: '추천순' }).click();
      await expect(items.first()).toContainText('내 리뷰 (가장 오래됨, 낮은 별점)');
    });
  });
});
