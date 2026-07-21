import { InstructorInfo } from '@/features/user/courses/types';
import { getThumbnailUrl } from '@/lib/thumbnail';
import Image from 'next/image';

interface CourseInstructorSectionProps {
  instructorName: string;
  instructor: InstructorInfo;
}

// 프로토콜(https://) 없이 저장된 링크도 외부 링크로 정상 연결되도록 보정
const toExternalHref = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

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
          <Image src="/chat/basic-profile-gray.svg" alt="" width={30} height={30} />
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
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-[#1E2125] text-[13px] font-semibold">포트폴리오 링크</span>
            <a
              href={toExternalHref(instructor.portfolioUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF5E5E] text-[13px] font-medium hover:underline w-fit"
            >
              {instructor.portfolioUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
