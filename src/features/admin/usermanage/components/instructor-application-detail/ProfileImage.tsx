import { buildDownloadHref } from '@/lib/file-url';

interface ProfileImageProps {
  profileImageUrl: string;
}

export default function ProfileImage({ profileImageUrl }: ProfileImageProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
      <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">프로필 사진</h2>
      <img
        src={buildDownloadHref(profileImageUrl)}
        alt="프로필 사진"
        className="w-20 h-20 rounded-full object-cover"
      />
    </section>
  );
}