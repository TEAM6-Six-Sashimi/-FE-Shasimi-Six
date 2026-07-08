import Link from 'next/link';
import Image from 'next/image';

export default function HeaderAlarmComponent() {
    return (
        <Link href="/alarm" className='flex items-center h-8 px-2 rounded-md transition-colors duration-200 hover:bg-[#E5E7EB]'>
          <Image src="/header/bell.svg" width={17} height={17} alt="알림" />
          {/* 알림 드롭다운 */}
        </Link>
    );
}