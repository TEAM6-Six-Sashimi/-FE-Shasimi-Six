import { fetchNoticeDetailAction } from '@/features/admin/noticemanage/actions';
import NoticeDetailView from '@/features/admin/noticemanage/components/NoticeDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await fetchNoticeDetailAction(Number(id));

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 공지사항 관리</h1>
      <NoticeDetailView result={result} />
    </div>
  );
}
