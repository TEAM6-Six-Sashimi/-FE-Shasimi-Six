import { Button } from '@/components/ui/button';

interface InputModalProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function InputModal({
  title,
  subtitle,
  placeholder,
  value,
  onChange,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  loading = false,
}: InputModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-[16px] font-bold text-[#1E2125] mb-1">{title}</h3>
        {subtitle && <p className="text-[13px] text-[#6A7282] mb-4">{subtitle}</p>}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 h-auto border-2 border-[#D1D5DB] text-[13px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] hover:text-[#1E2125]"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 h-auto border-2 border-[#FF5E5E] bg-[#FF5E5E] text-[13px] font-semibold text-white hover:bg-[#D14848] hover:border-[#D14848]"
          >
            {loading ? '처리 중...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}