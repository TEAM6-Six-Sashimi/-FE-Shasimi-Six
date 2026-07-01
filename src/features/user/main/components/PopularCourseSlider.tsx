import { CourseFromAPI } from '../../courses/types';
import PopularCourseSliderClient from './PopularCourseSliderClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CourseWithCategory extends CourseFromAPI {
  categoryName: string;
}

export default async function PopularCourseSlider() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      next: { revalidate: 60 }, // 1분 캐싱 — 인기 강의는 자주 바뀌지 않으므로
    });
    if (!res.ok) throw new Error('강의 목록 조회 실패');

    const data: CourseFromAPI[] = await res.json();
    const topCourses = [...data]
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 9);

    // 상세 조회(categoryName)를 병렬로 처리
    const detailedCourses: CourseWithCategory[] = await Promise.all(
      topCourses.map(async (course) => {
        const detailRes = await fetch(`${API_BASE_URL}/api/courses/${course.courseId}`, {
          next: { revalidate: 60 },
        });
        if (!detailRes.ok) throw new Error(`${course.courseId}번 강의 상세 조회 실패`);
        const detail = await detailRes.json();
        return { ...course, categoryName: detail.categoryName };
      }),
    );

    if (detailedCourses.length === 0) {
      return (
        <section className="py-20">
          <div className="text-center text-[#6A7282]">인기 강의가 없습니다.</div>
        </section>
      );
    }

    return <PopularCourseSliderClient courses={detailedCourses} />;
  } catch {
    // 조회 실패 시 빈 섹션으로 fallback (메인 페이지 전체가 깨지지 않도록)
    return null;
  }
}