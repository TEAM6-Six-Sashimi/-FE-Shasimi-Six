import { NcsInfo } from "../../types";
import Image from "next/image";
 
interface CourseNcsSectionProps {
  ncs: NcsInfo | null;
}

function formatAbilityUnits(ncs: NcsInfo | null): string {
  if (!ncs || !ncs.abilityUnitNames?.length) return '-';
 
  const names = ncs.abilityUnitNames.join(', ');
  const remaining = ncs.totalAbilityUnitCount - ncs.abilityUnitNames.length;
 
  return remaining > 0 ? `${names} 외 ${remaining}개` : names;
}
 
export default function CourseNcsSection({ ncs }: CourseNcsSectionProps) {
  const rows = [
    { label: '분류', value: ncs?.categoryPath || '-', icon: '/coursedetail/ncs-category.svg' },
    { label: '직무 설명', value: ncs?.jobDescription || '-', icon: '/coursedetail/ncs-description.svg' },
    { label: '능력단위명', value: formatAbilityUnits(ncs) || '-', icon: '/coursedetail/ncs-skillunit.svg' },
  ];
 
  return (
    <section className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
      <h2 className="text-[#1E2125] text-[17px] font-bold mb-3">NCS 정보</h2>
      <ul className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-start gap-2 text-[13px] text-[#1E2125]">
            <Image src={row.icon} width={15} height={15} alt="" className="mt-0.5 shrink-0" />
            <span className="font-medium">{row.label}</span>
            <span className="text-[#6A7282]">{row.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}