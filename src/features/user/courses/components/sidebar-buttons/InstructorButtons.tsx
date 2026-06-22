'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface InstructorButtonsProps {
  courseId: number;
}

export default function InstructorButtons({ courseId }: InstructorButtonsProps) {
  return (
    <Link href={`/mycourses-instructor/${courseId}/edit`}>
      <Button className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer">
        수정하기
      </Button>
    </Link>
  );
}