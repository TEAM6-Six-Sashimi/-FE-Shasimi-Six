'use client';

import { useMemo } from 'react';
import type { AdminPrivateCourse } from '../type';
import type { Category } from '@/features/categories/types';

interface Props {
  categories: Category[];
}

// TODO: 실제 API 연결 전까지 사용하는 임시 데이터
const MOCK_PRIVATE_COURSES: AdminPrivateCourse[] = [
  {
    courseId: 1,
    title: 'AWS 클라우드 기초',
    instructorName: '정민수',
    categoryName: 'AdsP',
    studentCount: 450,
    ratingAvg: 4.5,
    createdAt: '2026-05-01',
    privatedAt: '2028-05-15',
  },
  {
    courseId: 2,
    title: 'CSS 스타일링 완벽 가이드',
    instructorName: '송강사',
    categoryName: '웹디자인기능사',
    studentCount: 230,
    ratingAvg: 4.2,
    createdAt: '2026-04-10',
    privatedAt: '2028-05-10',
  },
  {
    courseId: 3,
    title: 'JavaScript 기초 입문',
    instructorName: '한강사',
    categoryName: 'SQLD',
    studentCount: 120,
    ratingAvg: 4,
    createdAt: '2026-03-20',
    privatedAt: '2028-04-25',
  },
];

export default function PrivateCourses({ categories }: Props) {
  // TODO: 실제 API 연결 시 props로 courses를 받아오도록 변경
  const courses = MOCK_PRIVATE_COURSES;

  // 세부카테고리명 → 대카테고리명 매핑
  const subToMainMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((cat) => {
      cat.options.forEach((opt) => {
        map.set(opt.name, cat.name);
      });
    });
    return map;
  }, [categories]);

  const getMainCategory = (categoryName: string) => subToMainMap.get(categoryName) ?? categoryName;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">비공개 강의 목록</h2>
      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">강의명</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">강사명</th>
            <th className="py-3 w-[22%] text-center font-semibold text-[#1E2125]">
              카테고리 &gt; 세부카테고리
            </th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">수강생 수</th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">평점</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">등록일</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">비공개일</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center text-[#6A7282]">
                비공개된 강의가 없습니다.
              </td>
            </tr>
          ) : (
            courses.map((c, idx) => (
              <tr
                key={c.courseId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{idx + 1}</td>
                <td className="py-3 px-4 text-left font-semibold text-[#1E2125]">{c.title}</td>
                <td className="py-3 text-center text-[#6A7282]">{c.instructorName}</td>
                <td className="py-3 text-center text-[#6A7282]">
                  {getMainCategory(c.categoryName)} &gt; {c.categoryName}
                </td>
                <td className="py-3 text-center text-[#6A7282]">
                  {c.studentCount.toLocaleString()}명
                </td>
                <td className="py-3 text-center">
                  <span className="text-[#FFD700]">★</span>
                  <span className="ml-1 font-semibold text-[#1E2125]">
                    {c.ratingAvg.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 text-center text-[#6A7282]">{c.createdAt}</td>
                <td className="py-3 text-center text-[#6A7282]">{c.privatedAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
