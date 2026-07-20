import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '서비스 소개',
  description:
    'AI 기반 역량 진단부터 맞춤 강의 추천, 취업 준비까지 - 핏(Fit)-격이 다른 이유를 소개합니다.',
  openGraph: {
    title: '서비스 소개 | 핏(Fit)-격',
    description:
      'AI 기반 역량 진단부터 맞춤 강의 추천, 취업 준비까지 - 핏(Fit)-격이 다른 이유를 소개합니다.',
    url: '/website-about',
  },
};

const BEFORE_TAGS = ['어디서 시작하지?', '강의가 너무 많아', '내 수준을 모르겠어'];
const AFTER_TAGS = ['역량 자동 분석', '맞춤 강의 추천'];

const FEATURES = [
  {
    icon: '/aboutpage/bot-Icon.svg',
    iconBg: 'bg-[#EEF4FF]',
    title: 'AI 기반 역량 진단',
    description: '채용공고와 이력서를 분석해 지금 내게 부족한 역량을 도출합니다.',
  },
  {
    icon: '/aboutpage/target-Icon.svg',
    iconBg: 'bg-[#FEF3C7]',
    title: '맞춤형 학습 방향 제시',
    description: '목표 직무에 필요한 자격증과 강의를 추천합니다.',
  },
  {
    icon: '/aboutpage/rocket-Icon.svg',
    iconBg: 'bg-[#FFF0EE]',
    title: '취업 준비 통합 지원',
    description: '학습부터 자격증 취득, 시험 일정 관리까지 한 곳에서.',
  },
];

export default function WebsiteAboutPage() {
  return (
    <div>
      {/* 상단 바 */}
      <div className="bg-[#F9FAFB]">
        <div className="max-w-370 mx-auto px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[15px] text-[#1E2125] hover:font-bold"
          >
            <ArrowLeft size={16} />
            홈으로
          </Link>
        </div>
      </div>

      {/* 히어로 */}
      <section className="bg-[#F9FAFB] pt-18 pb-30 px-6 text-center">
        <h1 className="text-[40px] font-extrabold text-[#1E2125] leading-snug">
          당신에게 딱 맞는 <span className="text-[#FF5F5F]">자격증</span>,
          <br />
          합격을 위한 강의가 여기에
        </h1>

        <div className="flex justify-center">
          <Image
            src="/aboutpage/aboutpage-logo.png"
            alt="핏(Fit)-격 FITGYEOK 로고"
            width={280}
            height={204}
            priority
          />
        </div>

        <p className="text-[14px] text-[#6A7282] mt-5 leading-relaxed">
          AI와 공공데이터를 활용해 사용자의 역량을 분석하고,
          <br />
          목표 직무에 필요한 자격증과 강의를 추천하는
          <br />
          AI 기반 취업 연계형 자격증 학습 플랫폼입니다.
        </p>
      </section>

      {/* 왜 만들었나요? / 핏격에서 할 수 있는 것 */}
      <section className="bg-[#1E2125] py-45 px-6">
        <div className="max-w-250 mx-auto">
          <div className="mb-55">
            <h2 className="text-[32px] font-bold text-center text-white mb-10">왜 만들었나요?</h2>

            <div className="flex items-center gap-6">
              <div className="flex-1 bg-white rounded-xl p-8">
                <p className="text-[13px] font-semibold text-[#9CA3AF] tracking-wide mb-2">
                  BEFORE
                </p>
                <h3 className="text-[20px] font-extrabold text-[#1E2125] mb-3">
                  자격증은 이제 필수입니다
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {BEFORE_TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-[#FFEBEB] text-[#DC2626] text-[12px] font-semibold line-through"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[13.5px] text-[#6A7282] leading-relaxed">
                  채용공고마다 요구하는 자격증과 역량이 달라 어디서부터 시작해야 할지 막막한 게
                  현실입니다.
                </p>
              </div>

              <ChevronRight className="text-white shrink-0" size={40} />

              <div className="flex-1 bg-white rounded-xl p-8">
                <p className="text-[13px] font-semibold text-[#9CA3AF] tracking-wide mb-2">AFTER</p>
                <h3 className="text-[20px] font-bold text-[#1E2125] mb-3">
                  기존 플랫폼은 부족했습니다
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {AFTER_TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-[#CFEE5D] text-[#1E2125] text-[12px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[13.5px] text-[#374151] leading-relaxed">
                  내 역량을 분석하고 지금 나에게 필요한 것을 알려주는 서비스가 필요했습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="flex max-w-full justify-center font-bold mt-24 mb-8">
            <h1 className="text-[35px] text-[#C6F135]">핏격</h1>
            <span className="text-[30px] text-white mt-1.5">에서 할 수 있는 것</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {FEATURES.map(({ icon, iconBg, title, description }) => (
              <div key={title} className="bg-white rounded-xl py-8 px-6">
                <div
                  className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center mb-4`}
                >
                  <Image src={icon} alt="기능 아이콘" width={28} height={28} />
                </div>
                <h3 className="text-[18px] font-bold text-[#1E2125] mb-2">{title}</h3>
                <p className="text-[14px] text-[#6A7282] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 핏격이 다른 이유 */}
      <section className="bg-[#FDF1EF] py-35 px-6 text-center">
        <h2 className="text-[30px] font-bold text-[#1E2125] mb-6">
          &ldquo;핏격&rdquo;이 다른 이유!
        </h2>
        <p className="text-[18px] text-[#374151] font-medium leading-relaxed">
          기존 강의 플랫폼과 달리, 핏격은
          <br />
          <span className="font-extrabold text-[#E7000B]">
            AI 분석 기반으로 나에게 딱 맞는 학습 방향을 제시하고
          </span>
          <br />
          학습부터 취업 준비까지 하나의 흐름으로 연결합니다.
        </p>
      </section>
    </div>
  );
}
