import { cookies } from 'next/headers';
import Link from 'next/link';
import { fetchAdminUserDetail } from '@/services/admin.service';
import type { AdminUserDetail } from '@/features/admin/usermanage/components/AllUsers';

interface PageProps {
  params: Promise<{ userId: string }>;
}

const ROLE_LABEL: Record<AdminUserDetail['role'], string> = {
  STUDENT: '수강생',
  INSTRUCTOR: '강사',
};

const STATUS_LABEL: Record<AdminUserDetail['status'], string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  SUSPENDED: '정지',
};

const STATUS_BADGE_CLS: Record<AdminUserDetail['status'], string> = {
  ACTIVE: 'bg-[#F9FBE7] text-[#827717]',
  INACTIVE: 'bg-[#E5E7EB]/40 text-[#6A7282]',
  SUSPENDED: 'bg-[#FEE2E2] text-[#B91C1C]',
};

const formatDate = (value: string | null) => (value ? value.slice(0, 10) : '-');

export default async function UserDetailPage({ params }: PageProps) {
  const { userId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchAdminUserDetail(accessToken, Number(userId));

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center text-[#6A7282]">
        회원 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const fieldLabelCls = 'text-[11.5px] text-[#9CA3AF] mb-1';
  const fieldValueCls = 'text-[14.5px] font-semibold text-[#1E2125]';

  return (
    <div className="max-w-5xl mx-auto px-6 py-3">
      <Link
        href="/admin/usermanage"
        className="flex items-center gap-1 text-[13px] text-[#6A7282] hover:text-[#1E2125] cursor-pointer mb-4 w-fit"
      >
        &lt; 전체 회원 목록
      </Link>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
        <h2 className="text-[16px] font-bold text-[#1E2125] mb-6">회원 기본 정보</h2>

        <div className="grid grid-cols-2 gap-x-10 gap-y-5 px-3">
          <div>
            <p className={fieldLabelCls}>이름</p>
            <p className={fieldValueCls}>{user.name}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>아이디</p>
            <p className={fieldValueCls}>{user.loginId}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>이메일</p>
            <p className={fieldValueCls}>{user.email}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>연락처</p>
            <p className={fieldValueCls}>{user.phone}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>가입일</p>
            <p className={fieldValueCls}>{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>최근 접속일</p>
            <p className={fieldValueCls}>{formatDate(user.lastLoginAt)}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>역할</p>
            <span
              className={`inline-block px-2.5 py-1 rounded-sm text-[11.5px] font-semibold ${
                user.role === 'INSTRUCTOR'
                  ? 'bg-[#FEF3C7]/70 text-[#92400E]'
                  : 'bg-[#EEF4FF] text-[#5B8DEE]'
              }`}
            >
              {ROLE_LABEL[user.role]}
            </span>
          </div>
          <div>
            <p className={fieldLabelCls}>상태</p>
            <span
              className={`inline-block px-3 py-1 rounded-md text-[12.5px] font-semibold ${STATUS_BADGE_CLS[user.status]}`}
            >
              {STATUS_LABEL[user.status]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}