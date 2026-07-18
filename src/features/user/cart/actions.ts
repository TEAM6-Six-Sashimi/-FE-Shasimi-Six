'use server';

import { cookies } from 'next/headers';
import { deleteCartItems, addCartItem } from '@/services/cart.service';
import { MaintenanceError } from '@/services/maintenance.service';

// 장바구니 아이템 추가
export async function addCartItemAction(
  courseId: number,
): Promise<
  | { success: true }
  | { success: false; code: string; maintenance?: true; message?: string }
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false, code: 'UNAUTHORIZED' };

  try {
    await addCartItem(accessToken, courseId);
    return { success: true };
  } catch (error) {
    if (error instanceof MaintenanceError) {
      return { success: false, code: 'MAINTENANCE', maintenance: true, message: error.message };
    }
    const code = error instanceof Error ? error.message : 'UNKNOWN';
    return { success: false, code };
  }
}

// 장바구니 아이템 삭제
export async function deleteCartItemsAction(cartItemIds: number[]): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) throw new Error('로그인이 필요합니다.');

  return deleteCartItems(accessToken, cartItemIds);
}
