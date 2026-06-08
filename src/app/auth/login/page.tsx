import LoginForm from '@/features/auth/components/login/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-between items-center w-full min-h-[calc(100vh-48px)] py-16 px-4 bg-[#F9FAFB]">
      <div className="bg-white w-full max-w-lg rounded-2xl p-10 shadow-md">
        <div className="text-[29px] font-bold text-center mb-7">로그인</div>
        <LoginForm />
      </div>
      <div className="flex flex-col justify-center items-center text-[13px] text-[#6A7282]">
        <div className="mb-1">© 2026 온라인 강의 플랫폼 (주)핏격. All rights reserved.</div>
        <div>이용약관 | 개인정보처리방침 | 사업자정보</div>
      </div>
    </div>
  );
}
