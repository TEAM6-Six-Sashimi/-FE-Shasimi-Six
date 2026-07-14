import { fetchNoticeDetail } from '@/services/notice.service';
import NoticeDetailView from '@/features/user/notice/components/NoticeDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await fetchNoticeDetail(Number(id));

  return (
    <div className="bg-[#F9FAFB]">
      <div className="max-w-5xl min-h-screen mx-auto px-6 py-10">
        <NoticeDetailView result={result} />
      </div>
    </div>
  );
}
