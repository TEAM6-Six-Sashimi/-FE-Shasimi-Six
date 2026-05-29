// 장바구니 서비스(cart/enrollment)
import { CartResponse } from "@/features/user/cart/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 장바구니 조회
export async function fetchCart(accessToken: string): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    });
 
    if (!response.ok) {
        console.log('fetchCart status:', response.status);
        throw new Error('장바구니 조회에 실패했습니다.');
    }
 
    return response.json();
}

// 장바구니 아이템 삭제
export async function deleteCartItems(
    accessToken: string,
    courseIds: number[]
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ courseIds }),
    });
 
    if (!response.ok) {
        throw new Error('장바구니 삭제에 실패했습니다.');
    }
}