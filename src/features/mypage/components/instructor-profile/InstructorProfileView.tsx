import Image from 'next/image';
import { getThumbnailUrl } from '@/lib/thumbnail';
import { InstructorProfile } from '../../types';

interface InstructorProfileViewProps {
  profile: InstructorProfile;
}

function toExternalHref(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function InstructorProfileView({ profile }: InstructorProfileViewProps) {
  const profileImageUrl = getThumbnailUrl(profile.profileImageUrl);
  const mainCareers = profile.mainCareers ?? [];

  return (
    <div className="flex flex-col gap-5">
      <section className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
        <div className="flex items-center gap-4 pb-5 border-b border-[#E5E7EB]">
          <div className="w-16 h-16 rounded-full bg-[#E5E7EB] shrink-0 overflow-hidden flex items-center justify-center text-[#1E2125] font-bold text-[14px] relative">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={`${profile.name} 프로필 사진`}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <Image src="/chat/basic-profile-gray.svg" alt="" width={30} height={30} />
            )}
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#1E2125]">{profile.name}</p>
            <p className="text-[13px] text-[#6A7282] mt-0.5">강사</p>
          </div>
        </div>

        <div className="pt-5">
          <h2 className="text-[15px] font-bold text-[#1E2125] mb-2">소개</h2>
          <p className="text-[13.5px] text-[#1E2125] leading-relaxed whitespace-pre-wrap">
            {profile.bio}
          </p>
        </div>

        {mainCareers.length > 0 && (
          <div className="pt-6">
            <h2 className="text-[15px] font-bold text-[#1E2125] mb-2">주요 이력</h2>
            <ul className="flex flex-col gap-1.5">
              {mainCareers.map((career, idx) => (
                <li key={idx} className="text-[13.5px] text-[#1E2125] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[#FF5E5E] shrink-0" />
                  {career}
                </li>
              ))}
            </ul>
          </div>
        )}

        {profile.portfolioUrl && (
          <div className="pt-5">
            <h2 className="text-[15px] font-bold text-[#1E2125] mb-3">포트폴리오</h2>
            <a
              href={toExternalHref(profile.portfolioUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13.5px] text-[#FF5E5E] hover:underline w-fit"
            >
              <Image src="/chain-link.svg" width={15} height={15} alt="링크" />
              {profile.portfolioUrl}
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
