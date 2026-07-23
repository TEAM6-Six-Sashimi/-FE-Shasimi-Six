export interface AdminNotice {
  noticeId: number;
  title: string;
  pinned: boolean;
  createdDate: string;
}

export interface AdminNoticeListResponse {
  items: AdminNotice[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  // 조회 자체가 실패했을 때만 true (실제로 0건인 경우와 구분하기 위한 필드)
  error?: boolean;
}

export interface AdminNoticeSearchParams {
  title?: string;
  page?: number;
  size?: number;
}

export interface CreateNoticePayload {
  title: string;
  content: string;
  pinned: boolean;
}

export interface AdminNoticeDetail {
  noticeId: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export type CreateNoticeResult =
  | { success: true; data: AdminNoticeDetail }
  | { success: false; message: string; authError?: true };

export type NoticeDetailResult =
  | { success: true; data: AdminNoticeDetail }
  | { success: false; message: string };

export type DeleteNoticeResult =
  | { success: true }
  | { success: false; message: string; authError?: true };
