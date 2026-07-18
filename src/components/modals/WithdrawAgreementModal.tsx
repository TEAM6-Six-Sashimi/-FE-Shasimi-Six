'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Checkbox from '@/components/ui/Checkbox';

interface WithdrawAgreementModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function WithdrawAgreementModal({
  onConfirm,
  onCancel,
}: WithdrawAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[19px] font-bold text-[#1E2125] mb-3">회원 탈퇴</h3>
        <p className="text-[14px] text-[#1E2125] mb-4">회원 탈퇴 과정을 진행하시겠습니까?</p>

        <div className="bg-[#F9FAFB] rounded-xl px-4 py-3.5 mb-4">
          <p className="text-[13px] text-[#6A7282] leading-relaxed">
            회원 탈퇴 시, 모든 데이터는 1년동안 사이트 내에 보관된 후 삭제되며 계정 복구는
            불가능합니다. 회원의 데이터에는 회원의 개인 정보와 학습 정보, 잔여 크레딧이 모두
            포함됩니다.
          </p>
        </div>

        <label className="flex items-center gap-2.5 mb-5 cursor-pointer w-fit">
          <Checkbox checked={agreed} onChange={setAgreed} color="#CFEE5D" checkColor="#1E2125" />
          <span className="text-[13.5px] text-[#1E2125]">위 내용에 동의합니다.</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onConfirm}
            disabled={!agreed}
            className={`h-11 font-semibold text-[14px] transition-colors ${
              agreed
                ? 'bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer'
                : 'bg-[#D1D5DB] text-white cursor-not-allowed'
            }`}
          >
            확인
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] hover:border-[#1E2125] cursor-pointer"
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}