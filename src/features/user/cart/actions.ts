'use server'

import { cookies } from 'next/headers';
import { fetchCart, deleteCartItems } from '@/services/cart.service';
import { CartResponse } from '@/features/user/cart/types';

// 장바구니 조회
export async function getCartAction(): Promise<CartResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
 
  if (!accessToken) throw new Error('로그인이 필요합니다.');
 
  return fetchCart(accessToken);
}
 
// 장바구니 아이템 삭제
export async function deleteCartItemsAction(courseIds: number[]): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
 
  if (!accessToken) throw new Error('로그인이 필요합니다.');
 
  return deleteCartItems(accessToken, courseIds);
}