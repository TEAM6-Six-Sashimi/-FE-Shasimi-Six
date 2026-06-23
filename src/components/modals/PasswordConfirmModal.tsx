'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface PasswordConfirmModalProps {
  title?: string;
  description?: string;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  loading?: boolean;
  errorMessage?: string;
}

export default function PasswordConfirmModal({
  title = '비밀번호를 입력해주세요.',
  description = '개인정보 수정을 위해 현재 비밀번호를 입력해 주세요.',
  onConfirm,
  onCancel,
  loading = false,
  errorMessage,
}: PasswordConfirmModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = () => {
    if (!password.trim()) return;
    onConfirm(password);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[19px] font-bold text-[#1E2125] mb-3">{title}</h3>
        <p className="text-[13.5px] text-[#6A7282] leading-relaxed mb-4 whitespace-pre-line">
          {description}
        </p>

        <div className="relative mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="현재 비밀번호"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirm();
            }}
            className={`w-full h-11 px-4 pr-11 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors ${
              errorMessage ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
          >
            <Image
              src={showPassword ? '/auth/openeye.svg' : '/auth/closeeye.svg'}
              alt=""
              width={20}
              height={20}
            />
          </button>
        </div>
        {errorMessage && <p className="text-[12px] text-[#FF5E5E] mb-3">{errorMessage}</p>}

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            onClick={handleConfirm}
            disabled={loading || !password.trim()}
            className="h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-50"
          >
            {loading ? '확인 중...' : '확인'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}