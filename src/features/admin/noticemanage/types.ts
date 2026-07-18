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
