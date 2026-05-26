import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex flex-col justify-between items-center w-full min-h-[calc(100vh-48px)] py-16 px-4 bg-[#F9FAFB]">
            <div className="bg-white w-full max-w-lg rounded-2xl p-10 shadow-md">
                <div className="text-[29px] font-bold text-center mb-7">로그인</div>
                <div className="text-[17px]">
                    <p className="font-medium mb-2">아이디</p>
                    <input
                        type="text" placeholder="아이디를 입력하세요."
                        className="w-full px-4 py-2.5 mb-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282]"/>
                </div>
                <div className="text-[17px]">
                    <p className="font-medium mb-2">비밀번호</p>
                    <input
                        type="password" placeholder="비밀번호를 입력하세요."
                        className="w-full px-4 py-2.5 mb-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282]"/>
                </div>
                <div className="flex justify-center items-center text-[14px] text-[#6A7282] gap-2 mb-4">
                    <p className="underline">아이디 찾기</p> | <p className="underline">비밀번호 찾기</p>
                </div>
                <button className="w-full py-3 text-[19px] rounded-lg bg-[#FF5F5F] hover:bg-[#D14848] text-white font-semibold cursor-pointer mb-2">로그인</button>
                <div className="flex justify-center items-center text-[15px] gap-2">
                    <p className="text-[#6A7282]">아직 회원이 아니신가요?</p>
                    <Link href="/auth/signup" className="underline text-[#FF5F5F] hover:text-[#D14848]">회원가입</Link>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center text-[15px] text-[#6A7282]">
                <div className="mb-1">© 2026 온라인 강의 플랫폼 (주)핏격. All rights reserved.</div>
                <div>이용약관 | 개인정보처리방침 | 사업자정보</div>
            </div>
        </div>
    );
}