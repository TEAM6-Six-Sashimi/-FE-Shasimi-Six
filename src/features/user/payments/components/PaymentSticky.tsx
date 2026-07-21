'use client';

import { useState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PaymentSummary } from '../types';
import { checkoutAction } from '../actions';
import { useMaintenance } from '@/components/system/MaintenanceProvider';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import OneButtonModal from '@/components/modals/OneButtonModal';
import { Button } from '@/components/ui/button';
import Checkbox from '@/components/ui/Checkbox';
import FullScreenLoading from '@/components/ui/FullScreenLoading';

interface PaymentStickyProps {
  summary: PaymentSummary;
}

const ERROR_MAP: Record<string, string> = {
  CREDIT_INSUFFICIENT_BALANCE: '크레딧 잔액이 부족합니다.',
  PAYMENT_001: '이미 수강 중인 강의가 포함되어 있습니다.',
  ENROLLMENT_001: '이미 수강 중인 강의가 포함되어 있습니다.',
  CART_003: '결제할 강의를 선택해주세요.',
  CART_004: '장바구니 선택 정보가 올바르지 않습니다.',
  PAYMENT_002: '결제할 강의가 없습니다.',
  SUBSCRIPTION_002: '이미 활성화된 구독권이 있습니다.',
};

export function PaymentSticky({ summary }: PaymentStickyProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setMaintenance } = useMaintenance();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRefund, setAgreedToRefund] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const idempotencyKeyRef = useRef('');

  const generateIdempotencyKey = () => {
    idempotencyKeyRef.current = crypto.randomUUID();
  };

  const isSubscription = summary.purchaseType === 'AI_SUBSCRIPTION';

  // 동의 체크박스만 충족하면 버튼 활성화 (크레딧 조건 제거)
  const canPurchase = agreedToTerms && agreedToRefund;

  const handlePaymentClick = () => {
    if (!canPurchase) return;

    // 크레딧 부족 시 충전 안내 모달, 충분하면 바로 결제 확인 모달
    if (summary.shortfallCredits > 0) {
      setShowInsufficientModal(true);
      return;
    }

    generateIdempotencyKey();
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    let result;
    if (summary.purchaseType === 'AI_SUBSCRIPTION') {
      result = await checkoutAction(
        {
          purchaseType: 'AI_SUBSCRIPTION',
          planCode: summary.planCode,
          agreed: true,
        },
        idempotencyKeyRef.current,
      );
    } else if (summary.purchaseType === 'COURSE') {
      result = await checkoutAction(
        {
          purchaseType: 'COURSE',
          courseId: summary.courseIds?.[0],
          agreed: true,
        },
        idempotencyKeyRef.current,
      );
    } else {
      result = await checkoutAction(
        {
          purchaseType: 'CART',
          courseIds: summary.courseIds,
          agreed: true,
        },
        idempotencyKeyRef.current,
      );
    }

    if (result.success) {
      setShowCompleteModal(true);
    } else {
      if (result.maintenance) {
        setMaintenance(true, result.message);
        return;
      }

      if (result.code === 'UNAUTHORIZED') {
        router.push('/auth/login');
        setIsLoading(false);
        return;
      }

      setErrorMessage(ERROR_MAP[result.code] ?? '결제에 실패했습니다. 다시 시도해주세요.');
      setShowErrorModal(true);
    }

    setIsLoading(false);
  };

  // 결제 완료 후 이동 경로 (강의 결제 완료 시에만 사용 — 구독은 선택지가 2개라 별도 처리)
  const completeRedirectPath = '/mycourses-student';
  const cancelRedirectPath = '/cart';

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
            <span className="font-bold">부족한 크레딧</span>
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
              label={
                isSubscription
                  ? '상품, 가격, 유의사항 등을 확인하였으며 구독에 동의합니다. (필수)'
                  : '상품, 가격, 유의사항 등을 확인하였으며 구매에 동의합니다. (필수)'
              }
            />
            <CheckboxAgreement
              id="refund"
              checked={agreedToRefund}
              onChange={setAgreedToRefund}
              label={
                isSubscription
                  ? '구독 결제는 환불이 불가하다는 것을 확인하였으며 결제에 동의합니다. (필수)'
                  : '해당 상품의 경우 환불이 불가하다는 것을 확인하였으며 구매에 동의합니다. (필수)'
              }
            />
          </div>

          {/* 결제 버튼 */}
          <Button
            onClick={handlePaymentClick}
            disabled={!canPurchase || isLoading}
            className={`w-full py-3 h-auto rounded-lg text-white font-semibold text-base ${
              canPurchase && !isLoading
                ? 'bg-[#FF5F5F] hover:bg-[#D14848] cursor-pointer'
                : 'bg-[#E5E7EB] text-gray-400 hover:bg-[#E5E7EB] cursor-not-allowed'
            }`}
          >
            {isLoading ? '결제 중...' : '결 제'}
          </Button>
        </div>
      </div>

      {/* 결제 처리 중 전체 화면 로딩 - 처리 도중 다른 곳으로 이탈하지 못하게 막는다 */}
      {isLoading && <FullScreenLoading message="결제를 처리하고 있어요..." />}

      {/* 크레딧 부족 모달 */}
      {showInsufficientModal && (
        <TwoButtonModal
          title="크레딧 부족"
          message="크레딧이 부족합니다. 크레딧 충전 페이지로 이동하시겠습니까?"
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowInsufficientModal(false);
            // 충전 완료 후 다시 이 결제 페이지로 돌아올 수 있도록 현재 경로를 실어 보낸다
            const query = searchParams.toString();
            const returnTo = query ? `${pathname}?${query}` : pathname;
            router.push(`/credit?returnTo=${encodeURIComponent(returnTo)}`);
          }}
          onCancel={() => setShowInsufficientModal(false)}
        />
      )}

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
      {showCompleteModal && isSubscription && (
        <TwoButtonModal
          title="구독 시작 완료"
          message={'구독이 시작되었습니다.\n원하시는 페이지로 이동해보세요.'}
          confirmLabel="채용공고 분석"
          cancelLabel="이력서/자소서 평가"
          onConfirm={() => {
            setShowCompleteModal(false);
            router.push('/recommendations');
          }}
          onCancel={() => {
            setShowCompleteModal(false);
            router.push('/ai-analysis');
          }}
          onClose={() => {
            setShowCompleteModal(false);
            router.push('/');
          }}
        />
      )}
      {showCompleteModal && !isSubscription && (
        <TwoButtonModal
          title="결제 완료"
          message={'결제가 완료되었습니다. 내 강의 목록으로 이동할까요?'}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowCompleteModal(false);
            router.push(completeRedirectPath);
          }}
          onCancel={() => {
            setShowCompleteModal(false);
            router.push(cancelRedirectPath);
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
      <Checkbox
        id={id}
        checked={checked}
        onChange={onChange}
        color="#FF5F5F"
        size="md"
        className="mt-0.5"
      />
      <span className="text-xs text-gray-500 leading-relaxed">{label}</span>
    </label>
  );
}