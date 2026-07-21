import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// proxy.ts의 동일한 점검 상태 조회와 같은 값
const MAINTENANCE_CHECK_TIMEOUT_MS = 1500;

// 클라이언트가 점검 상태를 폴링할 때 백엔드에 직접 묻지 않고 이 라우트를 거치게 해서,
// 동시 접속자가 아무리 많아도 실제 백엔드 조회는 서버 인스턴스당 5초에 한 번으로 묶는다.
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
