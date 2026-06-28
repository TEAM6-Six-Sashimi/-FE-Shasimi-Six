import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchUserMe } from '@/services/user.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  const res = await fetch(`${API_BASE_URL}/admin/monitoring`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    console.error(`[admin/monitoring] status=${res.status} body=${errorBody}`);
    return NextResponse.json(
      { error: '모니터링 정보를 불러오지 못했습니다.' },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json({ grafanaUrl: data.grafanaUrl });
}