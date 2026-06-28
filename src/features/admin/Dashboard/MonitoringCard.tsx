'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext';

export default function MonitoringCard() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetail = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/monitoring');
      if (!res.ok) throw new Error('모니터링 정보를 불러오지 못했습니다.');
      const { grafanaUrl } = await res.json();

      // 디버그: 실제로 받은 grafanaUrl 값 확인 (확인 후 삭제 가능)
      console.log('[MonitoringCard] grafanaUrl =', grafanaUrl);

      if (!grafanaUrl) throw new Error('대시보드 주소를 찾을 수 없습니다.');

      window.open(grafanaUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '대시보드를 여는 데 실패했습니다.',
        'negative',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <span className="text-[14px] font-semibold text-[#1E2125]">그라파나</span>
      <Button
        variant="outline"
        onClick={handleViewDetail}
        disabled={isLoading}
        className="h-9 px-4 border-[#D1D5DB] text-[#1E2125] text-[13px] font-semibold hover:bg-[#F9FAFB] cursor-pointer disabled:opacity-60"
      >
        {isLoading ? '불러오는 중...' : '상세보기'}
      </Button>
    </div>
  );
}