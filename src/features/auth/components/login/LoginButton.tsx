import { Button } from '@/components/ui/button';

interface LoginButtonProps {
  disabled?: boolean;
}

export default function LoginButton({ disabled = false }: LoginButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className={`w-full py-3 h-auto text-[19px] rounded-lg text-white font-semibold mb-2 transition-all ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed opacity-70'
          : 'bg-[#FF5F5F] hover:bg-[#D14848] active:scale-[0.99]'
      }`}
    >
      {disabled ? '로그인 중...' : '로그인'}
    </Button>
  );
}