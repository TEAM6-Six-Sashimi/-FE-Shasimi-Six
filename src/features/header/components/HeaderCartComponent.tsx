import Link from 'next/link';
import Image from 'next/image';
import { fetchCart } from '@/services/cart.service';

interface HeaderCartComponentProps {
  accessToken?: string;
}

export default async function HeaderCartLink({ accessToken }: HeaderCartComponentProps) {
  let itemCount = 0;
  if (accessToken) {
    try {
      const cart = await fetchCart(accessToken);
      itemCount = cart.itemCount;
    } catch {
      itemCount = 0;
    }
  }

  return (
    <Link
      href="/cart"
      aria-label={itemCount > 0 ? `장바구니 (${itemCount}개)` : '장바구니'}
      className="flex items-center h-8 px-2 rounded-md transition-colors duration-200 hover:bg-[#E5E7EB] shrink-0"
    >
      <span className="relative inline-flex shrink-0">
        <Image src="/header/cart.svg" width={17} height={17} alt="" className="shrink-0" />
        {itemCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#DC2626] text-white text-[9px] font-semibold leading-none"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </span>
    </Link>
  );
}
