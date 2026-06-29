import { CoursePaymentItem } from '../../types';

interface CoursePaymentTableProps {
  items: CoursePaymentItem[];
}

export default function CoursePaymentTable({ items }: CoursePaymentTableProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[5%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">주문번호</th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125]">날짜/시간</th>
            <th className="py-3 w-[40%] text-center font-semibold text-[#1E2125]">
              결제한 강의 리스트
            </th>
            <th className="py-3 w-[21%] text-center font-semibold text-[#1E2125]">
              총 결제 크레딧
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center text-[#6A7282]">
                결제 내역이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item, idx) => (
              <tr
                key={item.paymentId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors align-top"
              >
                <td className="py-4 text-center text-[#6A7282]">{idx + 1}</td>
                <td className="py-4 text-center text-[#1E2125] font-medium">{item.orderNo}</td>
                <td className="py-4 text-center text-[#6A7282]">
                  {item.paidAt.slice(0, 10)} / {item.paidAt.slice(11, 16)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1.5">
                    {item.courses.map((course) => (
                      <div
                        key={course.courseId}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="text-[#1E2125] truncate">{course.title}</span>
                        <span className="text-[#9CA3AF] text-[12.5px] shrink-0">
                          {course.price.toLocaleString()} 크레딧
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 text-center font-bold text-[#FF5E5E] text-[14px]">
                  {item.amount.toLocaleString()} 크레딧
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
