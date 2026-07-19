'use client';

import { CourseDetailFromAPI } from '@/features/user/courses/types';
import type { ActionType } from '@/lib/course-view-options';
import AdminPendingButtons from './sidebar-buttons/AdminPendingButtons';
import AdminApprovedButtons from './sidebar-buttons/AdminApprovedButtons';
import NotOwnedButtons from './sidebar-buttons/NotOwnedButtons';
import StudentOwnedButtons from './sidebar-buttons/StudentOwnedButtons';

interface CourseActionSlotProps {
  course: CourseDetailFromAPI;
  actionType: ActionType;
}

export default function CourseActionSlot({ course, actionType }: CourseActionSlotProps) {
  switch (actionType) {
    case 'purchase':
      return <NotOwnedButtons course={course} />;

    case 'continue-watching': {
      // 세션별 sessionCompleted/lastPositionSeconds를 이용해
      // 미완료 세션 중 sessionOrder가 가장 작은 것을 이어볼 지점으로 결정.
      // 모두 완료됐으면 첫 세션(처음부터 다시보기)으로 이동.
      const sorted = [...course.sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);
      const target = sorted.find((s) => !s.sessionCompleted) ?? sorted[0];

      return (
        <StudentOwnedButtons
          courseId={course.courseId}
          sessionId={target?.sessionId}
          lastPositionSeconds={target?.sessionCompleted ? 0 : (target?.lastPositionSeconds ?? 0)}
          progressRate={course.progressRate ?? 0}
          completed={course.completed ?? false}
        />
      );
    }

    case 'manage':
      // 강사 본인 강의(OWNER)의 운영관리 페이지는 없앴으므로, ADMIN만 버튼을 본다.
      return course.viewerType === 'ADMIN' ? (
        <AdminApprovedButtons courseId={course.courseId} />
      ) : null;

    case 'approve-reject':
      return <AdminPendingButtons courseId={course.courseId} courseTitle={course.title} />;

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
