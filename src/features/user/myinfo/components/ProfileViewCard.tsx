'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { withdrawUser } from '@/services/user.service';
import type { UserResponseDto } from '@/features/user/myinfo/types';

interface ProfileViewCardProps {
  user: UserResponseDto;
}

const ROW = 'flex items-center py-3.5 border-b border-[#F3F4F6] last:border-b-0';
const LABEL = 'w-32 text-[13px] font-semibold text-[#6A7282] shrink-0';
const VALUE = 'text-[13.5px] text-[#1E2125]';

export default function ProfileViewCard({ user }: ProfileViewCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyRef = async () => {
    if (!user.referralCode) return;
    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard 미지원 무시 */
    }
  };

  const handleWithdraw = async () => {
    const pw = window.prompt(
      '회원 탈퇴를 진행합니다.\n본인 확인을 위해 현재 비밀번호를 입력해 주세요.',
    );
    if (!pw) return;
    const ok = window.confirm('정말 탈퇴하시겠어요?\n유예 기간 이후 개인정보가 익명화됩니다.');
    if (!ok) return;
    try {
      await withdrawUser({ currentPassword: pw });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      alert('탈퇴 요청이 완료되었습니다.');
      router.push('/');
    } catch (err: any) {
      alert(err.message || '탈퇴에 실패했습니다.');
    }
  };

  const initial = user.name?.[0] ?? '?';

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-7">
      {/* 상단: 아바타 + 이름 + 아이디 */}
      <div className="flex items-center gap-5 pb-6 border-b border-[#F3F4F6]">
        <div className="w-20 h-20 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[26px] text-[#9CA3AF] font-semibold shrink-0">
          {initial}
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-[#1E2125]">{user.name}</h2>
          <p className="text-[13px] text-[#6A7282] mt-0.5">{user.loginId}</p>
        </div>
      </div>

      {/* 정보 테이블 */}
      <div className="pt-2">
        <Row label="이름" value={user.name} />
        <Row label="생년월일" value={user.birthDate || '-'} />
        <Row label="이메일" value={user.email} />
        <Row label="아이디" value={user.loginId} />
        {user.referralCode && (
          <div className={ROW}>
            <span className={LABEL}>추천인 코드</span>
            <span className="inline-flex items-center gap-2">
              <span className="text-[13.5px] font-bold text-[#FF5F5F] tracking-wider">
                {user.referralCode}
              </span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#D1D5DB] text-[11.5px] text-[#1E2125] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
              >
                📋 {copied ? '복사됨' : '복사'}
              </button>
            </span>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between pt-6 mt-2 border-t border-[#F3F4F6]">
        <button
          type="button"
          onClick={handleWithdraw}
          className="text-[12.5px] text-[#9CA3AF] hover:text-[#DC2626] underline underline-offset-2 cursor-pointer transition-colors"
        >
          회원 탈퇴하기
        </button>
        <button
          type="button"
          onClick={() => router.push('/mypage/edit')}
          className="px-5 h-10 rounded-lg bg-[#FF5F5F] hover:bg-[#D14848] text-white font-semibold text-[13.5px] cursor-pointer transition-colors"
        >
          수정하기
        </button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={ROW}>
      <span className={LABEL}>{label}</span>
      <span className={VALUE}>{value}</span>
    </div>
  );
}
