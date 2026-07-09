import FindPasswordForm from '@/features/auth/components/find-pwd/FindPasswordForm';

export default function FindPwdPage() {
  return (
    <section className="flex flex-col justify-between items-center w-full min-h-[calc(100vh-48px)] py-16 px-4 bg-[#F9FAFB]">
      <article className="bg-white w-full max-w-lg rounded-2xl p-10 shadow-md">
        <h1 className="text-[29px] font-bold text-center mb-10">비밀번호 찾기</h1>
        <FindPasswordForm />
      </article>

      <footer className="flex flex-col justify-center items-center text-[13px] text-[#6A7282]">
        <p className="mb-1">© 2026 온라인 강의 플랫폼 (주)핏격. All rights reserved.</p>
        <p className="mb-1">이용약관 | 개인정보처리방침 | 사업자정보</p>
        <p>관리자 문의 메일: fitgyeok_ask@gmail.com</p>
      </footer>
    </section>
  );
}
