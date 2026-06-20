'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/features/admin/usermanage/components/AllUsers';

// TODO: 실제 API 연결 전까지 사용하는 임시 데이터
const MOCK_USERS: (AdminUser & { phone: string })[] = [
  {
    id: 1,
    name: '김철수',
    loginId: 'user1',
    email: 'user1@example.com',
    phone: '010-1234-5678',
    role: 'INSTRUCTOR',
    joinedAt: '2026-05-10',
    lastLoginAt: '2026-06-13',
    status: 'INACTIVE',
  },
  {
    id: 2,
    name: '이영희',
    loginId: 'user2',
    email: 'user2@example.com',
    phone: '010-2345-6789',
    role: 'STUDENT',
    joinedAt: '2026-05-09',
    lastLoginAt: '2026-06-12',
    status: 'ACTIVE',
  },
];

const ROLE_LABEL: Record<AdminUser['role'], string> = {
  STUDENT: '수강생',
  INSTRUCTOR: '강사',
};

interface Props {
  params: Promise<{ userId: string }>;
}

export default function UserDetailPage({ params }: Props) {
  const router = useRouter();
  const { userId } = use(params);
  const user = MOCK_USERS.find((u) => u.id === Number(userId));

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
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-[13px] text-[#6A7282] hover:text-[#1E2125] cursor-pointer mb-4"
      >
        &lt; 전체 회원 목록
      </button>

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
            <p className={fieldValueCls}>{user.joinedAt}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>최근 접속일</p>
            <p className={fieldValueCls}>{user.lastLoginAt}</p>
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
              className={`inline-block px-3 py-1 rounded-md text-[12.5px] font-semibold ${
                user.status === 'ACTIVE'
                  ? 'bg-[#F9FBE7] text-[#827717]'
                  : 'bg-[#E5E7EB]/40 text-[#6A7282]'
              }`}
            >
              {user.status === 'ACTIVE' ? '활성' : '비활성'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
