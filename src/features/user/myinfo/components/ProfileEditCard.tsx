'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendEmailVerification, verifyEmailCode } from '@/services/auth.service';
import { changePassword, updateMyInfo } from '@/services/user.service';
import type { UserResponseDto } from '@/features/user/myinfo/types';

interface ProfileEditCardProps {
  user: UserResponseDto;
}

const labelCls = 'block text-[13px] font-semibold text-[#1E2125] mb-1.5';
const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5F5F] transition-colors';
const lockedCls = `${inputCls} bg-[#F9FAFB] text-[#6A7282] cursor-not-allowed`;
const redBtn =
  'px-3.5 py-2 rounded-lg bg-[#FF5F5F] hover:bg-[#D14848] text-white font-semibold text-[12.5px] cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed';

export default function ProfileEditCard({ user }: ProfileEditCardProps) {
  const router = useRouter();
  const initial = user.name?.[0] ?? '?';

  // ─── 폼 상태 ───
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  // ─── 이메일 인증 상태 ───
  const [codeOpen, setCodeOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailMsg, setEmailMsg] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const emailChanged = email.trim() !== user.email;
  const passwordChanging = newPassword.length > 0;
  const passwordMatched = newPassword === newPasswordConfirm;

  // ─── 이메일 인증 ───
  const handleSendCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailMsg('이메일 주소를 입력해 주세요.');
      return;
    }
    try {
      setEmailMsg('인증번호 발송 중... ⏳');
      await sendEmailVerification(email.trim());
      setCodeOpen(true);
      setEmailMsg('인증번호가 메일로 발송되었습니다.');
    } catch (err: any) {
      setEmailMsg(err.message || '인증번호 발송에 실패했습니다.');
    }
  };

  const handleVerifyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setEmailMsg('인증번호를 입력해 주세요.');
      return;
    }
    try {
      const ok = await verifyEmailCode(email.trim(), verificationCode.trim());
      if (ok) {
        setEmailVerified(true);
        setEmailMsg('이메일 인증이 완료되었습니다. ✅');
      } else {
        setEmailMsg('인증번호가 일치하지 않습니다.');
      }
    } catch (err: any) {
      setEmailMsg(err.message || '인증 확인에 실패했습니다.');
    }
  };

  // ─── 저장 ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 이메일 변경 시 인증 필수
    if (emailChanged && !emailVerified) {
      setMessage({ type: 'error', text: '이메일을 변경하셨습니다. 인증을 완료해 주세요.' });
      return;
    }

    // 비번 변경 시 일치 검증
    if (passwordChanging && !passwordMatched) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    // 현재 비번 필수
    if (!currentPassword) {
      setMessage({ type: 'error', text: '본인 확인을 위해 현재 비밀번호를 입력해 주세요.' });
      return;
    }

    try {
      setSubmitting(true);

      // 1. 비번 변경 (입력했을 때만)
      if (passwordChanging) {
        await changePassword({
          currentPassword,
          newPassword,
          newPasswordConfirm,
          newPasswordMatched: passwordMatched,
        });
      }

      // 2. 기본 정보 수정 (이름은 그대로, 이메일만 바뀔 수 있음)
      await updateMyInfo({
        currentPassword: passwordChanging ? newPassword : currentPassword,
        name: user.name,
        email: email.trim(),
      });

      setMessage({ type: 'success', text: '저장되었습니다.' });

      // 비번 변경 시 재로그인 유도
      if (passwordChanging) {
        setTimeout(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          alert('비밀번호가 변경되어 다시 로그인이 필요합니다.');
          router.push('/auth/login');
        }, 1200);
      } else {
        setTimeout(() => router.push('/mypage'), 800);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '저장에 실패했습니다.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-7"
    >
      {/* 상단: 아바타 + 사진 업로드 + 잠금 필드 (이름/성별/생년월일) */}
      <div className="flex gap-6 mb-6">
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-24 h-24 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[28px] text-[#9CA3AF] font-semibold">
            {initial}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#FF5F5F] text-[#FF5F5F] text-[12px] font-semibold hover:bg-[#FFF5F5] cursor-pointer transition-colors"
            disabled
            title="사진 업로드는 백엔드 API 추가 후 활성화됩니다"
          >
            ⬆ 사진 업로드
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label className={labelCls}>이름</label>
            <input
              type="text"
              value={user.name}
              disabled
              className={lockedCls}
            />
          </div>
          <div>
            <label className={labelCls}>생년월일</label>
            <input type="text" value={user.birthDate || '-'} disabled className={lockedCls} />
          </div>
        </div>
      </div>

      {/* 이메일 + 인증 */}
      <div className="mb-4">
        <label className={labelCls}>이메일</label>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailVerified(false);
              setCodeOpen(false);
              setVerificationCode('');
              setEmailMsg('');
            }}
            disabled={emailVerified}
            className={`flex-1 ${emailVerified ? lockedCls : inputCls}`}
          />
          {emailChanged && !emailVerified && (
            <button type="button" onClick={handleSendCode} className={redBtn}>
              인증번호 발송
            </button>
          )}
        </div>
        {codeOpen && !emailVerified && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              className={inputCls}
            />
            <button type="button" onClick={handleVerifyCode} className={redBtn}>
              확인
            </button>
          </div>
        )}
        {emailMsg && (
          <p
            className={`text-[12px] mt-1.5 font-medium ${
              emailVerified ? 'text-[#15803D]' : 'text-[#DC2626]'
            }`}
          >
            {emailMsg}
          </p>
        )}
      </div>

      {/* 아이디 (잠금) */}
      <div className="mb-6">
        <label className={labelCls}>아이디</label>
        <input type="text" value={user.loginId} disabled className={lockedCls} />
      </div>

      {/* ─── 비밀번호 변경 ─── */}
      <div className="border-t border-[#F3F4F6] pt-6 mb-6">
        <h3 className="text-[15px] font-bold text-[#1E2125] mb-4">비밀번호 변경</h3>

        <div className="mb-3">
          <label className={labelCls}>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 입력 (선택사항)"
            className={inputCls}
            autoComplete="new-password"
          />
          <p className="text-[11.5px] text-[#6A7282] mt-1">
            대소문자, 숫자, 특수문자(!@#$%^_) 포함, 8자 이상 16자 이하
          </p>
        </div>

        <div>
          <label className={labelCls}>새 비밀번호 확인</label>
          <input
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            placeholder="새 비밀번호 재입력"
            className={inputCls}
            autoComplete="new-password"
          />
          {passwordChanging && newPasswordConfirm.length > 0 && (
            <p
              className={`text-[11.5px] mt-1 font-medium ${
                passwordMatched ? 'text-[#15803D]' : 'text-[#DC2626]'
              }`}
            >
              {passwordMatched ? '비밀번호가 일치합니다. ✅' : '비밀번호가 일치하지 않습니다.'}
            </p>
          )}
        </div>
      </div>

      {/* 현재 비밀번호 (보안 확인용) */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 mb-5">
        <label className={labelCls}>
          현재 비밀번호 <span className="text-[#FF5F5F]">*</span>
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="본인 확인을 위해 현재 비밀번호를 입력해 주세요"
          className={inputCls}
          autoComplete="current-password"
        />
      </div>

      {/* 메시지 */}
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-[13px] font-medium ${
            message.type === 'success'
              ? 'bg-[#F0FDF4] text-[#15803D] border border-[#86EFAC]'
              : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className={`flex-1 h-12 rounded-lg text-white font-semibold text-[14px] transition-all ${
            submitting
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#FF5F5F] hover:bg-[#D14848] cursor-pointer'
          }`}
        >
          {submitting ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/mypage')}
          disabled={submitting}
          className="flex-1 h-12 rounded-lg border border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
