import Link from 'next/link';
import Image from 'next/image';

const FEATURE_CARDS = [
  {
    href: '/recommendations',
    icon: '/main/recommendation-Icon-white.svg',
    iconBg: 'bg-[#FF5E5E]',
    title: 'AI 맞춤 강의 추천',
    isFree: false,
    description: '채용공고를 등록하면 AI가 부족한 역량을 분석하고 딱 맞는 강의를 추천해드려요.',
    buttonLabel: '추천 받기',
    buttonStyle: 'bg-[#FF5E5E] hover:bg-[#D14848] text-white',
    cardBg: 'bg-[#FFEBEB]',
  },
  {
    href: '/compare',
    icon: '/main/compare-Icon.svg',
    iconBg: 'bg-[#CFEE5D]',
    title: '강의 한눈에 비교',
    isFree: true,
    description: '관심 강의를 나란히 놓고 커리큘럼, 가격, 평점을 한번에 비교해보세요.',
    buttonLabel: '비교하기',
    buttonStyle: 'bg-[#CFEE5D] hover:bg-[#A8D014] text-[#1E2125]',
    cardBg: 'bg-[#F1FFC1]',
  },
  {
    href: '/resume',
    icon: '/main/resume-Icon-white.svg',
    iconBg: 'bg-[#FF5E5E]',
    title: 'AI 이력서 작성 & 평가',
    isFree: false,
    description: '템플릿으로 이력서를 작성하고 AI가 점수와 개선 방향까지 알려드려요.',
    buttonLabel: '작성하기',
    buttonStyle: 'bg-[#FF5E5E] hover:bg-[#D14848] text-white',
    cardBg: 'bg-[#FFEBEB]',
  },
] as const;

export default function FeatureCards() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 px-24 list-none">
      {FEATURE_CARDS.map(
        ({ href, icon, iconBg, title, isFree, description, buttonLabel, buttonStyle, cardBg }) => (
          <li key={href} className="min-w-13">
            <article className={`${cardBg} rounded-xl p-6 flex flex-col gap-4 h-full`}>
              {/* 아이콘 — 원형 배경, 장식용이라 aria-hidden */}
              <div
                aria-hidden="true"
                className={`${iconBg} w-13 h-13 rounded-full flex items-center justify-center shrink-0`}
              >
                <Image src={icon} alt="" width={24} height={24} />
              </div>

              {/* 텍스트 */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-[#1E2125] text-[20px] font-bold leading-snug flex items-center gap-1.5">
                  {title}
                  {isFree && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FF5E5E] text-white">
                      무료
                    </span>
                  )}
                </h3>
                <p className="text-[#6A7282] text-[16px] leading-relaxed">{description}</p>
              </div>

              {/* 버튼 — 오른쪽 하단 정렬 */}
              <div className="flex justify-end">
                <Link
                  href={href}
                  aria-label={`${title} - ${buttonLabel}`}
                  className={`inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-[13.5px] font-semibold transition-colors duration-150 ${buttonStyle}`}
                >
                  {buttonLabel}
                </Link>
              </div>
            </article>
          </li>
        ),
      )}
    </ul>
  );
}