'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UserMeWithAgreements } from '@/features/mypage/types';
import { changePasswordAction, updateMeAction } from '@/features/mypage/actions';

interface Props {
  user: UserMeWithAgreements;
}

export default function PersonalInfoEditPage({ user }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const agreements = user.agreements ?? {
    privacy: true,
    marketing: false,
    emailNotice: false,
    aiUsage: false,
  };
  const [marketing, setMarketing] = useState(agreements.marketing);
  const [emailNotice, setEmailNotice] = useState(agreements.emailNotice);
  const [aiUsage, setAiUsage] = useState(agreements.aiUsage);

  const [loading, setLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // 개인정보 조회 페이지에서 확인한 현재 비밀번호를 가져옴. 없으면 다시 조회 페이지로
  useEffect(() => {
    const stored = sessionStorage.getItem('mypage_current_password');
    if (!stored) {
      router.replace('/mypage');
      return;
    }
    setCurrentPassword(stored);
  }, [router]);

  const handleCancel = () => {
    sessionStorage.removeItem('mypage_current_password');
    router.push('/mypage');
  };

  const handleSave = async () => {
    if (!currentPassword) return;

    if (newPassword && newPassword !== newPasswordConfirm) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);

    try {
      setLoading(true);

      // 동의 항목 + 이름/이메일(변경 없음, 기존 값 그대로) 수정
      await updateMeAction({
        currentPassword,
        name: user.name,
        email: user.email,
        marketingConsent: marketing,
        emailConsent: emailNotice,
        aiConsent: aiUsage,
      });

      // 새 비밀번호를 입력했으면 비밀번호도 변경
      if (newPassword) {
        await changePasswordAction({
          currentPassword,
          newPassword,
          newPasswordConfirm,
        });
      }

      showToast('개인정보가 수정되었습니다.');
      sessionStorage.removeItem('mypage_current_password');
      router.push('/mypage');
    } catch {
      showToast('수정에 실패했습니다.', 'negative');
    } finally {
      setLoading(false);
    }
  };

  if (currentPassword === null) {
    return null; // 비밀번호 확인 안 된 상태 → useEffect에서 리다이렉트 처리 중
  }

  return (
    <div>
      {/* 상단 프로필 */}
      <div className="pb-5 border-b border-[#E5E7EB]">
        <p className="text-[18px] font-bold text-[#1E2125]">{user.name}</p>
        <p className="text-[14px] font-light text-[#6A7282]">{user.email}</p>
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-2 gap-x-10 pt-2">
        <InfoRow label="이름" value={user.name} />
        <InfoRow label="아이디" value={user.loginId} />
        <InfoRow label="생년월일" value={user.birthDate} />
        <InfoRow label="가입일" value="-" />
        <div className="flex items-center gap-6 py-3.5 border-b border-[#F3F4F6]">
          <span className="w-20 shrink-0 text-[14px] text-[#6A7282] font-semibold">전화번호</span>
          <input
            type="text"
            value="010-1234-5678"
            disabled
            className="flex-1 h-9 px-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[13.5px] text-[#9CA3AF] cursor-not-allowed"
          />
        </div>
        <InfoRow label="이메일" value={user.email} />
        <div className="flex items-center gap-6 py-3.5 col-span-2">
          <span className="w-20 shrink-0 text-[14px] text-[#6A7282] font-semibold">
            추천인 코드
          </span>
          <span className="text-[13.5px] font-semibold text-[#FF5E5E]">
            {user.referralCode || '-'}
          </span>
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div className="pt-5 border-t border-[#E5E7EB]">
        <p className="text-[14px] font-semibold text-[#1E2125] mb-1">
          비밀번호 변경 <span className="text-[12px] text-[#9CA3AF] font-normal">(선택)</span>
        </p>
        <div className="flex flex-col gap-3 mt-3">
          <div>
            <label className="block text-[12.5px] text-[#6A7282] mb-1.5">새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="대소문자+숫자+특수문자(!@#$%^_), 8~16자"
              className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[12.5px] text-[#6A7282] mb-1.5">새 비밀번호 확인</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="새 비밀번호 확인"
                className={`w-full h-11 px-4 pr-11 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors ${
                  passwordMismatch ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6A7282]"
              >
                👁
              </button>
            </div>
            {passwordMismatch && (
              <p className="text-[12px] text-[#FF5E5E] mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* 동의 여부 */}
      <div className="pt-5 mt-5 border-t border-[#E5E7EB]">
        <p className="text-[14px] font-semibold text-[#1E2125] mb-3">동의 여부</p>

        {/* 필수 항목 - 항상 동의 상태, 변경 불가 (하드코딩) */}
        <div className="flex items-center justify-between py-3 border-b border-[#F3F4F6]">
          <div>
            <p className="text-[14px] font-semibold text-[#1E2125]">개인정보 수집 및 이용</p>
            <p className="text-[11.5px] text-[#9CA3AF]">필수 항목 (변경 불가)</p>
          </div>
          <span className="text-[13px] font-semibold text-[#FF5E5E]">동의</span>
        </div>

        <ToggleRow label="마케팅 수신" checked={marketing} onChange={setMarketing} />
        <ToggleRow label="이메일 수신" checked={emailNotice} onChange={setEmailNotice} />
        <ToggleRow label="AI 사용" checked={aiUsage} onChange={setAiUsage} />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
        >
          취소
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex-1 h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-50"
        >
          {loading ? '저장 중...' : '저장하기'}
        </Button>
      </div>
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

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-b-0">
      <span className="text-[14px] font-semibold text-[#1E2125]">{label}</span>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-[#FF5E5E]"
      />
    </div>
  );
}