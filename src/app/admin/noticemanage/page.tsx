import NoticeManagementList from '@/features/admin/noticemanage/components/NoticeManagementList';

export default function NoticeManagePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 공지사항 관리</h1>
      <NoticeManagementList />
    </div>
  );
}
