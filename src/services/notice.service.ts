import {
  AdminNoticeListResponse,
  AdminNoticeSearchParams,
  CreateNoticePayload,
  CreateNoticeResult,
  NoticeDetailResult,
  DeleteNoticeResult,
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

// 공지사항 등록 (관리자 전용)
export async function createNotice(
  accessToken: string,
  payload: CreateNoticePayload,
): Promise<CreateNoticeResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/notices`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      if (res.status === 403) {
        return { success: false, message: '접근 권한이 없습니다.' };
      }
      return {
        success: false,
        message: errorBody.message || '공지사항 등록에 실패했습니다.',
      };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    console.error('[createNotice] fetch error:', e);
    return { success: false, message: '공지사항 등록 중 오류가 발생했습니다.' };
  }
}

// 공지사항 상세 조회 (공용, 로그인 불필요)
export async function fetchNoticeDetail(noticeId: number): Promise<NoticeDetailResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/notices/${noticeId}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { success: false, message: '공지사항을 찾을 수 없습니다.' };
      }
      return { success: false, message: '공지사항을 불러오지 못했습니다.' };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    console.error('[fetchNoticeDetail] fetch error:', e);
    return { success: false, message: '공지사항을 불러오는 중 오류가 발생했습니다.' };
  }
}

// 공지사항 삭제 (관리자 전용)
export async function deleteNotice(
  accessToken: string,
  noticeId: number,
): Promise<DeleteNoticeResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/notices/${noticeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { success: false, message: '공지사항을 찾을 수 없습니다.' };
      }
      if (res.status === 403) {
        return { success: false, message: '접근 권한이 없습니다.' };
      }
      return { success: false, message: '공지사항 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (e) {
    console.error('[deleteNotice] fetch error:', e);
    return { success: false, message: '공지사항 삭제 중 오류가 발생했습니다.' };
  }
}
