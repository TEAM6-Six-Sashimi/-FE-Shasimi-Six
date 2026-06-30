'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionMeResponse, SubscriptionPaymentItem } from '../../types';
import { cancelSubscriptionAction } from '../../actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';

interface SubscriptionPaymentTableProps {
  items: SubscriptionPaymentItem[];
  subscriptionMe: SubscriptionMeResponse | null;
}

function formatDate(value: string | null) {
  if (!value) return '';
  return value.slice(0, 10).replace(/-/g, '.');
}

export default function SubscriptionPaymentTable({
  items,
  subscriptionMe,
}: SubscriptionPaymentTableProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // 가장 최근 결제 건에만 상태(해지 버튼/완료 안내) 표시
  const latestPaymentId = items[0]?.subscriptionPaymentId;

  const handleCancelConfirm = async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    try {
      const result = await cancelSubscriptionAction();
      setCancelModalOpen(false);
      showToast(result.message ?? '구독이 해지되었습니다.', 'positive');
      router.refresh();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '구독 해지에 실패했습니다.',
        'negative',
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // 최신 결제 건의 해지/만료 상태 셀 렌더링
  const renderStatusCell = () => {
    if (!subscriptionMe || !subscriptionMe.subscribed) {
      // 구독 자체가 없거나 만료된 경우
      return <span className="text-[#9CA3AF]">—</span>;
    }

    if (subscriptionMe.cancellable) {
      // 아직 해지 신청 안 한 상태 → 해지하기 버튼
      return (
        <button
          onClick={() => setCancelModalOpen(true)}
          className="px-3 py-1.5 rounded-md border border-[#FF5E5E] text-[#FF5E5E] text-[12px] font-semibold hover:bg-[#FFEBEB] transition-colors cursor-pointer"
        >
          해지하기
        </button>
      );
    }

    // 이미 해지 신청됨, 만료일까지 이용 가능
    return (
      <span className="text-[#6A7282] text-[12px] leading-tight">
        해지 완료
        <br />({formatDate(subscriptionMe.expiresAt)}까지 이용 가능)
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
        <table className="w-full text-[13px] table-fixed">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="py-3 w-[5%] text-center font-semibold text-[#1E2125]">#</th>
              <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">주문번호</th>
              <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">날짜/시간</th>
              <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">
                구독 플랜명
              </th>
              <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">
                총 결제 크레딧
              </th>
              <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">해지하기</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#6A7282]">
                  구독 결제 내역이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const isLatest = item.subscriptionPaymentId === latestPaymentId;
                return (
                  <tr
                    key={item.subscriptionPaymentId}
                    className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="py-4 text-center text-[#6A7282]">{idx + 1}</td>
                    <td className="py-4 text-center text-[#1E2125] font-medium">
                      {item.orderNo}
                    </td>
                    <td className="py-4 text-center text-[#6A7282]">
                      {item.paidAt.slice(0, 10)} / {item.paidAt.slice(11, 16)}
                    </td>
                    <td className="py-4 text-center text-[#1E2125] font-medium">
                      {item.planName}
                    </td>
                    <td className="py-4 text-center font-bold text-[#FF5E5E] text-[14px]">
                      {item.amount.toLocaleString()} 크레딧
                    </td>
                    <td className="py-4 text-center">
                      {isLatest ? renderStatusCell() : <span className="text-[#9CA3AF]">—</span>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {cancelModalOpen && (
        <TwoButtonModal
          title="AI 구독 플랜 해지 확인"
          message={
            'AI 구독 플랜을 해지하시겠습니까?\n구독 플랜 만료일까지 ai 기능 사용 가능하며\n이후 사용하실 수 없습니다'
          }
          confirmLabel={isCancelling ? '해지 중...' : '확인'}
          cancelLabel="취소"
          onConfirm={handleCancelConfirm}
          onCancel={() => !isCancelling && setCancelModalOpen(false)}
        />
      )}
    </>
  );
}