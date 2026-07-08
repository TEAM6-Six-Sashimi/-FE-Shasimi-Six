'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StudentOwnedButtonsProps {
  courseId: number;
  sessionId?: number;
  lastPositionSeconds: number;
  /** 강의 전체 진행률 - 0이면 아직 한 번도 수강하지 않은 상태(수강하기 문구용) */
  progressRate: number;
  completed: boolean;
}

export default function StudentOwnedButtons({
  courseId,
  sessionId,
  lastPositionSeconds,
  progressRate,
  completed,
}: StudentOwnedButtonsProps) {
  if (!sessionId) return null;

  const query =
    lastPositionSeconds > 0
      ? `?courseId=${courseId}&t=${lastPositionSeconds}`
      : `?courseId=${courseId}`;

  // 완강: 다시보기 / 진행 중(어떤 세션이든 진행한 적 있음): 이어보기 / 진행 이력 없음: 수강하기
  const label = completed ? '다시보기' : progressRate > 0 ? '이어보기' : '수강하기';

  return (
    <Link href={`/player/${sessionId}${query}`}>
      <Button className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer">
        {label}
      </Button>
    </Link>
  );
}
