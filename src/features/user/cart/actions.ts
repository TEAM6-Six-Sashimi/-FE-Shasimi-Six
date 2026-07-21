'use server';

import { cookies } from 'next/headers';
import { deleteCartItems, addCartItem } from '@/services/cart.service';
import { MaintenanceError } from '@/services/maintenance.service';
import { AuthSessionError } from '@/features/auth/errors';

// 장바구니 아이템 추가
export async function addCartItemAction(
  courseId: number,
): Promise<
  { success: true } | { success: false; code: string; maintenance?: true; message?: string }
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false, code: 'UNAUTHORIZED' };

  try {
    await addCartItem(accessToken, courseId);
    return { success: true };
  } catch (error) {
    if (error instanceof AuthSessionError) {
      return { success: false, code: 'AUTH_SESSION_EXPIRED', message: error.message };
    }
    if (error instanceof MaintenanceError) {
      return { success: false, code: 'MAINTENANCE', maintenance: true, message: error.message };
    }
    const code = error instanceof Error ? error.message : 'UNKNOWN';
    return { success: false, code };
  }
}

// 장바구니 아이템 삭제
export type DeleteCartItemsResult =
  | { success: true }
  | { success: false; authError?: true; maintenance?: true; message: string };

export async function deleteCartItemsAction(cartItemIds: number[]): Promise<DeleteCartItemsResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false, message: '로그인이 필요합니다.' };

  try {
    await deleteCartItems(accessToken, cartItemIds);
    return { success: true };
  } catch (error) {
    if (error instanceof AuthSessionError) {
      return { success: false, authError: true, message: error.message };
    }
    if (error instanceof MaintenanceError) {
      return { success: false, maintenance: true, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : '장바구니 삭제에 실패했습니다.',
    };
  }
}
