import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CERTIFICATION_TYPE_LABEL, CertificationItem, CertificationType } from '../types';

const inputCls =
  'w-full h-9 px-3 rounded-lg border border-[#D1D5DB] bg-white text-[13px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors';

const selectTriggerCls = 'h-9! w-full rounded-lg border-[#D1D5DB] bg-white text-[13px] text-[#1E2125]';

const labelCls = 'text-[13px] font-semibold text-[#1E2125] mb-2 flex items-center gap-0.5';

const CERTIFICATION_TYPE_OPTIONS: CertificationType[] = [
  'CERTIFICATE',
  'LANGUAGE',
  'DRIVER_LICENSE',
  'EDUCATION',
  'OTHER',
];

interface CertificationSectionProps {
  certifications: CertificationItem[];
  error: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof CertificationItem, value: string) => void;
  onDateChange: (id: string, value: string) => void;
}

export default function CertificationSection({
  certifications,
  error,
  onAdd,
  onRemove,
  onUpdate,
  onDateChange,
}: CertificationSectionProps) {
  return (
    <fieldset>
      <h3 className="flex items-center gap-1.5 text-[14.5px] font-bold text-[#1E2125] mb-3">
        <Image src="/ai-resume/skill.svg" alt="보유 기술 및 자격증" width={17} height={17} /> 보유
        기술 및 자격증 <span className="text-[#FF5E5E]">*</span>
      </h3>
      {error && <p className="text-[12.5px] font-medium text-[#DC2626] mb-3">{error}</p>}

      <div className="flex flex-col gap-3">
        {certifications.map((cert) => (
          <article
            key={cert.id}
            className="relative border border-[#E5E7EB] rounded-lg p-4 bg-[#F9FAFB] flex flex-col py-5 gap-3"
          >
            <button
              type="button"
              onClick={() => onRemove(cert.id)}
              className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#1E2125] cursor-pointer"
              aria-label="삭제"
            >
              ✕
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>
                  자격증 유형 <span className="text-[#FF5E5E]">*</span>
                </label>
                <Select value={cert.type} onValueChange={(v) => onUpdate(cert.id, 'type', v)}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {CERTIFICATION_TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t} className="text-[13px]">
                        {CERTIFICATION_TYPE_LABEL[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={labelCls}>
                  자격증명 <span className="text-[#FF5E5E]">*</span>
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => onUpdate(cert.id, 'name', e.target.value)}
                  placeholder="예: 정보처리기사"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>
                  발급기관 <span className="text-[#FF5E5E]">*</span>
                </label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => onUpdate(cert.id, 'issuer', e.target.value)}
                  placeholder="예: 한국산업인력공단"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  취득일자 <span className="text-[#FF5E5E]">*</span>
                </label>
                <input
                  type="text"
                  value={cert.acquiredDate}
                  onChange={(e) => onDateChange(cert.id, e.target.value)}
                  placeholder="YYYY-MM-DD"
                  maxLength={10}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>점수/등급 (선택)</label>
                <input
                  type="text"
                  value={cert.scoreOrGrade}
                  onChange={(e) => onUpdate(cert.id, 'scoreOrGrade', e.target.value)}
                  placeholder="예: 1급"
                  className={inputCls}
                />
              </div>
            </div>
          </article>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="w-full py-2.5 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer"
        >
          + 자격 추가
        </button>
      </div>
    </fieldset>
  );
}
