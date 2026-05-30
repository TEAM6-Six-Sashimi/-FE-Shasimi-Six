"use server";

import { CourseItem, EnrollmentSummary } from "./types";

// TODO: 백엔드 연결 시 실제 API 호출로 교체
export async function getEnrollmentSummary(
  courseIds: string[]
): Promise<EnrollmentSummary> {
  // 임시 mock 데이터 - 백엔드 연결 전까지 사용
  const mockCourses: CourseItem[] = [
    {
      id: "1",
      title: "React 완벽 가이드 - 기초부터 실전까지",
      category: "AI·데이터 > 업무생산성·자동화",
      instructor: "김민준",
      price: 15900,
      thumbnailUrl: "/images/courses/react.jpg",
    },
    {
      id: "2",
      title: "Next.js 14 완벽 정복",
      category: "AI·데이터 > 업무생산성·자동화",
      instructor: "김민준",
      price: 18900,
      thumbnailUrl: "/images/courses/nextjs.jpg",
    },
    {
      id: "3",
      title: "Node.js 백엔드 개발 실전",
      category: "AI·데이터 > 업무생산성·자동화",
      instructor: "김민준",
      price: 14900,
      thumbnailUrl: "/images/courses/nodejs.jpg",
    },
  ];

  const items = courseIds.length > 0
    ? mockCourses.filter((c) => courseIds.includes(c.id))
    : mockCourses;

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const ownedCredits = 50000; // TODO: 실제 유저 크레딧 조회

  return {
    items,
    totalPrice,
    ownedCredits,
    remainingCredits: Math.max(0, ownedCredits - totalPrice),
    shortfallCredits: Math.max(0, totalPrice - ownedCredits),
  };
}

export async function processEnrollment(courseIds: string[]): Promise<{
  success: boolean;
  message: string;
}> {
  // TODO: 실제 결제 처리 로직 연결
  return {
    success: true,
    message: "결제가 완료되었습니다.",
  };
}