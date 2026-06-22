'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface AiAgreementRequiredModalProps {
  onCancel: () => void;
}

export default function AiAgreementRequiredModal({ onCancel }: AiAgreementRequiredModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    router.push('/mypage');
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[19px] font-bold text-[#1E2125] mb-4">AI 기능 활용 동의 필요</h3>
        <p className="text-[14px] text-[#6A7282] leading-relaxed mb-6">
          AI 구독 플랜을 이용하기 위해서는 &apos;AI 기능 활용 동의&apos;가 필요합니다.
          <br />
          동의 여부는 마이페이지&gt;개인정보 조회&gt;수정하기에서 변경할 수 있습니다. 수정
          페이지로 이동하시겠습니까?
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleConfirm}
            className="h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
          >
            확인
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}