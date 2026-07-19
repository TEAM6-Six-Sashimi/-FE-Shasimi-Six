'use client';

import { useState, useEffect, useRef } from 'react';
import { reissueAction, logoutToLoginAction } from '@/features/auth/actions';
import { useToast } from '@/components/ui/ToastContext';

export default function TokenTimer() {
  const { showToast } = useToast();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isExtending, setIsExtending] = useState(false);
  const isExtendingRef = useRef(false);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    isExtendingRef.current = isExtending;
  }, [isExtending]);

  const getExpiresAt = (): number | null => {
    const match = document.cookie.match(/accessTokenExpiresAt=(\d+)/);
    return match ? Number(match[1]) : null;
  };

  useEffect(() => {
    const tick = async () => {
      const expiresAt = getExpiresAt();
      if (!expiresAt) {
        setRemaining(null);
        return;
      }
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemaining(diff);

      // 만료 시각 도달 - 연장 시도 중이 아니면 안내 후 자동 로그아웃 (한 번만 실행)
      if (diff === 0 && !hasExpiredRef.current && !isExtendingRef.current) {
        hasExpiredRef.current = true;
        showToast('로그인 유효시간이 만료되어 자동으로 로그아웃됩니다.', 'alarm');
        await logoutToLoginAction();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 연장하기 클릭
  const handleExtend = async () => {
    setIsExtending(true);
    try {
      const result = await reissueAction();
      if (!result.success) {
        // 리프레시 토큰도 이미 만료/누락된 상태(자동 로그아웃) -> 남은 쿠키를 정리하고 홈으로
        showToast(result.message ?? '로그인 유효시간이 만료되었습니다.', 'alarm');
        await logoutToLoginAction();
        return;
      }
      // 성공 시 새 만료 시각을 즉시 반영
      hasExpiredRef.current = false;
      const expiresAt = getExpiresAt();
      if (expiresAt) {
        setRemaining(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
      }
    } finally {
      setIsExtending(false);
    }
  };

  if (remaining === null) return null;

  const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');

  return (
    <div className="flex h-7 items-end gap-1.5">
      <span className="text-[14px] text-[#6A7282] tabular-nums">
        {h}:{m}:{s}
      </span>
      <button
        type="button"
        onClick={handleExtend}
        disabled={isExtending}
        className="text-[13px] text-[#6A7282] underline cursor-pointer disabled:opacity-50"
      >
        연장하기
      </button>
    </div>
  );
}