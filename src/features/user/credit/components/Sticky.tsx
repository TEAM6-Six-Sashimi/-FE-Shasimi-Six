'use client';

import { useState } from 'react';
import OneButtonModal from '@/components/modals/OneButtonModal';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { chargeCreditAction } from '@/features/user/credit/actions';
import { Button } from '@/components/ui/button';

interface StickyProps {
  currentCredit: number;
  chargeAmount: number;
  afterCredit: number;
  onChargeSuccess: (newBalance: number) => void;
}

type ModalState = 'none' | 'invalid' | 'confirm' | 'success' | 'error';

export default function Sticky({
  currentCredit,
  chargeAmount,
  afterCredit,
  onChargeSuccess,
}: StickyProps) {
  const [modalState, setModalState] = useState<ModalState>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 충전하기 버튼 클릭
  const handleChargeClick = () => {
    // 유효성 검사: 최소 10000원, 1000원 단위
    if (chargeAmount < 10000 || chargeAmount % 1000 !== 0) {
      setModalState('invalid');
      return;
    }
    setModalState('confirm');
  };

  // 충전 확인 → API 호출
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await chargeCreditAction(chargeAmount);
      onChargeSuccess(result.balance);
      setModalState('success');
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
          className={`w-full py-3 h-auto rounded-lg text-[15px] font-medium ${
            chargeAmount > 0
              ? 'bg-[#FF5E5E] text-white hover:bg-[#D14848]'
              : 'bg-[#E5E7EB] text-[#6A7282] hover:bg-[#E5E7EB]'
          }`}
        >
          충전하기
        </Button>
      </div>

      {/* 유효성 실패 모달 */}
      {modalState === 'invalid' && (
        <OneButtonModal
          title="충전 금액 확인"
          message="입력한 충전 금액을 주세요."
          onConfirm={() => setModalState('none')}
        />
      )}

      {/* 충전 확인 모달 */}
      {modalState === 'confirm' && (
        <TwoButtonModal
          title="크레딧 충전"
          message={'크레딧을 충전하시겠습니까?'}
          onConfirm={handleConfirm}
          onCancel={() => setModalState('none')}
        />
      )}

      {/* 충전 완료 모달 */}
      {modalState === 'success' && (
        <OneButtonModal
          title="충전 완료"
          message="충전이 완료되었습니다."
          onConfirm={() => setModalState('none')}
        />
      )}

      {/* 충전 실패 모달 */}
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
