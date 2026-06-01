'use server';

import { cookies } from 'next/headers';
import { EnrollmentCourseItem, EnrollmentSummary } from './types';
import {
  paymentSingleCourse,
  paymentCartCheckout,
  fetchCredits,
  PaymentResponse,
} from '@/services/enrollment.service';

// 보유 크레딧 조회
export async function getCreditsAction(): Promise<number> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) throw new Error('UNAUTHORIZED');

  const data = await fetchCredits(accessToken);
  return data.balance;
}

// 단일 강의 결제 (CourseCard [구매하기])
export async function paySingleCourseAction(courseId: number): Promise<PaymentResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) throw new Error('UNAUTHORIZED');

  return paymentSingleCourse(accessToken, courseId);
}

// 장바구니 선택 강의 결제 (장바구니 [구매하기])
export async function payCartCheckoutAction(courseIds: number[]): Promise<PaymentResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) throw new Error('UNAUTHORIZED');

  return paymentCartCheckout(accessToken, courseIds);
}
