import { Suspense } from "react";
import EnrollmentContent from "@/features/user/enrollments/components/EnrollmentContent";
import { EnrollmentSticky } from '@/features/user/enrollments/components/EnrollmentSticky'
import { getEnrollmentSummary } from '@/features/user/enrollments/actions'

interface EnrollmentPageProps {
    searchParams: {courseIds?: string | string[] };
}

export default async function EnrollmentPage({
    searchParams,
}: EnrollmentPageProps) {

    const rawIds = searchParams.courseIds;
    const courseIds: string[] = rawIds
        ? Array.isArray(rawIds)
            ? rawIds
            : rawIds.split(",")
        : [];

        const summary = await getEnrollmentSummary(courseIds)

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