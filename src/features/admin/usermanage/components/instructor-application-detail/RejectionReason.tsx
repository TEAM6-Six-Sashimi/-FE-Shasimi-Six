interface RejectionReasonProps {
  categoryLabel: string;
  reason: string;
}

export default function RejectionReason({
  categoryLabel,
  reason,
}: RejectionReasonProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
      <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">반려 사유</h2>
      <p className="text-[13px] text-[#FF5E5E] font-semibold mb-1">{categoryLabel}</p>
      <p className="text-[13.5px] text-[#1E2125] bg-[#FFEBEB] rounded-lg px-4 py-3">{reason}</p>
    </section>
  );
}