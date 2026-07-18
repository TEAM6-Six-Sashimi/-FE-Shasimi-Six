interface RejectDetailField {
  label: string; // 이름, 강의명
  value: string;
}

interface RejectDetailModalProps {
  title?: string; // 반려 사유 상세
  fields: RejectDetailField[]; // 이름/반려일, 강의명/반려일 등
  categoryLabel?: string; // 사유 카테고리
  category: string;
  detailLabel?: string; // 상세 내용
  detail: string;
  onClose: () => void;
}

export default function RejectDetailModal({
  title = '반려 사유 상세',
  fields,
  categoryLabel = '사유 카테고리',
  category,
  detailLabel = '상세 내용',
  detail,
  onClose,
}: RejectDetailModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[19px] font-bold text-[#1E2125]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#1E2125] transition-colors cursor-pointer text-[18px]"
          >
            ✕
          </button>
        </div>

        {/* 대상 정보 */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 bg-[#F9FAFB] rounded-xl px-4 py-3.5 mb-5">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">{field.label}</p>
              <p className="text-[14.5px] font-bold text-[#1E2125] wrap-break-word">{field.value}</p>
            </div>
          ))}
        </div>

        {/* 사유 카테고리 */}
        <div className="mb-4">
          <p className="text-[13px] text-[#6A7282] mb-1.5">{categoryLabel}</p>
          <span className="inline-block px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[#FFEBEB] text-[#FF5E5E]">
            {category}
          </span>
        </div>

        {/* 상세 내용 */}
        <div>
          <p className="text-[13px] text-[#6A7282] mb-1.5">{detailLabel}</p>
          <p className="text-[13.5px] text-[#1E2125] leading-relaxed border border-[#E5E7EB] rounded-lg px-4 py-3 wrap-break-word">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}