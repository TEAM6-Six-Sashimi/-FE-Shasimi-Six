import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CheckboxToggle from './CheckboxToggle';
import { CareerItem, EMPLOYMENT_TYPE_LABEL, EmploymentType } from '../types';

const inputCls =
  'w-full h-9 px-3 rounded-lg border border-[#D1D5DB] bg-white text-[13px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors';

const selectTriggerCls =
  'h-9! w-full rounded-lg border-[#D1D5DB] bg-white text-[13px] text-[#1E2125]';

const labelCls = 'text-[13px] font-semibold text-[#1E2125] mb-2 flex items-center gap-0.5';

const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = [
  'FULL_TIME',
  'CONTRACT',
  'PART_TIME',
  'FREELANCER',
  'OTHER',
];

interface CareerSectionProps {
  careers: CareerItem[];
  isNewGraduate: boolean;
  error: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof CareerItem, value: string | boolean) => void;
  onDateChange: (id: string, field: 'startYearMonth' | 'endYearMonth', value: string) => void;
  onNewGraduateToggle: () => void;
}

export default function CareerSection({
  careers,
  isNewGraduate,
  error,
  onAdd,
  onRemove,
  onUpdate,
  onDateChange,
  onNewGraduateToggle,
}: CareerSectionProps) {
  return (
    <fieldset>
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-1.5 text-[14.5px] font-bold text-[#1E2125]">
          <Image src="/ai-resume/career.svg" alt="경력사항" width={16} height={16} /> 경력 사항{' '}
          <span className="text-[#FF5E5E]">*</span>
        </h3>
        <CheckboxToggle checked={isNewGraduate} onChange={onNewGraduateToggle} label="신입" />
      </div>
      {error && <p className="text-[12.5px] font-medium text-[#DC2626] mb-3">{error}</p>}

      {!isNewGraduate && (
        <div className="flex flex-col gap-3">
          {careers.map((career) => (
            <article
              key={career.id}
              className="relative border border-[#E5E7EB] rounded-lg p-4 bg-[#F9FAFB] flex flex-col py-5 gap-3"
            >
              <button
                type="button"
                onClick={() => onRemove(career.id)}
                className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#1E2125] cursor-pointer"
                aria-label="삭제"
              >
                ✕
              </button>

              <div>
                <label className={labelCls}>
                  프로젝트/회사명 <span className="text-[#FF5E5E]">*</span>
                </label>
                <input
                  type="text"
                  value={career.companyName}
                  onChange={(e) => onUpdate(career.id, 'companyName', e.target.value)}
                  placeholder="회사명을 입력하세요"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    시작/입사일 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={career.startYearMonth}
                    onChange={(e) => onDateChange(career.id, 'startYearMonth', e.target.value)}
                    placeholder="YYYY-MM"
                    maxLength={7}
                    className={inputCls}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>
                      종료/퇴사일 <span className="text-[#FF5E5E]">*</span>
                    </label>
                    <CheckboxToggle
                      checked={career.currentlyEmployed}
                      onChange={() =>
                        onUpdate(career.id, 'currentlyEmployed', !career.currentlyEmployed)
                      }
                      label="-ing"
                      size="md"
                    />
                  </div>
                  <input
                    type="text"
                    value={career.endYearMonth}
                    onChange={(e) => onDateChange(career.id, 'endYearMonth', e.target.value)}
                    placeholder="YYYY-MM"
                    maxLength={7}
                    disabled={career.currentlyEmployed}
                    className={`${inputCls} ${career.currentlyEmployed ? 'bg-[#F3F4F6] text-[#9CA3AF]' : ''}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    형태 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <Select
                    value={career.employmentType}
                    onValueChange={(v) => onUpdate(career.id, 'employmentType', v)}
                  >
                    <SelectTrigger className={selectTriggerCls}>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {EMPLOYMENT_TYPE_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t} className="text-[13px]">
                          {EMPLOYMENT_TYPE_LABEL[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={labelCls}>
                    직무 / 직책 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={career.jobTitle}
                    onChange={(e) => onUpdate(career.id, 'jobTitle', e.target.value)}
                    placeholder="예: 백엔드 개발자 / 주임"
                    className={inputCls}
                  />
                </div>
              </div>

              {career.employmentType === 'OTHER' && (
                <div>
                  <label className={labelCls}>재직 형태 직접 입력</label>
                  <input
                    type="text"
                    value={career.customEmploymentType}
                    onChange={(e) => onUpdate(career.id, 'customEmploymentType', e.target.value)}
                    placeholder="예: 인턴"
                    className={inputCls}
                  />
                </div>
              )}
            </article>
          ))}

          <button
            type="button"
            onClick={onAdd}
            className="w-full py-2.5 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer"
          >
            + 경력 추가
          </button>
        </div>
      )}
    </fieldset>
  );
}
