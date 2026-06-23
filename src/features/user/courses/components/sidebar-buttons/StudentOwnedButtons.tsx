'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PaymentInfo } from '@/features/user/courses/types';

interface StudentOwnedButtonsProps {
  courseId: number;
  paymentInfo: PaymentInfo;
}

export default function StudentOwnedButtons({ courseId, paymentInfo }: StudentOwnedButtonsProps) {
  // 이어보기 → 마지막 시청 세션으로 이동, 없으면 첫 세션으로 (lastSessionId null 대비)
  const continueHref = paymentInfo.lastSessionId
    ? `/courses/learn/${courseId}/${paymentInfo.lastSessionId}`
    : `/courses/learn/${courseId}`;

  return (
    <Link href={continueHref}>
      <Button className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer">
        이어보기
      </Button>
    </Link>
  );
}