import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// accessToken은 httpOnly 쿠키라 브라우저 JS가 직접 못 읽는다.
// WebSocket(STOMP) 연결은 브라우저에서 직접 맺어야 하므로, 같은 출처 요청에 한해
// 이미 서버가 갖고 있는 accessToken 값을 그대로 내려준다 (토큰을 새로 발급하지 않음).
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  return NextResponse.json({ accessToken });
}
