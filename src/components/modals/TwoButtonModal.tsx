interface TwoButtonModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TwoButtonModal({
    title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: TwoButtonModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
             <div className="bg-white rounded-2xl shadow-xl w-90 p-7 flex flex-col gap-5">
                <div>
                  <h2 className="text-[20px] font-bold text-[#1E2125] mb-5">{title}</h2>
                  <p className="text-[15px] text-[#6A7282] whitespace-pre-line">{message}</p>
                </div>
                <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-xl bg-[#FF5E5E] text-white text-[15px] font-medium hover:bg-[#D14848] transition-colors cursor-pointer"
                >
                    {confirmLabel}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl border border-[#D1D5DB] text-[#1E2125] text-[15px] font-medium hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                >
                    {cancelLabel}
                </button>
            </div>
        </div>
    </div>
  );
}