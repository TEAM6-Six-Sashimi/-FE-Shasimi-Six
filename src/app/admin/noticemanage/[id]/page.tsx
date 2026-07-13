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
      <NoticeDetailView result={result} />
    </div>
  );
}
