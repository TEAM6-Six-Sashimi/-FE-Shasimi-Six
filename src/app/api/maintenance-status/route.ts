import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// proxy.ts의 동일한 점검 상태 조회와 같은 값
const MAINTENANCE_CHECK_TIMEOUT_MS = 1500;

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/maintenance/status`, {
      next: { revalidate: 5 },
      signal: AbortSignal.timeout(MAINTENANCE_CHECK_TIMEOUT_MS),
    });

    if (!res.ok) {
      return NextResponse.json({ enabled: false, message: '' });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('[maintenance-status] fetch error:', e);
    return NextResponse.json({ enabled: false, message: '' });
  }
}
