import Image from 'next/image';
import {
  DEGREE_LABEL,
  DegreeType,
  EducationItem,
  GRADUATION_STATUS_LABEL,
  GraduationStatus,
} from '../types';

const inputCls =
  'w-full h-9 px-3 rounded-lg border border-[#D1D5DB] bg-white text-[13px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors';

const labelCls = 'text-[13px] font-semibold text-[#1E2125] mb-2 flex items-center gap-0.5';

const DEGREE_OPTIONS: DegreeType[] = ['HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTOR'];
const GRADUATION_STATUS_OPTIONS: GraduationStatus[] = [
  'GRADUATED',
  'EXPECTED_GRADUATION',
  'ENROLLED',
  'LEAVE_OF_ABSENCE',
  'DROPPED_OUT',
];

interface EducationSectionProps {
  educations: EducationItem[];
  error: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof EducationItem, value: string) => void;
  onDateChange: (id: string, field: 'startYearMonth' | 'endYearMonth', value: string) => void;
}

export default function EducationSection({
  educations,
  error,
  onAdd,
  onRemove,
  onUpdate,
  onDateChange,
}: EducationSectionProps) {
  return (
    <fieldset>
      <h3 className="flex items-center gap-1.5 text-[14.5px] font-bold text-[#1E2125] mb-3">
        <Image src="/ai-resume/scholar.svg" alt="학력사항" width={17} height={17} /> 학력 사항{' '}
        <span className="text-[#FF5E5E]">*</span>
      </h3>
      {error && <p className="text-[12.5px] font-medium text-[#DC2626] mb-3">{error}</p>}

      <div className="flex flex-col gap-3">
        {educations.map((edu) => (
          <article
            key={edu.id}
            className="relative border border-[#E5E7EB] rounded-lg p-4 bg-[#F9FAFB] flex flex-col py-5 gap-3"
          >
            <button
              type="button"
              onClick={() => onRemove(edu.id)}
              className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#1E2125] cursor-pointer"
              aria-label="삭제"
            >
              ✕
            </button>

            <div>
              <label className={labelCls}>
                학교명 <span className="text-[#FF5E5E]">*</span>
              </label>
              <input
                type="text"
                value={edu.schoolName}
                onChange={(e) => onUpdate(edu.id, 'schoolName', e.target.value)}
                placeholder="학교명을 입력하세요"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>
                  입학일 <span className="text-[#FF5E5E]">*</span>
                </label>
                <input
                  type="text"
                  value={edu.startYearMonth}
                  onChange={(e) => onDateChange(edu.id, 'startYearMonth', e.target.value)}
                  placeholder="YYYY-MM"
                  maxLength={7}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  졸업일(예정일) <span className="text-[#FF5E5E]">*</span>
                </label>
                <input
                  type="text"
                  value={edu.endYearMonth}
                  onChange={(e) => onDateChange(edu.id, 'endYearMonth', e.target.value)}
                  placeholder="YYYY-MM"
                  maxLength={7}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  졸업 상태 <span className="text-[#FF5E5E]">*</span>
                </label>
                <select
                  value={edu.graduationStatus}
                  onChange={(e) => onUpdate(edu.id, 'graduationStatus', e.target.value)}
                  className={inputCls}
                >
                  <option value="" disabled>
                    선택
                  </option>
                  {GRADUATION_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {GRADUATION_STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>
                  전공 <span className="text-[#FF5E5E]">*</span>
                </label>
                <input
                  type="text"
                  value={edu.major}
                  onChange={(e) => onUpdate(edu.id, 'major', e.target.value)}
                  placeholder="예: 컴퓨터공학과"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  학위 <span className="text-[#FF5E5E]">*</span>
                </label>
                <select
                  value={edu.degree}
                  onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
                  className={inputCls}
                >
                  <option value="" disabled>
                    선택
                  </option>
                  {DEGREE_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {DEGREE_LABEL[d]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>부전공 또는 연구 내용 (선택)</label>
              <input
                type="text"
                value={edu.minorOrResearch}
                onChange={(e) => onUpdate(edu.id, 'minorOrResearch', e.target.value)}
                placeholder="예: 데이터과학 부전공"
                className={inputCls}
              />
            </div>
          </article>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="w-full py-2.5 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer"
        >
          + 학력 추가
        </button>
      </div>
    </fieldset>
  );
}
