import { Suspense } from 'react';
import { cookies } from 'next/headers';
import PaymentContent from '@/features/user/payments/components/PaymentContent';
import { PaymentSticky } from '@/features/user/payments/components/PaymentSticky';
import { fetchPlanPreviewAction } from '@/features/user/payments/actions';
import { PaymentSummary, OrderLineItem } from '@/features/user/payments/types';
import { fetchCategories } from '@/services/categories.service';
import { Category } from '@/features/categories/types';

interface PaymentPageProps {
  searchParams: Promise<{
    courseIds?: string | string[];
    type?: string; // "subscription"이면 AI 구독 결제
    planCode?: string;
  }>;
}

export default async function PaymentsPage({ searchParams }: PaymentPageProps) {
  const { courseIds: rawIds, type, planCode } = await searchParams;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // categories는 강의/구독 어느 쪽이든 카테고리 표시에 필요하므로 공통으로 조회
  const categories = await fetchCategories();

  // ── AI 구독 결제 ──────────────────────────────────────────
  if (type === 'subscription' && planCode) {
    const preview = accessToken ? await fetchPlanPreviewAction(planCode) : null;

    const items: OrderLineItem[] = preview
      ? [
          {
            id: preview.planCode,
            title: preview.planName,
            subtitle: `AI 구독권 ${preview.durationMonths}개월`,
            thumbnail: preview.planThumbnail,
            price: preview.price,
          },
        ]
      : [];

    const summary: PaymentSummary = {
      purchaseType: 'AI_SUBSCRIPTION',
      items,
      totalPrice: preview?.price ?? 0,
      ownedCredits: preview?.creditBalance ?? 0,
      remainingCredits: preview ? Math.max(0, preview.creditBalance - preview.price) : 0,
      shortfallCredits: preview?.insufficientAmount ?? 0,
      planCode,
    };

    return <PaymentPageLayout summary={summary} categories={categories} />;
  }
  // ── 강의 단일 / 장바구니 결제 ─────────────────────────────
  const courseIds: number[] = rawIds
    ? (Array.isArray(rawIds) ? rawIds : rawIds.split(',')).map(Number).filter((id) => !isNaN(id))
    : [];

  const purchaseType: 'COURSE' | 'CART' = courseIds.length === 1 ? 'COURSE' : 'CART';

  let items: OrderLineItem[] = [];
  let totalPrice = 0;
  let ownedCredits = 0;

  if (accessToken && courseIds.length > 0) {
    const [courseResults, creditsResult] = await Promise.allSettled([
      Promise.all(
        courseIds.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: 'no-store',
          }).then((r) => r.json()),
        ),
      ),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/credits/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      }).then((r) => r.json()),
    ]);

    if (courseResults.status === 'fulfilled') {
      items = courseResults.value.map((c) => ({
        id: String(c.courseId),
        title: c.title,
        subtitle: c.categoryName ?? '',
        meta: c.instructorName,
        price: c.price,
        thumbnail: c.thumbnail ?? '',
      }));
      totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    } else {
      console.error('강의 정보 조회 실패:', courseResults.reason);
    }

    if (creditsResult.status === 'fulfilled') {
      ownedCredits = creditsResult.value.balance ?? 0;
    } else {
      console.error('크레딧 조회 실패:', creditsResult.reason);
    }
  }

  const summary: PaymentSummary = {
    purchaseType,
    items,
    totalPrice,
    ownedCredits,
    remainingCredits: Math.max(0, ownedCredits - totalPrice),
    shortfallCredits: Math.max(0, totalPrice - ownedCredits),
    courseIds,
  };

  return <PaymentPageLayout summary={summary} categories={categories} />;
}

// PaymentPageLayout에 categories prop 추가
function PaymentPageLayout({
  summary,
  categories,
}: {
  summary: PaymentSummary;
  categories: Category[];
}) {
  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-280 mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          <Suspense fallback={<PaymentContentSkeleton />}>
            <PaymentContent items={summary.items} categories={categories} />
          </Suspense>

          <PaymentSticky summary={summary} />
        </div>
      </div>
    </div>
  );
}

function PaymentContentSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-pulse">
      <div className="h-7 w-32 bg-gray-200 rounded mb-6" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 mb-4 rounded-xl border border-gray-100">
          <div className="w-30 h-20 bg-gray-200 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-28 bg-gray-200 rounded self-center" />
        </div>
      ))}
    </div>
  );
}
