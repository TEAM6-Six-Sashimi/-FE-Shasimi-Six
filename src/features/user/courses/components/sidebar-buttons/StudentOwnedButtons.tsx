'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StudentOwnedButtonsProps {
  courseId: number;
  sessionId?: number;
  lastPositionSeconds: number;
  completed: boolean;
}

export default function StudentOwnedButtons({
  courseId,
  sessionId,
  lastPositionSeconds,
  completed,
}: StudentOwnedButtonsProps) {
  if (!sessionId) return null;

  const query =
    lastPositionSeconds > 0
      ? `?courseId=${courseId}&t=${lastPositionSeconds}`
      : `?courseId=${courseId}`;

  return (
    <Link href={`/player/${sessionId}${query}`}>
      <Button className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer">
        {completed ? '다시보기' : '이어보기'}
      </Button>
    </Link>
  );
}
