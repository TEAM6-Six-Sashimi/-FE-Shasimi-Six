'use client'

import { useFormStatus } from 'react-dom';

export default function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-3 text-[19px] rounded-lg text-white font-semibold mb-2 transition-all ${
        pending
          ? "bg-gray-400 cursor-not-allowed opacity-70"
          : "bg-[#FF5F5F] hover:bg-[#D14848] cursor-pointer active:scale-[0.99]"
      }`}>
      {pending ? "로그인 중..." : "로그인"}
    </button>
  );
}