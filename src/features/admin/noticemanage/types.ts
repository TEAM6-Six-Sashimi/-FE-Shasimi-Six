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
