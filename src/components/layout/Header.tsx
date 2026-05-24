import Link from "next/link";

export default function Header() {
    return (
        <div
            className="flex bg-white border-b border-#E5E7EB/1 h-12 justify-between items-center p-5"
        >
            <Link href="/">
                <div className="bg-[#CFEE5D] h-9 w-30 rounded"/>
            </Link>

            <div className="flex gap-2 items-center">
                <Link href="/auth/login" className="text-[15px] font-semibold">로그인</Link>
                <div className="text-[15px]">/</div>
                <Link href="/auth/signup" className="bg-[#CFEE5D] text-[15px] font-semibold h-8 w-21 flex items-center justify-center rounded-sm">
                    <div>회원가입</div>
                </Link>
            </div>
        </div>
    );
}