'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnrollmentSummary } from '../types';
import { paySingleCourseAction, payCartCheckoutAction } from '../actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import OneButtonModal from '@/components/modals/OneButtonModal';
import { Button } from '@/components/ui/button';

interface EnrollmentStickyProps {
  summary: EnrollmentSummary;
}

export function EnrollmentSticky({ summary }: EnrollmentStickyProps) {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRefund, setAgreedToRefund] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 결제 전 확인
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // 결제 완료
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const canPurchase = agreedToTerms && agreedToRefund && summary.shortfallCredits === 0;

  // [결제] 버튼 클릭 → 확인 모달 오픈
  const handlePaymentClick = () => {
    if (!canPurchase) return;
    setShowConfirmModal(true);
  };

  // 확인 모달 [확인] -> 실제 결제 API 호출
  const handleConfirmPayment = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const courseIds = summary.items.map((item) => item.courseId);

      if (summary.source === 'single') {
        // 단일 강의: POST /payments/course/{courseId}
        await paySingleCourseAction(courseIds[0]);
      } else {
        // 장바구니: POST /payments/cart/checkout { courseIds }
        await payCartCheckoutAction(courseIds);
      }

      // 결제 성공 → 완료 모달
      setShowCompleteModal(true);
    } catch (err) {
      const code = err instanceof Error ? err.message : '';

      if (code === 'UNAUTHORIZED') {
        router.push('/login');
        return;
      }

      const errorMap: Record<string, string> = {
        CREDIT_INSUFFICIENT_BALANCE: '크레딧 잔액이 부족합니다.',
        ENROLLMENT_001: '이미 수강 중인 강의가 포함되어 있습니다.',
        CART_003: '결제할 강의를 선택해주세요.',
        CART_004: '장바구니 선택 정보가 올바르지 않습니다.',
        PAYMENT_002: '결제할 강의가 없습니다.',
      };

      setErrorMessage(errorMap[code] ?? '결제에 실패했습니다. 다시 시도해주세요.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="sticky top-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-5">결제 상세</h3>

          {/* 금액 요약 */}
          <div className="space-y-3 mb-5">
            <SummaryRow
              label="총 주문 금액"
              value={`${summary.totalPrice.toLocaleString()} 크레딧`}
              valueClassName="font-semibold text-gray-900"
            />
            <SummaryRow
              label="보유 크레딧"
              value={`${summary.ownedCredits.toLocaleString()} 크레딧`}
              valueClassName="font-semibold text-gray-900"
            />
            <SummaryRow
              label="결제 후 잔여 크레딧"
              value={`${summary.remainingCredits.toLocaleString()} 크레딧`}
              valueClassName="font-semibold text-gray-900"
            />
          </div>

          {/* 부족한 금액 */}
          <div className="flex justify-between border-t border-[#D1D5DB] pt-3 pb-6">
            <span className="font-bold ">부족한 금액</span>
            <span className="font-bold text-[#FF5F5F]">
              {summary.shortfallCredits.toLocaleString()} 크레딧
            </span>
          </div>

          {/* 동의 체크박스 */}
          <div className="space-y-3 mb-6">
            <CheckboxAgreement
              id="terms"
              checked={agreedToTerms}
              onChange={setAgreedToTerms}
              label="상품, 가격, 유의사항 등을 확인하였으며 구매에 동의합니다. (필수)"
            />
            <CheckboxAgreement
              id="refund"
              checked={agreedToRefund}
              onChange={setAgreedToRefund}
              label="해당 상품의 경우 환불이 불가하다는 것을 확인하였으며 구매에 동의합니다. (필수)"
            />
          </div>

          {/* 결제 버튼 */}
          <Button
            onClick={handlePaymentClick}
            disabled={!canPurchase || isLoading}
            className={`w-full py-4 h-auto rounded-xl text-white font-semibold text-base ${
              canPurchase && !isLoading
                ? 'bg-[#FF5F5F] hover:bg-[#D14848]'
                : 'bg-[#E5E7EB] text-gray-400 hover:bg-[#E5E7EB] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                처리 중...
              </span>
            ) : (
              '결 제'
            )}
          </Button>
        </div>
      </div>

      {/* 결제 전 확인 모달 */}
      {showConfirmModal && (
        <TwoButtonModal
          title="결제 확인"
          message={`총 ${summary.totalPrice.toLocaleString()} 크레딧을 결제하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {/* 결제 완료 모달 */}
      {showCompleteModal && (
        <TwoButtonModal
          title="결제 완료"
          message="결제가 완료되었습니다. 내 강의 목록으로 이동할까요?"
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowCompleteModal(false);
            router.push('/mycourses-student');
          }}
          onCancel={() => {
            setShowCompleteModal(false);
            router.push('/cart');
          }}
        />
      )}

      {/* 에러 모달 */}
      {showErrorModal && (
        <OneButtonModal
          title="결제 실패"
          message={errorMessage}
          confirmLabel="확인"
          onConfirm={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = '',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm ${valueClassName}`}>{value}</span>
    </div>
  );
}

function CheckboxAgreement({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <div className="relative shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
            checked
              ? 'bg-[#FF5F5F] border-[#FF5F5F]'
              : 'bg-white border-[#D1D5DB] group-hover:border-[#6A7282]'
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-xs text-gray-500 leading-relaxed">{label}</span>
    </label>
  );
}
