import Link from 'next/link';
import { Category } from '@/features/categories/types';
import {
  INSTRUCTOR_APPLICATION_STATUS_LABEL,
  INSTRUCTOR_APPLICATION_STATUS_STYLE,
  MyInstructorApplication,
} from '../../types';

interface InstructorApplicationHistoryTableProps {
  applications: MyInstructorApplication[];
  categories: Category[];
}

export default function InstructorApplicationHistoryTable({
  applications,
  categories,
}: InstructorApplicationHistoryTableProps) {
  const categoryName = (categoryId: number) =>
    categories.find((cat) => cat.mainCategoryId === categoryId)?.name ?? '-';

  return (
    <table className="w-full text-[13px] table-fixed">
      <thead>
        <tr className="border-b border-[#E5E7EB]">
          <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">#</th>
          <th className="py-3 w-[26%] text-center font-semibold text-[#1E2125]">지원 카테고리</th>
          <th className="py-3 w-[22%] text-center font-semibold text-[#1E2125]">지원 일자</th>
          <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">지원 상태</th>
          <th className="py-3 w-[24%] text-center font-semibold text-[#1E2125]">지원 내용 상세</th>
        </tr>
      </thead>
      <tbody>
        {applications.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-16 text-center text-[#6A7282]">
              강사 지원 내역이 없습니다.
            </td>
          </tr>
        ) : (
          applications.map((application, idx) => (
            <tr
              key={application.applicationId}
              className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
            >
              <td className="py-4 text-center text-[#6A7282]">{idx + 1}</td>
              <td className="py-4 text-center text-[#1E2125] font-medium">
                {categoryName(application.categoryId)}
              </td>
              <td className="py-4 text-center text-[#6A7282]">
                {application.createdAt.slice(0, 10)}
              </td>
              <td className="py-4 text-center">
                <span
                  className={`inline-block px-2.5 py-1 rounded-md text-[11.5px] font-semibold ${INSTRUCTOR_APPLICATION_STATUS_STYLE[application.approvalStatus]}`}
                >
                  {INSTRUCTOR_APPLICATION_STATUS_LABEL[application.approvalStatus]}
                </span>
              </td>
              <td className="py-4 text-center">
                <Link
                  href={`/mypage/instructor-application-list/${application.applicationId}`}
                  className="text-[#1E2125] font-medium underline"
                >
                  상세보기
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
