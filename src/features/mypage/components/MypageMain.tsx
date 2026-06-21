'use client';

import { UserMe } from '@/features/auth/types';
import { useToast } from '@/components/ui/ToastContext';

interface MypageMainProps {
  user: UserMe;
}

// 동의 여부 - mock 데이터
const MOCK_AGREEMENTS = {
  privacy: true,
  marketing: true,
  emailNotice: false,
  aiUsage: true,
};

const AGREEMENT_ROWS: { key: keyof typeof MOCK_AGREEMENTS; label: string }[] = [
  { key: 'privacy', label: '개인정보 수집 및 이용' },
  { key: 'marketing', label: '마케팅 수신' },
  { key: 'emailNotice', label: '이메일 수신' },
  { key: 'aiUsage', label: 'AI 사용' },
];

// 가입일 없음
const joinedAt = '-';

export default function MypageMain({ user }: MypageMainProps) {
  const { showToast } = useToast();

  const handleCopyReferralCode = async () => {
    if (!user.referralCode) return;
    try {
      await navigator.clipboard.writeText(user.referralCode);
      showToast('추천인 코드가 복사되었습니다.');
    } catch {
      showToast('복사에 실패했습니다.', 'negative');
    }
  };

  return (
    <div>
      {/* 상단 프로필 */}
      <div className="pb-5 border-b border-[#E5E7EB] mb-5">
        <p className="text-[18px] font-bold text-[#1E2125]">{user.name}</p>
        <p className="text-[14px] font-light text-[#6A7282]">{user.email}</p>
      </div>
    {/* 기본 정보 2열 */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6">
        <InfoRow label="이름" value={user.name} />
        <InfoRow label="아이디" value={user.loginId} />
        <InfoRow label="생년월일" value={user.birthDate} />
        <InfoRow label="가입일" value={joinedAt} />
        <InfoRow label="전화번호" value="-" />   {/* 전화번호 응답 필드에 없음 */}
        <InfoRow label="이메일" value={user.email} />
 
        {/* 추천인 코드 */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#6A7282] font-semibold">추천인 코드</span>
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-semibold text-[#FF5E5E]">
              {user.referralCode || '-'}
            </span>
            <button
              type="button"
              onClick={handleCopyReferralCode}
              className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#6A7282] border border-[#D1D5DB] rounded-md hover:bg-[#F9FAFB] cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              복사
            </button>
          </div>
        </div>
      </div>
 
      {/* 동의 여부 */}
      <div className="pt-5 mb-10 border-t border-[#E5E7EB]">
        <p className="text-[13px] text-[#9CA3AF] mb-3">동의 여부</p>
        <div className="flex flex-col gap-3.5">
          {AGREEMENT_ROWS.map(({ key, label }) => {
            const agreed = MOCK_AGREEMENTS[key]; // 추후 user.agreements?.[key]로 교체
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[14px] text-[#6A7282] font-semibold">{label}</span>
                <span
                  className={`text-[13px] font-semibold ${
                    agreed ? 'text-[#FF5E5E]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {agreed ? '동의' : '미동의'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
 

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          className="text-[13px] text-[#9CA3AF] underline cursor-pointer hover:text-[#6A7282]"
          // TODO: 탈퇴 기능 연동
        >
          탈퇴하기
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-[#FF5E5E] text-white text-[12px] font-semibold hover:bg-[#D14848] cursor-pointer"
          // TODO: 수정 기능 연동
        >
          수정하기
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[#6A7282] font-semibold">{label}</span>
      <span className="text-[14px] font-medium text-[#1E2125]">{value}</span>
    </div>
  );
}