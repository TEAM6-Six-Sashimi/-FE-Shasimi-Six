"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnrollmentSummary } from "../types";
import { processEnrollment } from "../actions";

interface EnrollmentStickyProps {
  summary: EnrollmentSummary;
}

export function EnrollmentSticky({ summary }: EnrollmentStickyProps) {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRefund, setAgreedToRefund] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canPurchase =
    agreedToTerms && agreedToRefund && summary.shortfallCredits === 0;

  const handlePayment = async () => {
    if (!canPurchase) return;
    setIsLoading(true);
    try {
      const courseIds = summary.items.map((item) => item.id);
      const result = await processEnrollment(courseIds);
      if (result.success) {
        // TODO: 결제 완료 후 이동 경로 확정 필요
        router.push("/enrollments/complete");
      }
    } catch (error) {
      console.error("결제 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">결제 상세</h3>

        {/* Summary rows */}
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
          <div className="border-t border-gray-100 pt-3">
            <SummaryRow
              label="결제 후 잔여 크레딧"
              value={`${summary.remainingCredits.toLocaleString()} 크레딧`}
              valueClassName="font-semibold text-gray-900"
            />
          </div>
        </div>

        {/* Shortfall */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 mb-5">
          <span className="text-sm font-medium text-gray-600">부족한 금액</span>
          <span
            className={`text-sm font-bold ${
              summary.shortfallCredits > 0 ? "text-rose-500" : "text-gray-400"
            }`}
          >
            {summary.shortfallCredits.toLocaleString()} 크레딧
          </span>
        </div>

        {/* Agreements */}
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

        {/* Payment button */}
        <button
          onClick={handlePayment}
          disabled={!canPurchase || isLoading}
          className={`w-full py-4 rounded-xl text-white font-semibold text-base transition-all duration-200 ${
            canPurchase && !isLoading
              ? "bg-rose-400 hover:bg-rose-500 active:scale-[0.98] shadow-sm"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
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
            "결제"
          )}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = "",
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
    <label
      htmlFor={id}
      className="flex items-start gap-3 cursor-pointer group"
    >
      <div className="relative flex-shrink-0 mt-0.5">
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
              ? "bg-rose-400 border-rose-400"
              : "bg-white border-gray-300 group-hover:border-rose-300"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-xs text-gray-500 leading-relaxed">{label}</span>
    </label>
  );
}