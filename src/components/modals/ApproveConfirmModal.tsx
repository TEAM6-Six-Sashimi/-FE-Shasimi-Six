import { Button } from '@/components/ui/button';

interface ApproveConfirmModalProps {
  title: string; // "강사 승인", "강의 승인"
  targetLabel: string; // "승인 대상"
  targetName: string; // "홍길동", "React 심화 과정"
  description: string; // "해당 회원을 강사로 승인하시겠습니까?"
  notice?: string; // "승인 시 강사 권한이 즉시 부여되고..."
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ApproveConfirmModal({
  title,
  targetLabel,
  targetName,
  description,
  notice,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  loading = false,
}: ApproveConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[19px] font-bold text-[#1E2125] mb-5">{title}</h3>

        <div className="flex items-center gap-3 bg-[#F9FBE7] rounded-xl px-4 py-3.5 mb-5">
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#A8D014] text-white text-[12px] shrink-0">
            ✓
          </span>
          <div>
            <p className="text-[11.5px] text-[#6A7282]">{targetLabel}</p>
            <p className="text-[15px] font-bold text-[#1E2125]">{targetName}</p>
          </div>
        </div>

        <p className="text-[14px] font-semibold text-[#1E2125] mb-1.5">{description}</p>
        {notice && <p className="text-[12.5px] text-[#6A7282] mb-6">{notice}</p>}

        <div className="grid grid-cols-2 gap-3 mt-5">
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
          >
            {loading ? '처리 중...' : confirmLabel}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}