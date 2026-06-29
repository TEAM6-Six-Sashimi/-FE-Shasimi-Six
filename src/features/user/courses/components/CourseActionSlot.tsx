'use client';

import { CourseDetailFromAPI } from '@/features/user/courses/types';
import type { ActionType } from '@/lib/course-view-options';
import AdminPendingButtons from './sidebar-buttons/AdminPendingButtons';
import AdminApprovedButtons from './sidebar-buttons/AdminApprovedButtons';
import NotOwnedButtons from './sidebar-buttons/NotOwnedButtons';
import StudentOwnedButtons from './sidebar-buttons/StudentOwnedButtons';
import InstructorButtons from './sidebar-buttons/InstructorButtons';

interface CourseActionSlotProps {
  course: CourseDetailFromAPI;
  actionType: ActionType;
}

export default function CourseActionSlot({ course, actionType }: CourseActionSlotProps) {
  switch (actionType) {
    case 'purchase':
      return <NotOwnedButtons course={course} />;

    case 'continue-watching': {
      // 백엔드 강의 상세 응답에는 lastSessionId가 없으므로,
      // 세션 순서상 첫 번째 세션으로 이어보기 진입점을 잡음.
      // (세션별 시청 여부/마지막 위치를 응답에 포함시켜주면 더 정확한 이어보기 지점 계산 가능)
      const sorted = [...course.sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);
      const firstSessionId = sorted[0]?.sessionId;

      return (
        <StudentOwnedButtons
          courseId={course.courseId}
          paymentInfo={{
            paymentId: 0,
            courseId: course.courseId,
            progress: course.progressRate ?? 0,
            lastSessionId: firstSessionId,
            enrolledAt: '',
          }}
        />
      );
    }

    case 'manage':
      return course.viewerType === 'ADMIN' ? (
        <AdminApprovedButtons courseId={course.courseId} />
      ) : (
        <InstructorButtons courseId={course.courseId} />
      );

    case 'approve-reject':
      return <AdminPendingButtons courseId={course.courseId} courseTitle={course.title}/>;

    case 'none':
    default:
      // OWNER의 PENDING/REJECTED 등 — 버튼 대신 상태 안내만
      if (course.status === 'PENDING') {
        return (
          <div className="rounded-lg bg-[#FEFCE8] text-[#854D0E] text-[13px] px-4 py-3 text-center">
            관리자 승인 대기 중인 강의입니다.
          </div>
        );
      }
      if (course.status === 'REJECTED') {
        return (
          <div className="rounded-lg bg-[#FFEBEB] text-[#DC2626] text-[13px] px-4 py-3 text-center">
            반려된 강의입니다.
            {course.rejectReason && (
              <p className="mt-1 text-[12px] text-[#DC2626]/80">{course.rejectReason}</p>
            )}
          </div>
        );
      }
      return null;
  }
}