'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';

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
        className="h-9 w-22 px-4 border-[1.5px] border-[#D1D5DB] text-[#1E2125] text-[13px] font-semibold hover:bg-[#F9FAFB] hover:border-[#6A7282] cursor-pointer disabled:opacity-60"
      >
        {isLoading ? <InlineDotsLoading /> : '바로가기'}
      </Button>
    </div>
  );
}
