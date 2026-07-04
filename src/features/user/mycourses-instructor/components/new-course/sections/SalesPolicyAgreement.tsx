interface SalesPolicyAgreementProps {
  agreed: boolean;
  isLoading: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}

export default function SalesPolicyAgreement({
  agreed,
  isLoading,
  error,
  onChange,
}: SalesPolicyAgreementProps) {
  return (
    <section
      aria-labelledby="agreement-heading"
      className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 flex flex-col gap-2"
    >
      <h2 id="agreement-heading" className="sr-only">
        강의 판매 정책 동의
      </h2>
      <label className="flex items-center gap-2.5 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onChange(e.target.checked)}
          disabled={isLoading}
          className="w-4 h-4 accent-[#CFEE5D] cursor-pointer"
        />
        <span className="text-[13.5px] font-semibold text-[#1E2125]">
          강의 판매 정책에 동의합니다. <span className="text-[#FF5E5E]">(필수)</span>
        </span>
      </label>
      <ul className="text-[12px] text-[#6A7282] pl-1 flex flex-col gap-0.5">
        <li>· 강의는 관리자 승인일로부터 2년 후 자동으로 비공개 처리됩니다.</li>
        <li>
          · 비공개 처리 시 신규 수강 신청이 불가하며, 기존 수강생은 이후 2년간 수강할 수 있습니다.
        </li>
        <li>· 비공개 전 강사에게 알림이 발송됩니다.</li>
      </ul>
      {error && <p className="text-[12px] text-[#FF5E5E] mt-1">{error}</p>}
    </section>
  );
}
