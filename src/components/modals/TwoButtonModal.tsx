import { Button } from '@/components/ui/button';

interface TwoButtonModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** 제공하면 우측 상단에 X 버튼이 노출되고, 클릭 시 이 콜백이 호출됩니다. */
  onClose?: () => void;
}

export default function TwoButtonModal({
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  onClose,
}: TwoButtonModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-xl w-90 p-7 flex flex-col gap-5">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#1E2125] text-[18px] leading-none cursor-pointer"
          >
            ✕
          </button>
        )}
        <div>
          <h2 className="text-[20px] font-bold text-[#1E2125] mb-5">{title}</h2>
          <p className="text-[15px] text-[#6A7282] whitespace-pre-line break-words">{message}</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            className="flex-1 py-3 h-auto rounded-xl bg-[#FF5E5E] text-white text-[15px] font-medium hover:bg-[#D14848] cursor-pointer"
          >
            {confirmLabel}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 py-3 h-auto rounded-xl border border-[#D1D5DB] text-[#1E2125] text-[15px] font-medium hover:bg-[#F9FAFB] hover:text-[#1E2125] cursor-pointer"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}