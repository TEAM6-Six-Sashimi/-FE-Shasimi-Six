import { InstructorInfo } from '@/features/user/courses/types';
import { getThumbnailUrl } from '@/lib/thumbnail';
import Image from 'next/image';

interface CourseInstructorSectionProps {
  instructorName: string;
  instructor: InstructorInfo;
}

export default function CourseInstructorSection({
  instructorName,
  instructor,
}: CourseInstructorSectionProps) {
  const profileImageUrl = getThumbnailUrl(instructor.profileImagePath);

  return (
    <div className="flex gap-4">
      <div className="w-16 h-16 rounded-full bg-[#E5E7EB] shrink-0 overflow-hidden flex items-center justify-center text-[#1E2125] font-bold text-[14px] relative">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={`${instructorName} 프로필 사진`}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#6A7282] text-[14px] text-center px-1">
            프로필 사진 없음
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[#1E2125] text-[15px] font-bold">{instructorName}</span>
        <p className="text-[#6A7282] text-[13px] leading-relaxed">{instructor.bio}</p>
        {instructor.mainCareers.length > 0 && (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-[#1E2125] text-[13px] font-semibold">보유 자격증 및 경력</span>
            <ul className="flex flex-col gap-0.5">
              {instructor.mainCareers.map((career) => (
                <li key={career} className="text-[#6A7282] text-[13px]">
                  · {career}
                </li>
              ))}
            </ul>
          </div>
        )}
        {instructor.portfolioUrl && (
          <p className="text-[#6A7282] text-[13px] mt-1">
            포트폴리오 링크: {instructor.portfolioUrl}
          </p>
        )}
      </div>
    </div>
  );
}
