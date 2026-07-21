import { CreditChargeItem } from '../../types';

interface CreditChargeTableProps {
  items: CreditChargeItem[];
}

export default function CreditChargeTable({ items }: CreditChargeTableProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[5%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[30%] text-center font-semibold text-[#1E2125]">주문번호</th>
            <th className="py-3 w-[13%] text-center font-semibold text-[#1E2125]">
              실제 결제 금액
            </th>
            <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">결제 일시</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">충전한 크레딧</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">결제 수단</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-[#6A7282]">
                크레딧 충전 내역이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((item, idx) => (
              <tr
                key={item.creditChargePaymentId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-4 text-center text-[#6A7282]">{idx + 1}</td>
                <td
                  className="py-4 px-2 text-center text-[#1E2125] font-medium truncate"
                  title={item.orderId}
                >
                  {item.orderId}
                </td>
                <td className="py-4 px-1 text-center text-[#1E2125]">
                  ₩{item.paidAmount.toLocaleString()}
                </td>
                <td className="py-4 px-1 text-center text-[#6A7282]">
                  {item.approvedAt.slice(0, 10)} / {item.approvedAt.slice(11, 16)}
                </td>
                <td className="py-4 px-1 text-center font-bold text-[#FF5E5E] text-[14px]">
                  {item.chargedCredit.toLocaleString()} 크레딧
                </td>
                <td className="py-4 px-1 text-center text-[#6A7282]">{item.paymentMethod}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
