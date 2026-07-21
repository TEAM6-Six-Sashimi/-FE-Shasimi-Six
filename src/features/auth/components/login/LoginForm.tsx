'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { loginAction } from '../../actions';
import LoginButton from './LoginButton';
import { useToast } from '@/components/ui/ToastContext';
import { getSafeRedirect } from '@/lib/safe-redirect';

export default function LoginForm() {
  const [userIdInput, setUserIdInput] = useState('');
  const [userPasswordInput, setUserPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 중복 클릭 방지

    setErrorMessage('');

    if (!userIdInput.trim() || !userPasswordInput.trim()) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    const result = await loginAction({
      loginId: userIdInput,
      password: userPasswordInput,
    });

    if (result.success) {
      showToast(`${result.name}님 환영합니다!`);
      router.push(getSafeRedirect(searchParams.get('redirect')));
    } else {
      setErrorMessage(result.message || '서버와 연결할 수 없습니다.');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="text-[17px]">
        <label htmlFor="loginId" className="font-medium mb-2">
          아이디
        </label>
        <input
          id="loginId"
          type="text"
          placeholder="아이디를 입력하세요."
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 mb-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282]"
        />
      </fieldset>
      <fieldset className="text-[17px]">
        <label htmlFor="loginpwd" className="font-medium mb-2">
          비밀번호
        </label>
        <div className="relative">
          <input
            id="loginpwd"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요."
            value={userPasswordInput}
            onChange={(e) => setUserPasswordInput(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 mb-4 pr-11 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 -mt-2 p-1 rounded-md hover:bg-[#E5E7EB] cursor-pointer"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
          >
            <Image
              src={showPassword ? '/auth/closeeye.svg' : '/auth/openeye.svg'}
              alt=""
              width={20}
              height={20}
            />
          </button>
        </div>
      </fieldset>

      {errorMessage && (
        <p className="text-[14px] text-red-500 mb-4 font-medium pl-1">⚠ {errorMessage}</p>
      )}

      <nav className="flex justify-center items-center text-[14px] text-[#6A7282] gap-2 mb-4">
        <Link href="/auth/find-id" className="underline">
          아이디 찾기
        </Link>{' '}
        |{' '}
        <Link href="/auth/find-pwd" className="underline">
          비밀번호 찾기
        </Link>
      </nav>

      <LoginButton disabled={isSubmitting} />

      <p className="flex justify-center items-center text-[15px] gap-2">
        <span className="text-[#6A7282]">아직 회원이 아니신가요?</span>
        <Link href="/auth/signup" className="underline text-[#FF5F5F] hover:text-[#D14848]">
          회원가입
        </Link>
      </p>
    </form>
  );
}
