import { Button } from '@/components/ui/button';

export default function LoginButton() {
  return (
    <Button
      type="submit"
      className="w-full py-3 h-auto text-[19px] rounded-lg text-white font-semibold mb-2 transition-all bg-[#FF5F5F] hover:bg-[#D14848] active:scale-[0.99]"
    >
      로그인
    </Button>
  );
}
