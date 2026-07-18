import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { fetchUserMe, GUEST_USER } from '@/services/user.service';
import HeaderDropdown from '../../features/header/components/HeaderDropdown';
import HeaderCartLink from '../../features/header/components/HeaderCartComponent';
import AdminModeToggle from './AdminMode';
import TokenTimer from './TokenTimer';

export default async function Header() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const user = accessToken ? await fetchUserMe(accessToken) : GUEST_USER;

  return (
    <div className="flex justify-between bg-white border-b border-[#E5E7EB] h-12 items-center p-5">
      <Link href="/">
        <Image
          src="/header/FitGyeok-logo.png"
          alt="FitGyeok 로고"
          width={95}
          height={40}
          className="object-contain"
        />
      </Link>
      {user.role !== 'GUEST' && <TokenTimer />}

      {user.role === 'GUEST' ? (
        <div className="flex gap-2 items-center">
          <Link href="/auth/login" className="text-[14px] font-semibold">
            로그인
          </Link>
          <div className="text-[15px]">/</div>
          <Link
            href="/auth/signup"
            className="bg-[#CFEE5D] hover:bg-[#A8D014] text-[14px] font-semibold px-3.5 py-1.5 flex items-center justify-center rounded-sm"
          >
            <div>회원가입</div>
          </Link>
        </div>
      ) : (
        <div className="flex flex-1 justify-end">
          {user.role === 'STUDENT' && (
            <div className="flex items-center gap-2">
              <Link href="/credit" className="flex text-[15px] font-medium gap-1 items-center h-8 px-2 rounded-md transition-colors duration-200 hover:bg-[#E5E7EB]">
                <Image src="/header/credit.svg" width={17} height={17} alt="크레딧 충전" />
                <span className="hidden sm:inline">크레딧 충전</span>
              </Link>
              <HeaderCartLink accessToken={accessToken} />
              <HeaderDropdown user={user} />
            </div>
          )}

          {user.role === 'INSTRUCTOR' && (
            <div className="flex items-center gap-2">
              <Link href="/credit" className="flex text-[15px] font-medium gap-1 items-center h-8 px-2 rounded-md transition-colors duration-200 hover:bg-[#E5E7EB]">
                <Image src="/header/credit.svg" width={17} height={17} alt="크레딧 충전" />
                <span className="hidden sm:inline">크레딧 충전</span>
              </Link>
              <HeaderCartLink accessToken={accessToken} />
              <HeaderDropdown user={user} />
            </div>
          )}

          {user.role === 'ADMIN' && (
            <div className="flex items-center gap-2">
              <AdminModeToggle />
              <Link href="/credit" className="flex text-[15px] font-medium gap-1 items-center h-8 px-2 rounded-md transition-colors duration-200 hover:bg-[#E5E7EB]">
                <Image src="/header/credit.svg" width={17} height={17} alt="크레딧 충전" />
                <span className="hidden sm:inline">크레딧 충전</span>
              </Link>
              <HeaderCartLink accessToken={accessToken} />
              <HeaderDropdown user={user} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
