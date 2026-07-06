'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserMeWithAgreements } from '../types';
import { useToast } from '@/components/ui/ToastContext';
import Image from 'next/image';
import { deleteMeAction, updateMeAction } from '../actions';
import PasswordConfirmModal from '@/components/modals/PasswordConfirmModal';
import WithdrawAgreementModal from '@/components/modals/WithdrawAgreementModal';

interface MypageMainProps {
  user: UserMeWithAgreements;
}

const AGREEMENT_ROWS: {
  key: keyof NonNullable<UserMeWithAgreements['agreements']>;
  label: string;
}[] = [
  { key: 'marketing', label: '마케팅 수신' },
  { key: 'emailNotice', label: '이메일 수신' },
  { key: 'aiUsage', label: 'AI 사용' },
];

type ModalMode = 'edit' | 'withdrawAgreement' | 'withdrawPassword' | null;

export default function MypageMain({ user }: MypageMainProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const agreements = user.agreements ?? {
    privacy: true,
    marketing: false,
    emailNotice: false,
    aiUsage: false,
  };

  const handleCopyReferralCode = async () => {
    if (!user.referralCode) return;
    try {
      await navigator.clipboard.writeText(user.referralCode);
      showToast('추천인 코드가 복사되었습니다.');
    } catch {
      showToast('복사에 실패했습니다.', 'negative');
    }
  };

  // 수정하기 클릭 → 비밀번호 입력 → 검증 전용 API가 없으므로
  // PATCH /users/me를 "현재 값 그대로" 호출해 currentPassword만 검증 용도로 사용.
  // 틀리면 서버가 에러를 던지므로 이 모달에서 바로 에러를 보여주고 다음 페이지로 넘어가지 않음.
  const handleEditPasswordConfirm = async (password: string) => {
    setPasswordError('');
    setLoading(true);

    const result = await updateMeAction({
      currentPassword: password,
      phone: user.phone,
      marketingConsent: agreements.marketing,
      emailConsent: agreements.emailNotice,
      aiConsent: agreements.aiUsage,
    });

    if (result.success) {
      sessionStorage.setItem('mypage_current_password', password);
      setModalMode(null);
      router.push('/mypage/edit');
    } else {
      setPasswordError('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
    }
    setLoading(false);
  };

  // 탈퇴하기 클릭 → 1단계: 동의 모달
  const handleWithdrawClick = () => {
    setModalMode('withdrawAgreement');
  };

  // 1단계 동의 → 2단계: 본인 확인(비밀번호) 모달
  const handleWithdrawAgreementConfirmed = () => {
    setPasswordError('');
    setModalMode('withdrawPassword');
  };

  // 2단계 비밀번호 확인 → 즉시 deleteMeAction 호출, 틀리면 이 모달에서 바로 에러
  const handleWithdrawPasswordConfirm = async (password: string) => {
    setPasswordError('');
    setLoading(true);

    const result = await deleteMeAction(password);

    if (result.success) {
      showToast('성공적으로 탈퇴 되었습니다. 안녕히 가세요.');
      setModalMode(null);
      router.push('/');
    } else {
      setPasswordError(result.message);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* 상단 프로필 */}
      <div className="pb-5 border-b border-[#E5E7EB]">
        <p className="text-[18px] font-bold text-[#1E2125]">{user.name}</p>
      </div>

      {/* 기본 정보 2열 - 각 행마다 구분선 */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-x-10">
        <InfoRow label="이름" value={user.name} />
        <InfoRow label="아이디" value={user.loginId} />
        <InfoRow label="생년월일" value={user.birthDate} />
        <InfoRow label="가입일" value={user.createdAt.slice(0, 10)} />
        <InfoRow label="전화번호" value={user.phone} />
        <InfoRow label="이메일" value={user.email} />
        <div className="flex items-center gap-6 py-3.5 col-span-2">
          <span className="w-20 shrink-0 text-[14px] text-[#6A7282] font-semibold">
            추천인 코드
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-semibold text-[#FF5E5E]">
              {user.referralCode || '-'}
            </span>
            <button
              type="button"
              onClick={handleCopyReferralCode}
              className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#6A7282] border border-[#D1D5DB] rounded-md hover:bg-[#F9FAFB] cursor-pointer"
            >
              <Image src="/copy-Icon.svg" alt="" width={11} height={11} />
              복사
            </button>
          </div>
        </div>
      </div>

      {/* 동의 여부 */}
      <div className="pt-5 mb-4 border-t border-[#E5E7EB]">
        <p className="text-[13px] text-[#9CA3AF] mb-3">동의 여부</p>
        <div className="flex flex-col col-span-1 gap-x-10">
          {/* 필수 항목 - 항상 동의 상태, 변경 불가 (하드코딩) */}
          <div className="flex items-center justify-between py-3.5 border-b border-[#F3F4F6]">
            <span className="text-[14px] text-[#6A7282] font-semibold">
              개인정보 수집 및 이용 (필수)
            </span>
            <span className="text-[13px] font-semibold text-[#FF5E5E]">동의</span>
          </div>

          {AGREEMENT_ROWS.map(({ key, label }, idx) => {
            const agreed = agreements[key];
            const isLast = idx === AGREEMENT_ROWS.length - 1;
            return (
              <div
                key={key}
                className={`flex items-center justify-between py-3.5 ${
                  isLast ? '' : 'border-b border-[#F3F4F6]'
                }`}
              >
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
          onClick={handleWithdrawClick}
          className="text-[13px] text-[#9CA3AF] underline cursor-pointer hover:text-[#6A7282]"
        >
          탈퇴하기
        </button>
        <button
          type="button"
          onClick={() => {
            setPasswordError('');
            setModalMode('edit');
          }}
          className="px-4 py-2 rounded-lg bg-[#FF5E5E] text-white text-[12px] font-semibold hover:bg-[#D14848] cursor-pointer"
        >
          수정하기
        </button>
      </div>

      {/* 수정하기 비밀번호 확인 모달 (여기서 즉시 검증, 틀리면 바로 에러) */}
      {modalMode === 'edit' && (
        <PasswordConfirmModal
          title="비밀번호를 입력해주세요."
          description="개인정보 수정을 위해 현재 비밀번호를 입력해 주세요."
          onConfirm={handleEditPasswordConfirm}
          onCancel={() => setModalMode(null)}
          loading={loading}
          errorMessage={passwordError}
        />
      )}

      {/* 탈퇴 1단계: 동의 모달 */}
      {modalMode === 'withdrawAgreement' && (
        <WithdrawAgreementModal
          onConfirm={handleWithdrawAgreementConfirmed}
          onCancel={() => setModalMode(null)}
        />
      )}

      {/* 탈퇴 2단계: 본인 확인 모달 (여기서 즉시 검증, 틀리면 바로 에러) */}
      {modalMode === 'withdrawPassword' && (
        <PasswordConfirmModal
          title="본인 확인"
          description={`회원 탈퇴를 위한 비밀번호를 입력하세요.\n비밀번호 확인이 완료되면 최종 탈퇴됩니다.`}
          onConfirm={handleWithdrawPasswordConfirm}
          onCancel={() => setModalMode(null)}
          loading={loading}
          errorMessage={passwordError}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-6 py-3.5 border-b border-[#F3F4F6]">
      <span className="w-20 shrink-0 text-[14px] text-[#6A7282] font-semibold">{label}</span>
      <span className="text-[14px] font-medium text-[#1E2125]">{value}</span>
    </div>
  );
}
