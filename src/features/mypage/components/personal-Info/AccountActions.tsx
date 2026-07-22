'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';
import { UserAgreements, UserMeWithAgreements } from '../../types';
import { deleteMeAction, updateMeAction } from '../../actions';
import { useMypagePassword } from '../../MypagePasswordContext';
import PasswordConfirmModal from '@/components/modals/PasswordConfirmModal';
import WithdrawAgreementModal from '@/components/modals/WithdrawAgreementModal';

interface AccountActionsProps {
  user: UserMeWithAgreements;
  agreements: UserAgreements;
}

type ModalMode = 'edit' | 'withdrawAgreement' | 'withdrawPassword' | null;

export default function AccountActions({ user, agreements }: AccountActionsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { setVerifiedPassword } = useMypagePassword();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // 수정하기 클릭 → 비밀번호 입력 → 검증 전용 API가 없음
  // PATCH /users/me를 "현재 값 그대로" 호출해 currentPassword만 검증 용도로 사용
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
      setVerifiedPassword(password);
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
      showToast('성공적으로 탈퇴가 완료되었습니다. 안녕히 가세요.');
      setModalMode(null);
      router.push('/');
      router.refresh();
    } else {
      setPasswordError(result.message);
    }
    setLoading(false);
  };

  return (
    <>
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

      {/* 수정하기 비밀번호 확인 모달 */}
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

      {/* 탈퇴 2단계: 본인 확인 모달 */}
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
    </>
  );
}
