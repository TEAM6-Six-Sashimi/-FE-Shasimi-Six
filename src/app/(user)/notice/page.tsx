import NoticeListView from '@/features/user/notice/components/NoticeListView';
import { fetchNotices } from '@/services/notice.service';

const ITEMS_PER_PAGE = 10;

export default async function NoticeListPage() {
  const initialData = await fetchNotices({ page: 0, size: ITEMS_PER_PAGE });

  return (
    <div className="bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto min-h-screen px-6 py-10">
        <NoticeListView
          initialItems={initialData.items}
          initialTotalPages={initialData.totalPages}
        />
      </div>
    </div>
  );
}
