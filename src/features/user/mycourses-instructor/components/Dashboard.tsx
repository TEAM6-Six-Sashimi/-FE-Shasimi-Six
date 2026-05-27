'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOCK_DASHBOARD_STATS, MOCK_COURSE_REVENUES } from '@/constants/mockInstructorCourses';

type StatTab = '매출' | '수강생 수' | '완강률';

const PERIOD_OPTIONS = ['이번 달', '최근 3개월', '직접 설정'] as const;

export default function Dashboard() {
  const [period, setPeriod] = useState('이번 달');
  const [statTab, setStatTab] = useState<StatTab>('매출');
  const stats = MOCK_DASHBOARD_STATS;
  const revenues = MOCK_COURSE_REVENUES;

  const SUMMARY_CARDS = [
    {
      icon: '💰',
      iconBg: 'bg-[#FFEBEB]',
      label: '전체 매출',
      value: stats.totalRevenue.toLocaleString(),
      sub: '이번 달 총 매출',
    },
    {
      icon: '📈',
      iconBg: 'bg-[#EEF4FF]',
      label: '수수료 30%',
      value: stats.platformFee.toLocaleString(),
      sub: '이번 달 플랫폼 수수료',
    },
    {
      icon: '🏆',
      iconBg: 'bg-[#F9FBE7]',
      label: '출금 가능',
      value: stats.withdrawable.toLocaleString(),
      sub: '정산 가능 금액',
    },
    {
      icon: '📅',
      iconBg: 'bg-[#F9FAFB]',
      label: '총 정산액',
      value: stats.totalSettled.toLocaleString(),
      sub: '누적 정산 금액',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-6 px-8 mb-6">
        {SUMMARY_CARDS.map(({ icon, iconBg, label, value, sub }) => (
          <div
            key={label}
            className="bg-white rounded-xl border-2 border-[#E5E7EB] p-7 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-10.5 h-10.5 rounded-full ${iconBg} flex items-center justify-center text-[16px]`}
              >
                {icon}
              </span>
              <span className="text-[15px] text-[#6A7282] font-semibold">{label}</span>
            </div>
            <div>
              <p className="text-[22px] px-3 font-bold text-[#1E2125]">{value}</p>
              <p className="text-[12px] px-3 text-[#6A7282]">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 기간 설정 */}
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[#1E2125]">기간 설정</span>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36 h-9 text-[13px] border-[#D1D5DB] text-[#1E2125]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-[13px]">
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 통계 탭 */}
      <div className="bg-white rounded-xl border-2 border-[#D1D5DB] overflow-hidden">
        {/* 탭 헤더 */}
        <div className="grid grid-cols-3 border-b border-[#D1D5DB] h-13">
          {(['매출', '수강생 수', '완강률'] as StatTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatTab(tab)}
              className={`py-3 text-[13.5px] font-semibold transition-colors cursor-pointer ${
                statTab === tab
                  ? 'text-[#FF5E5E] border-b-2 border-[#FF5E5E] -mb-px'
                  : 'text-[#6A7282] hover:text-[#1E2125]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-5 flex flex-col gap-4">
          {statTab === '매출' && (
            <>
              <div>
                <p className="text-[14px] font-bold text-[#1E2125]">매출 통계</p>
                <p className="text-[12px] text-[#6A7282]">
                  누적 총 매출: {stats.totalRevenue.toLocaleString()} 크레딧
                </p>
              </div>
              {revenues.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-none"
                >
                  <span className="text-[13.5px] text-[#1E2125]">{r.title}</span>
                  <span className="text-[13.5px] font-semibold text-[#FF5E5E]">
                    {r.revenue.toLocaleString()} 크레딧
                  </span>
                </div>
              ))}
            </>
          )}

          {statTab === '수강생 수' && (
            <>
              <div>
                <p className="text-[14px] font-bold text-[#1E2125]">수강생 통계</p>
                <p className="text-[12px] text-[#6A7282]">
                  누적 총 수강생 수:{' '}
                  {revenues.reduce((s, r) => s + r.studentCount, 0).toLocaleString()}명
                </p>
              </div>
              {revenues.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-none"
                >
                  <span className="text-[13.5px] text-[#1E2125]">{r.title}</span>
                  <span className="text-[13.5px] font-semibold text-[#5B8DEE]">
                    {r.studentCount.toLocaleString()}명
                  </span>
                </div>
              ))}
            </>
          )}

          {statTab === '완강률' && (
            <>
              <div>
                <p className="text-[14px] font-bold text-[#1E2125]">완강률 통계</p>
                <p className="text-[12px] text-[#6A7282]">완강 기준: 100%</p>
              </div>
              {revenues
                .sort((a, b) => b.completionRate - a.completionRate)
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col gap-1.5 py-2 border-b border-[#F3F4F6] last:border-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] text-[#1E2125]">{r.title}</span>
                      <span className="text-[12px] text-[#6A7282]">
                        ({r.completedCount}명 / {r.totalCount}명){' '}
                        <span className="font-semibold text-[#1E2125]">{r.completionRate}%</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#D1D5DB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#CFEE5D] rounded-full"
                        style={{ width: `${r.completionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
