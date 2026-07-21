import { cookies } from 'next/headers';
import { fetchCart } from '@/services/cart.service';
import { CartCourseItem } from '@/features/user/cart/types';
import CartClient from '@/features/user/cart/components/CartClient';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function CartPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let initialItems: CartCourseItem[] = [];
  if (accessToken) {
    try {
      const data = await fetchCart(accessToken);
      initialItems = data.items;
    } catch (e) {
      // 세션이 완전히 끊긴 경우 - 빈 장바구니 대신 로그아웃 처리
      if (e instanceof AuthSessionError) {
        return <SessionExpiredRedirect message={e.message} />;
      }
      initialItems = [];
    }
  }

  return <CartClient initialItems={initialItems} />;
}
