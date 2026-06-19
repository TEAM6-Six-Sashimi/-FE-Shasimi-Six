'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../../actions';
import LoginButton from './LoginButton';

export default function LoginForm() {
  const router = useRouter();

  const [userIdInput, setUserIdInput] = useState('');
  const [userPasswordInput, setUserPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userIdInput.trim() || !userPasswordInput.trim()) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const { name } = await loginAction({
        loginId: userIdInput,
        password: userPasswordInput,
      });

      window.location.href = '/';
    } catch (error: any) {
      setErrorMessage(error.message || '서버와 연결할 수 없습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-[17px]">
        <p className="font-medium mb-2">아이디</p>
        <input
          type="text"
          placeholder="아이디를 입력하세요."
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
          className="w-full px-4 py-2.5 mb-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282]"
        />
      </div>
      <div className="text-[17px]">
        <p className="font-medium mb-2">비밀번호</p>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요."
          value={userPasswordInput}
          onChange={(e) => setUserPasswordInput(e.target.value)}
          className="w-full px-4 py-2.5 mb-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282]"
        />
      </div>

      {errorMessage && (
        <div className="text-[14px] text-red-500 mb-4 font-medium pl-1">⚠ {errorMessage}</div>
      )}

      <div className="flex justify-center items-center text-[14px] text-[#6A7282] gap-2 mb-4">
        <p className="underline">아이디 찾기</p> | <p className="underline">비밀번호 찾기</p>
      </div>
      <LoginButton />
      <div className="flex justify-center items-center text-[15px] gap-2">
        <p className="text-[#6A7282]">아직 회원이 아니신가요?</p>
        <Link href="/auth/signup" className="underline text-[#FF5F5F] hover:text-[#D14848]">
          회원가입
        </Link>
      </div>
    </form>
  );
}
