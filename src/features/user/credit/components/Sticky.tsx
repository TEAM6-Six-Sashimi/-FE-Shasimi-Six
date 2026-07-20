'use client';

import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import OneButtonModal from '@/components/modals/OneButtonModal';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { readyCreditChargeAction } from '@/features/user/credit/actions';
import { logoutAction } from '@/features/auth/actions';
import { useToast } from '@/components/ui/ToastContext';
import { useMaintenance } from '@/components/system/MaintenanceProvider';
import { Button } from '@/components/ui/button';

interface StickyProps {
  currentCredit: number;
  chargeAmount: number;
  afterCredit: number;
}

type ModalState = 'none' | 'invalid' | 'confirm' | 'error';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? '';
const MIN_AMOUNT = 10000;
const UNIT_AMOUNT = 1000;

export default function Sticky({ currentCredit, chargeAmount, afterCredit }: StickyProps) {
  const { showToast } = useToast();
  const { setMaintenance } = useMaintenance();
  const [modalState, setModalState] = useState<ModalState>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isAmountInvalid = chargeAmount < MIN_AMOUNT || chargeAmount % UNIT_AMOUNT !== 0;

  // 충전하기 버튼 클릭
  const handleChargeClick = () => {
    if (isAmountInvalid) {
      setModalState('invalid');
      return;
    }
    setModalState('confirm');
  };

  // 충전 확인 → 1) 백엔드에 주문 준비(ready) → 2) Toss 결제창 호출
  const handleConfirm = async () => {
    setIsLoading(true);

    // 1) 충전 준비: 백엔드에서 orderId/orderName 발급
    const readyResult = await readyCreditChargeAction(chargeAmount);

    if (!readyResult.success) {
      if (readyResult.authError) {
        showToast(readyResult.message, 'alarm');
        await logoutAction();
        return;
      }
      if (readyResult.maintenance) {
        setMaintenance(true, readyResult.message);
        setIsLoading(false);
        return;
      }
      setErrorMessage(readyResult.message);
      setModalState('error');
      setIsLoading(false);
      return;
    }

    try {
      const { orderId, orderName, amount } = readyResult.data;

      // 2) Toss 결제창 호출 (성공 시 successUrl로 리다이렉트되며 이 페이지로는 돌아오지 않음)
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: orderId });

      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: amount,
        },
        orderId,
        orderName,
        successUrl: `${window.location.origin}/credit/success`,
        failUrl: `${window.location.origin}/credit/fail`,
      });
      // 정상 흐름에서는 브라우저가 리다이렉트되므로 이 아래 코드는 실행되지 않음
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '충전에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(message);
      setModalState('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-[17px] font-bold mt-2 mb-3">충전 요약</h2>

          {/* 현재 보유 크레딧 */}
          <div className="flex justify-between items-center">
            <span className="text-[13.5px] text-[#6A7282]">현재 보유 크레딧</span>
            <span className="text-[14px] font-semibold text-[#1E2125]">
              {currentCredit.toLocaleString()}
            </span>
          </div>

          {/* 충전 금액 */}
          <div className="flex justify-between items-center">
            <span className="text-[13.5px] text-[#6A7282]">충전 금액</span>
            <span
              className={`text-[14px] font-semibold ${chargeAmount > 0 ? 'text-[#FF5E5E]' : 'text-[#6A7282]'}`}
            >
              {chargeAmount > 0 ? `+${chargeAmount.toLocaleString()}` : '-'}
            </span>
          </div>

          <hr className="border-[#D1D5DB]" />

          {/* 충전 후 예상 잔액 */}
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-semibold text-[#1E2125]">충전 후 예상 잔액</span>
            <span className="text-[20px] font-bold text-[#1E2125]">
              {afterCredit.toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleChargeClick}
          disabled={chargeAmount <= 0 || isLoading}
          className={`w-full py-3 h-auto rounded-lg text-[15px] font-semibold ${
            chargeAmount > 0
              ? 'bg-[#FF5E5E] text-white hover:bg-[#D14848] cursor-pointer'
              : 'bg-[#E5E7EB] text-[#6A7282] hover:bg-[#E5E7EB]'
          }`}
        >
          {isLoading ? '결제창 준비 중...' : '충전하기'}
        </Button>
      </div>

      {/* 유효성 실패 모달 (직접 입력 필드에 이미 에러가 표시되지만, 버튼을 누른 경우를 대비한 최종 방어선) */}
      {modalState === 'invalid' && (
        <OneButtonModal
          title="충전 금액 확인"
          message={"입력하신 충전 금액을 확인해주세요."}
          onConfirm={() => setModalState('none')}
        />
      )}

      {/* 충전 확인 모달 */}
      {modalState === 'confirm' && (
        <TwoButtonModal
          title="크레딧 충전"
          message="크레딧을 충전하시겠습니까? 확인 시 Toss 결제창으로 이동합니다."
          onConfirm={handleConfirm}
          onCancel={() => setModalState('none')}
        />
      )}

      {/* 충전 실패 모달 (ready 단계 또는 SDK 호출 실패) */}
      {modalState === 'error' && (
        <OneButtonModal
          title="충전 실패"
          message={errorMessage}
          onConfirm={() => setModalState('none')}
        />
      )}
    </>
  );
}
