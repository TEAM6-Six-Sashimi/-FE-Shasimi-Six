import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// (커피챗용) 서버사이드에서 연결 전용 단기 티켓 = wsTicket
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/ws-ticket`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: '티켓 발급에 실패했습니다.' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ wsTicket: data.wsTicket, expiresIn: data.expiresIn });
  } catch {
    return NextResponse.json({ error: '티켓 발급에 실패했습니다.' }, { status: 502 });
  }
}
