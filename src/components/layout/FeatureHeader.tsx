import Image from 'next/image';

interface FeatureHeaderProps {
  icon: string;
  title: string;
  description: string;
  right?: string; // ai 갱신일
  rightHighlight?: boolean; // 구독권 미보유 등 강조 표시
}

export default function FeatureHeader({
  icon,
  title,
  description,
  right,
  rightHighlight = false,
}: FeatureHeaderProps) {
  return (
    <div className="w-full bg-[#F9FBE7] py-5 flex items-center justify-between">
      <div className='flex justify-between items-start max-w-275 w-full mx-auto px-6'>
        <div>
        <h1 className="flex items-center gap-2 text-[18px] font-bold text-[#1E2125]">
          <span className="relative flex items-center shrink-0 w-5 h-5">
            <Image
              src={`/featureheader/${icon}.svg`}
              alt="기능 헤더 아이콘"
              width={20}
              height={20}
            />
          </span>
          {title}
        </h1>
        <p className="text-[13px] text-[#6A7282] mt-1">{description}</p>
        </div>
        {right && (
        <p
          className={`text-[13px] font-medium whitespace-nowrap pt-7.5 ${
            rightHighlight ? 'text-[#DC2626] font-semibold' : 'text-[#827717]'
          }`}
        >
          {right}
        </p>
      )}
      </div>
      
    </div>
  );
}
