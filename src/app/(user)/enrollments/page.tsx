import { Suspense } from "react";
import { cookies } from "next/headers";
import EnrollmentContent from "@/features/user/enrollments/components/EnrollmentContent";
import { EnrollmentSticky } from '@/features/user/enrollments/components/EnrollmentSticky'
import { EnrollmentSummary, EnrollmentCourseItem } from '@/features/user/enrollments/types';

interface EnrollmentPageProps {
    searchParams: Promise<{courseIds?: string | string[] }>;
}

export default async function EnrollmentPage({
    searchParams,
}: EnrollmentPageProps) {
    const { courseIds: rawIds } = await searchParams;

    const courseIds: number[] = rawIds
        ? (Array.isArray(rawIds) ? rawIds : rawIds.split(','))
            .map(Number)
            .filter((id) => !isNaN(id))
        : [];

    // 진입 경로
    const source: 'single' | 'cart' = courseIds.length === 1 ? 'single' : 'cart';

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    let items: EnrollmentCourseItem[] = [];
    let totalPrice = 0;
    let ownedCredits = 0;

    if (accessToken && courseIds.length > 0) {
        // 강의 정보 조회 + 크레딧 조회 병렬 처리
        const [courseResults, creditsResult] = await Promise.allSettled([
          Promise.all(
            courseIds.map((id) =>
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                cache: 'no-store',
              }).then((r) => r.json())
            )
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/credits/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: 'no-store',
          }).then((r) => r.json()),
        ]);

        if (courseResults.status === 'fulfilled') {
          items = courseResults.value.map((c) => ({
            courseId: c.courseId,
            title: c.title,
            category: c.categoryName ?? '',
            instructorName: c.instructorName,
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

    const summary: EnrollmentSummary = {
      items,
      totalPrice,
      ownedCredits,
      remainingCredits: Math.max(0, ownedCredits - totalPrice),
      shortfallCredits: Math.max(0, totalPrice - ownedCredits),
      source,
    };

    return (
        <div className="min-h-screen bg-gray-50/60">
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                    <Suspense fallback={<EnerollmentContentSkeleton />}>
                        <EnrollmentContent items={summary.items} />
                    </Suspense>

                    <EnrollmentSticky summary={summary} />
                </div>
            </div>
        </div>
    );
}

function EnerollmentContentSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-pulse">
            <div className="h-7 w-32 bg-gray-200 rounded mb-6" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 mb-4 rounded-xl border border-gray-100">
                <div className="w-[120px] h-[80px] bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-28 bg-gray-200 rounded self-center" />
              </div>
            ))}
        </div>
    )
}