import {
  AdminNoticeListResponse,
  AdminNoticeSearchParams,
} from '@/features/admin/noticemanage/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const EMPTY_LIST: AdminNoticeListResponse = {
  items: [],
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
};

function buildQuery(params: AdminNoticeSearchParams): string {
  const query = new URLSearchParams();
  if (params.title) query.set('title', params.title);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  return query.toString();
}

// 공지사항 목록 조회 (메인 페이지, 공지사항 전체 페이지, 관리자 공지사항 목록에서 공용)
export async function fetchNotices(
  params: AdminNoticeSearchParams,
): Promise<AdminNoticeListResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/notices?${buildQuery(params)}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchNotices] status=${res.status} body=${errorBody}`);
      return EMPTY_LIST;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchNotices] fetch error:', e);
    return EMPTY_LIST;
  }
}
