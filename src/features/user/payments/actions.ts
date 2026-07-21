'use server';

import { cookies } from 'next/headers';
import {
  CheckoutRequest,
  CheckoutResponse,
  SubscriptionPlan,
  PlanPreview,
  MySubscription,
  SubscriptionPaymentsResponse,
} from './types';
import { parseMaintenanceMessage, MaintenanceError } from '@/services/maintenance.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ── 결제 (강의 단일 / 장바구니 / AI 구독 공용) ──────────────────

export async function checkoutAction(
  payload: CheckoutRequest,
  idempotencyKey: string,
): Promise<
  | { success: true; data: CheckoutResponse }
  | { success: false; code: string; maintenance?: true; message?: string }
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) throw new Error('UNAUTHORIZED');

    async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, ms = 8000) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ms);
      try {
        return await fetch(input, { ...init, signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
    }

    const res = await fetchWithTimeout(`${API_BASE_URL}/payments/checkout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const maintenanceMessage = await parseMaintenanceMessage(res);
      if (maintenanceMessage) throw new MaintenanceError(maintenanceMessage);

      const errorBody = await res.json().catch(() => null);
      throw new Error(errorBody?.errorCode ?? 'CHECKOUT_FAILED');
    }

    return { success: true, data: await res.json() };
  } catch (error) {
    if (error instanceof MaintenanceError) {
      return { success: false, code: 'MAINTENANCE', maintenance: true, message: error.message };
    }
    return {
      success: false,
      code: error instanceof Error ? error.message : 'CHECKOUT_FAILED',
    };
  }
}

// ── AI 구독 플랜 조회 ──────────────────────────────────────

export async function fetchSubscriptionPlansAction(): Promise<SubscriptionPlan[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const res = await fetch(`${API_BASE_URL}/subscriptions/plans`, {
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.plans ?? [];
}

export async function fetchPlanPreviewAction(planCode: string): Promise<PlanPreview | null> {
  const safePlanCode = encodeURIComponent(planCode);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/subscriptions/plans/${safePlanCode}/preview`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data;
}

export async function fetchMySubscriptionAction(): Promise<MySubscription | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/subscriptions/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}

export async function fetchSubscriptionPaymentsAction(
  page = 0,
  size = 10,
): Promise<SubscriptionPaymentsResponse | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/subscriptions/payments?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}
