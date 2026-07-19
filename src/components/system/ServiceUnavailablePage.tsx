'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { fetchMaintenanceStatus } from '@/services/maintenance.service';
import { getSafeRedirect } from '@/lib/safe-redirect';

const POLL_INTERVAL_MS = 5000; // 미들웨어의 점검 상태 캐시 TTL과 맞춤

interface ServiceUnavailablePageProps {
  message: string;
  /** 점검 종료가 감지되면 이동할 경로. 안 주면 홈으로. (독립된 /maintenance 페이지에서 사용) */
  redirectTo?: string;
  /** 점검 종료가 감지됐을 때 이동 대신 직접 처리하고 싶은 경우(이미 렌더돼 있던 페이지를 그대로 복귀시키는 용도) */
  onRecovered?: () => void;
}

export default function ServiceUnavailablePage({
  message,
  redirectTo,
  onRecovered,
}: ServiceUnavailablePageProps) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const checkAndRecover = async () => {
      try {
        const status = await fetchMaintenanceStatus();
        if (cancelled || status.enabled) return;

        if (onRecovered) {
          onRecovered();
        } else {
          const safeTarget = getSafeRedirect(redirectTo);
          router.replace(safeTarget === '/maintenance' ? '/' : safeTarget);
        }
      } catch {
        // 상태 조회 자체가 실패하면(백엔드가 아직 안 올라옴 등) 다음 폴링에서 다시 시도
      }
    };

    checkAndRecover();
    const timer = setInterval(checkAndRecover, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [router, redirectTo, onRecovered]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white">
      <div className="w-16 h-16 rounded-full bg-[#FFEBEB] flex items-center justify-center">
        <span className="text-[#FF5E5E] text-[35px] font-bold">!</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[28px] font-bold text-[#FF5E5E]">서비스 점검 중</h1>
        <p className="text-[16px] font-semibold text-[#1E2125]">
          서비스 이용이 잠시 어렵습니다
        </p>
        <p className="text-[13.5px] text-[#6A7282]">{message}</p>
      </div>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 h-auto border-2 border-[#D1D5DB] text-[14px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] hover:text-[#1E2125] cursor-pointer"
      >
        새로 고침
      </Button>
    </div>
  );
}
