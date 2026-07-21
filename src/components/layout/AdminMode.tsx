'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function AdminModeToggle() {
  const pathname = usePathname();
  const isAdminMode = pathname.startsWith('/admin');

  return (
    <Link
      href={isAdminMode ? '/' : '/admin'}
      className="flex items-center text-[15px] font-medium justify-center bg-[#CFEE5D] hover:bg-[#A8D014] h-8 px-2 sm:w-30 rounded-sm gap-1 shrink-0"
    >
      <Image
        src="/header/admin.svg"
        width={17}
        height={17}
        alt="관리자 모드"
        className="shrink-0"
      />
      <span className="hidden sm:inline">관리자 모드</span>
    </Link>
  );
}
