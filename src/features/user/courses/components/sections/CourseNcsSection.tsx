// 추후 API 연동 시 백엔드 응답 타입으로 교체
export interface NcsInfo {
  category: string;     // 분류
  competency: string;   // 능력단위명
  employmentRate?: string; // 취업률 (사진엔 있으나 현재 데이터 없음, 옵셔널 처리)
}
 
interface CourseNcsSectionProps {
  ncs: NcsInfo;
}
 
export default function CourseNcsSection({ ncs }: CourseNcsSectionProps) {
  const rows = [
    { label: '분류', value: ncs.category },
    { label: '능력단위명', value: ncs.competency },
    ...(ncs.employmentRate ? [{ label: '취업률', value: ncs.employmentRate }] : []),
  ];
 
  return (
    <section className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
      <h2 className="text-[#1E2125] text-[17px] font-bold mb-3">NCS 정보</h2>
      <ul className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-start gap-2 text-[13px] text-[#1E2125]">
            <span className="text-[#1E2125] mt-0.5">•</span>
            <span className="font-medium">{row.label}</span>
            <span className="text-[#6A7282]">{row.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}