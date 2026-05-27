'use client';

import { useEffect, useState } from 'react';
import { getMyInfo } from '@/services/user.service';
import type { UserResponseDto } from '@/features/user/myinfo/types';
import ProfileEditCard from '@/features/user/myinfo/components/ProfileEditCard';

export default function MyInfoEditPage() {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const data = await getMyInfo();
        if (aborted) return;
        setUser(data);
      } catch (err: any) {
        if (aborted) return;
        setLoadError(err.message || '내 정보를 불러오지 못했습니다.');
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-5">개인정보 수정</h1>

      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8 text-center text-[13px] text-[#6A7282]">
          내 정보를 불러오는 중...
        </div>
      )}

      {!loading && loadError && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl px-4 py-3 text-[13px] text-[#DC2626] font-medium">
          {loadError}
        </div>
      )}

      {user && <ProfileEditCard user={user} />}
    </div>
  );
}
