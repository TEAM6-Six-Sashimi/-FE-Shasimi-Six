import { cookies } from 'next/headers';
import { fetchCart } from '@/services/cart.service';
import { CartCourseItem } from '@/features/user/cart/types';
import CartClient from '@/features/user/cart/components/CartClient';

export default async function CartPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let initialItems: CartCourseItem[] = [];
  if (accessToken) {
    try {
      const data = await fetchCart(accessToken);
      initialItems = data.items;
    } catch (e) {
      initialItems = [];
    }
  }

  return <CartClient initialItems={initialItems} />;
}
