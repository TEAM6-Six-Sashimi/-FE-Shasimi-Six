import Image from 'next/image';
import { AdminDashboardSummary, AdminDashboardStatistics } from './types';

interface Props {
  summary: AdminDashboardSummary | null;
  statistics: AdminDashboardStatistics | null;
}

export default function DashboardSummary({ summary, statistics }: Props) {
  const format = (value?: number) => (value ?? 0).toLocaleString();

  const statusStats = [
    { label: '전체 회원 수', value: statistics?.totalMembers },
    { label: '수강생 수', value: statistics?.studentCount },
    { label: '강사 수', value: statistics?.instructorCount },
    { label: '전체 강의 수', value: statistics?.totalCourses },
  ];

  const cards = [
    {
      key: 'revenue',
      label: '누적 총 매출',
      value: summary?.totalRevenue,
      caption: '전체 매출',
      accent: '#5B8DEE',
      iconBg: '#EEF4FF',
      iconSrc: '/dashboard/sales.svg',
    },
    {
      key: 'profit',
      label: '누적 순이익',
      value: summary?.netProfit,
      caption: `플랫폼 수수료 ${summary?.platformFeeRate ?? 0}%`,
      accent: '#F59E0B',
      iconBg: '#FEF3C7',
      iconSrc: '/dashboard/profit.svg',
    },
    {
      key: 'settlement',
      label: '누적 정산 금액',
      value: summary?.totalSettlementAmount,
      caption: '총 정산액',
      accent: '#827717',
      iconBg: '#F9FBE7',
      iconSrc: '/dashboard/settlement.svg',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {cards.map((card) => (
          <div
            key={card.key}
            className="min-w-0 bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5"
            style={{ borderLeft: `4px solid ${card.accent}` }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: card.iconBg }}
              >
                <Image src={card.iconSrc} alt="" width={18} height={18} />
              </div>
              <span className="text-[14px] font-semibold text-[#6A7282]">{card.label}</span>
            </div>
            <p className="flex flex-wrap items-baseline gap-1 mb-1">
              <span className="text-[26px] font-bold text-[#1E2125] wrap-break-word">
                {format(card.value)}
              </span>
              <span className="text-[14px] font-medium text-[#6A7282]">크레딧</span>
            </p>
            <p className="text-[13px] font-semibold wrap-break-word" style={{ color: card.accent }}>
              {card.caption}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
        <h2 className="text-[18px] font-bold text-[#1E2125] mb-5">현황 요약</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusStats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] py-5 px-2 text-center"
            >
              <p className="text-[13.5px] text-[#6A7282] mb-2">{stat.label}</p>
              <p className="text-[22px] font-bold text-[#1E2125] wrap-break-word">
                {format(stat.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
