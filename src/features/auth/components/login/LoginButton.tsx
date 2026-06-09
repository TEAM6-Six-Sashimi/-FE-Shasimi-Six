'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

export default function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`w-full py-3 h-auto text-[19px] rounded-lg text-white font-semibold mb-2 transition-all ${
        pending
          ? 'bg-gray-400 cursor-not-allowed opacity-70'
          : 'bg-[#FF5F5F] hover:bg-[#D14848] active:scale-[0.99]'
      }`}
    >
      {pending ? '로그인 중...' : '로그인'}
    </Button>
  );
}