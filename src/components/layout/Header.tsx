import Link from "next/link";
import Image from "next/image";
import { UserInfo } from "@/features/auth/types";
import HeaderDropdown from "./HeaderDropdown";

export default function Header() {

//     const mockUser: UserInfo | null = { // 로그인 안 한 상태는 null
//     id: 1,
//     name: "홍길동",
//     email: "test@fitgyuk.com",
//     role: "STUDENT", // ADMIN, STUDENT, TEACHER
//   };
    const mockUser: UserInfo | null = null;

    return (
        <div
            className="flex justify-between bg-white border-b border-[#E5E7EB] h-12 items-center p-5"
        >
            <Link href="/">
                <div className="bg-[#CFEE5D] h-9 w-30 rounded"/>
            </Link>
            
            {mockUser === null ? (
                <>
                    <div className="flex gap-2 items-center">
                        <Link href="/auth/login" className="text-[14px] font-semibold">로그인</Link>
                        <div className="text-[15px]">/</div>
                        <Link href="/auth/signup" className="bg-[#CFEE5D] hover:bg-[#A8D014] text-[14px] font-semibold px-3.5 py-1.5 flex items-center justify-center rounded-sm">
                            <div>회원가입</div>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="flex flex-1 justify-end">
                    {mockUser.role === "STUDENT" && (
                        <div className="flex items-center gap-3">
                            <Link href="/payments" className="flex text-[15px] font-medium gap-1">
                                <Image src="/header/credit.svg" width={17} height={17} alt=""/> 크레딧 충전
                            </Link>
                            <Link href="/cart">
                                <Image src="/header/cart.svg" width={17} height={17} alt=""/>
                            </Link>
                            <Link href="/alarm">
                                <Image src="/header/bell.svg" width={17} height={17} alt=""/>
                            </Link>
                            <HeaderDropdown user={mockUser} />
                        </div>
                    )}

                    {mockUser.role === "TEACHER" && (
                        <div className="flex items-center gap-2.5">
                            <Link href="/payments" className="flex text-[15px] font-medium gap-1">
                                <Image src="/header/credit.svg" width={17} height={17} alt=""/> 크레딧 충전
                            </Link>
                            <Link href="/cart">
                                <Image src="/header/cart.svg" width={17} height={17} alt=""/>
                            </Link>
                            <Link href="/alarm">
                                <Image src="/header/bell.svg" width={17} height={17} alt=""/>
                            </Link>
                            <HeaderDropdown user={mockUser} />
                        </div>
                    )}

                    {mockUser.role === "ADMIN" && (
                        <div className="flex items-center gap-2.5">
                            <Link href="/admin/dashboard" className="flex items-center text-[15px] font-medium justify-center bg-[#CFEE5D] h-8 w-30 rounded-sm gap-1">
                                <Image src="header/admin.svg" width={17} height={17} alt=""/>
                                관리자 모드
                            </Link>
                            <Link href="/payments" className="flex text-[15px] font-medium gap-1">
                                <Image src="/header/credit.svg" width={17} height={17} alt=""/> 크레딧 충전
                            </Link>
                            <Link href="/cart">
                                <Image src="/header/cart.svg" width={17} height={17} alt=""/>
                            </Link>
                            <Link href="/alarm">
                                <Image src="/header/bell.svg" width={17} height={17} alt=""/>
                                {/* 알림 드롭다운 */}
                            </Link>
                            <HeaderDropdown user={mockUser} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}