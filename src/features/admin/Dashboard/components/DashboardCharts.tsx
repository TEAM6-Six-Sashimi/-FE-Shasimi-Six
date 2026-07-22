'use client';

import dynamic from 'next/dynamic';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';

// recharts를 이 컴포넌트가 실제로 마운트될 때만 별도 청크로 불러오기 위한 지연 로드
function ChartCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
      <div className="h-72 flex items-center justify-center text-[13px] text-[#6A7282]">
        <InlineDotsLoading dotColor="#FF5E5E" />
      </div>
    </div>
  );
}

const LoginStatsChart = dynamic(() => import('./LoginStatsChart'), {
  ssr: false,
  loading: ChartCardSkeleton,
});

const AiUsageChart = dynamic(() => import('./AiUsageChart'), {
  ssr: false,
  loading: ChartCardSkeleton,
});

export default function DashboardCharts() {
  return (
    <>
      <LoginStatsChart />
      <AiUsageChart />
    </>
  );
}
