import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { fetchUserMe, GUEST_USER } from "@/services/user.service";
import HeaderDropdown from "./HeaderDropdown";

export default async function Header() {

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    console.log('=== Header 렌더링 ===');
    console.log('accessToken 존재:', !!accessToken);

    const user = accessToken ? await fetchUserMe(accessToken) : GUEST_USER;

    console.log('user.role:', user.role);

    return (
        <div
            className="flex justify-between bg-white border-b border-[#E5E7EB] h-12 items-center p-5"
        >
            <Link href="/">
                <div className="bg-[#CFEE5D] h-9 w-30 rounded"/>
            </Link>
            
            {user.role === 'GUEST' ? (
                <div className="flex gap-2 items-center">
                    <Link href="/auth/login" className="text-[14px] font-semibold">로그인</Link>
                    <div className="text-[15px]">/</div>
                    <Link href="/auth/signup" className="bg-[#CFEE5D] hover:bg-[#A8D014] text-[14px] font-semibold px-3.5 py-1.5 flex items-center justify-center rounded-sm">
                        <div>회원가입</div>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-1 justify-end">
                    {user.role === "STUDENT" && (
                        <div className="flex items-center gap-3">
                            <Link href="/credit" className="flex text-[15px] font-medium gap-1">
                                <Image src="/header/credit.svg" width={17} height={17} alt=""/> 크레딧 충전
                            </Link>
                            <Link href="/cart">
                                <Image src="/header/cart.svg" width={17} height={17} alt=""/>
                            </Link>
                            <Link href="/alarm">
                                <Image src="/header/bell.svg" width={17} height={17} alt=""/>
                            </Link>
                            <HeaderDropdown user={user} />
                        </div>
                    )}

                    {user.role === "INSTRUCTOR" && (
                        <div className="flex items-center gap-2.5">
                            <Link href="/credit" className="flex text-[15px] font-medium gap-1">
                                <Image src="/header/credit.svg" width={17} height={17} alt=""/> 크레딧 충전
                            </Link>
                            <Link href="/cart">
                                <Image src="/header/cart.svg" width={17} height={17} alt=""/>
                            </Link>
                            <Link href="/alarm">
                                <Image src="/header/bell.svg" width={17} height={17} alt=""/>
                            </Link>
                            <HeaderDropdown user={user} />
                        </div>
                    )}

                    {user.role === "ADMIN" && (
                        <div className="flex items-center gap-2.5">
                            <Link href="/admin" className="flex items-center text-[15px] font-medium justify-center bg-[#CFEE5D] h-8 w-30 rounded-sm gap-1">
                                <Image src="header/admin.svg" width={17} height={17} alt=""/>
                                관리자 모드
                            </Link>
                            <Link href="/credit" className="flex text-[15px] font-medium gap-1">
                                <Image src="/header/credit.svg" width={17} height={17} alt=""/> 크레딧 충전
                            </Link>
                            <Link href="/cart">
                                <Image src="/header/cart.svg" width={17} height={17} alt=""/>
                            </Link>
                            <Link href="/alarm">
                                <Image src="/header/bell.svg" width={17} height={17} alt=""/>
                                {/* 알림 드롭다운 */}
                            </Link>
                            <HeaderDropdown user={user} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}