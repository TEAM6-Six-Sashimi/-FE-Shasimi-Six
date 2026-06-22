'use client';

import { useState, useEffect } from 'react';
import { reissueAction } from '@/features/auth/actions';

export default function TokenTimer() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isExtending, setIsExtending] = useState(false);

  const getExpiresAt = (): number | null => {
    const match = document.cookie.match(/accessTokenExpiresAt=(\d+)/);
    return match ? Number(match[1]) : null;
  };

  useEffect(() => {
    const tick = () => {
      const expiresAt = getExpiresAt();
      if (!expiresAt) {
        setRemaining(null);
        return;
      }
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemaining(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // 연장하기 클릭
  const handleExtend = async () => {
    setIsExtending(true);
    try {
      const result = await reissueAction();
      if (!result.success) {
        // 재발급 실패 시 홈으로
        window.location.href = '/';
        return;
      }
      // 성공 시 새 만료 시각을 즉시 반영
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