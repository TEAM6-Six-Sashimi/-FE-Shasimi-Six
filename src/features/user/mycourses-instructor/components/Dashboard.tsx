'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  fetchDashboardSummaryAction,
  fetchSalesStatisticsAction,
  fetchStudentStatisticsAction,
  fetchCompletionRateStatisticsAction,
} from '../actions';
import {
  InstructorDashboardSummary,
  InstructorSalesStatistics,
  InstructorStudentStatistics,
  InstructorCompletionRateStatistics,
} from '../types';

type StatTab = '매출' | '수강생 수' | '완강률';

interface SummaryCard {
  iconSrc: string;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
}

const now = new Date();
const ITEMS_PER_PAGE = 5;

export default function Dashboard() {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [statTab, setStatTab] = useState<StatTab>('매출');
  const [page, setPage] = useState(1);

  const [summary, setSummary] = useState<InstructorDashboardSummary | null>(null);
  const [sales, setSales] = useState<InstructorSalesStatistics | null>(null);
  const [students, setStudents] = useState<InstructorStudentStatistics | null>(null);
  const [completionRate, setCompletionRate] = useState<InstructorCompletionRateStatistics | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // 매출/요약은 연월에 따라 다시 조회, 수강생 수/완강률은 기간과 무관하게 한 번만 조회
  useEffect(() => {
    let active = true;
    Promise.all([
      fetchDashboardSummaryAction(year, month),
      fetchSalesStatisticsAction(year, month),
      fetchStudentStatisticsAction(),
      fetchCompletionRateStatisticsAction(),
    ])
      .then(([summaryRes, salesRes, studentsRes, completionRateRes]) => {
        if (!active) return;
        setSummary(summaryRes);
        setSales(salesRes);
        setStudents(studentsRes);
        setCompletionRate(completionRateRes);
      })
      .catch((error) => {
        console.error('[Dashboard] 통계 조회 실패:', error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [year, month]);

  const handleMonthChange = (value: string) => {
    const [y, m] = value.split('-').map(Number);
    if (!y || !m) return;
    setIsLoading(true);
    setPage(1);
    setYear(y);
    setMonth(m);
  };

  const sortedCompletionCourses = completionRate
    ? [...completionRate.courses].sort((a, b) => b.completionRate - a.completionRate)
    : [];

  const activeListLength =
    statTab === '매출'
      ? (sales?.courses.length ?? 0)
      : statTab === '수강생 수'
        ? (students?.courses.length ?? 0)
        : sortedCompletionCourses.length;

  const totalPages = Math.max(1, Math.ceil(activeListLength / ITEMS_PER_PAGE));
  const pageStart = (page - 1) * ITEMS_PER_PAGE;
  const pageEnd = pageStart + ITEMS_PER_PAGE;

  const SUMMARY_CARDS: SummaryCard[] = [
    {
      iconSrc: '/dashboard/sales.svg',
      iconBg: 'bg-[#EEF4FF]',
      label: '이번 달 매출',
      value: `${(summary?.totalSales ?? 0).toLocaleString()} 크레딧`,
      sub: `${year}년 ${month}월 총 매출`,
    },
    {
      iconSrc: '/dashboard/profit.svg',
      iconBg: 'bg-[#FEF3C7]',
      label: `수수료 ${summary?.platformFeeRate ?? 0}%`,
      value: `${(summary?.platformFee ?? 0).toLocaleString()} 크레딧`,
      sub: '플랫폼 수수료',
    },
    {
      iconSrc: '/dashboard/settlement.svg',
      iconBg: 'bg-[#F9FBE7]',
      label: '정산 예정 금액',
      value: `${(summary?.settlementAmount ?? 0).toLocaleString()} 크레딧`,
      sub: '이번 달 정산 예정',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4 sm:px-8 mb-6">
        {SUMMARY_CARDS.map(({ iconSrc, iconBg, label, value, sub }) => (
          <div
            key={label}
            className="min-w-0 bg-white rounded-xl border-2 border-[#E5E7EB] p-7 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-10.5 h-10.5 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
              >
                <Image src={iconSrc} alt="" width={20} height={20} />
              </span>
              <span className="text-[15px] text-[#6A7282] font-semibold">{label}</span>
            </div>
            <div>
              <p className="text-[22px] px-3 font-bold text-[#1E2125] wrap-break-word">{value}</p>
              <p className="text-[12px] px-3 text-[#6A7282]">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 기간 설정 */}
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[#1E2125]">기간 설정</span>
        <input
          type="month"
          value={`${year}-${String(month).padStart(2, '0')}`}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[#D1D5DB] text-[13px] text-[#1E2125] outline-none focus:border-[#1E2125] transition-colors [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
      </div>

      {/* 통계 탭 */}
      <div className="bg-white rounded-xl border-2 border-[#D1D5DB] overflow-hidden">
        {/* 탭 헤더 */}
        <div className="grid grid-cols-3 border-b border-[#D1D5DB] h-13 min-w-0">
          {(['매출', '수강생 수', '완강률'] as StatTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatTab(tab);
                setPage(1);
              }}
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
          {isLoading ? (
            <p className="text-center text-[13.5px] text-[#6A7282] py-10">불러오는 중...</p>
          ) : (
            <>
              {statTab === '매출' && (
                <>
                  <div>
                    <p className="text-[14px] font-bold text-[#1E2125]">매출 통계</p>
                    <p className="text-[12px] text-[#6A7282]">
                      {year}년 {month}월 총 매출: {(sales?.totalSales ?? 0).toLocaleString()} 크레딧
                    </p>
                  </div>
                  {sales?.courses.length ? (
                    sales.courses.slice(pageStart, pageEnd).map((c) => (
                      <div
                        key={c.courseId}
                        className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-none"
                      >
                        <span className="text-[13.5px] text-[#1E2125]">{c.title}</span>
                        <span className="text-[13.5px] font-semibold text-[#FF5E5E]">
                          {c.salesAmount.toLocaleString()} 크레딧
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-[13px] text-[#6A7282] py-6">
                      해당 기간에 매출 내역이 없습니다.
                    </p>
                  )}
                </>
              )}

              {statTab === '수강생 수' && (
                <>
                  <div>
                    <p className="text-[14px] font-bold text-[#1E2125]">수강생 통계</p>
                    <p className="text-[12px] text-[#6A7282]">
                      누적 총 수강생 수: {(students?.totalStudentCount ?? 0).toLocaleString()}명
                    </p>
                  </div>
                  {students?.courses.length ? (
                    students.courses.slice(pageStart, pageEnd).map((c) => (
                      <div
                        key={c.courseId}
                        className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-none"
                      >
                        <span className="text-[13.5px] text-[#1E2125]">{c.title}</span>
                        <span className="text-[13.5px] font-semibold text-[#5B8DEE]">
                          {c.studentCount.toLocaleString()}명
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-[13px] text-[#6A7282] py-6">
                      수강생 내역이 없습니다.
                    </p>
                  )}
                </>
              )}

              {statTab === '완강률' && (
                <>
                  <div>
                    <p className="text-[14px] font-bold text-[#1E2125]">완강률 통계</p>
                    <p className="text-[12px] text-[#6A7282]">완강 기준: 100%</p>
                  </div>
                  {sortedCompletionCourses.length ? (
                    sortedCompletionCourses.slice(pageStart, pageEnd).map((c) => (
                      <div
                        key={c.courseId}
                        className="flex flex-col gap-1.5 py-2 border-b border-[#F3F4F6] last:border-none"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13.5px] text-[#1E2125]">{c.title}</span>
                          <span className="text-[12px] text-[#6A7282]">
                            ({c.completedStudentCount}명 / {c.totalStudentCount}명){' '}
                            <span className="font-semibold text-[#1E2125]">
                              {c.completionRate}%
                            </span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#D1D5DB] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#CFEE5D] rounded-full"
                            style={{ width: `${c.completionRate}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-[13px] text-[#6A7282] py-6">
                      완강률 내역이 없습니다.
                    </p>
                  )}
                </>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
                  >
                    이전
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                        page === p
                          ? 'bg-[#1E2125] text-white'
                          : 'text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2125]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
