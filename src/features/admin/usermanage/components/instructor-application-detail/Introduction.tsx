interface IntroductionProps {
  bio: string;
  motivationLetter: string;
}

export default function Introduction({ bio, motivationLetter }: IntroductionProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
      <article>
        <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">자기소개</h2>
        <p className="text-[13.5px] text-[#1E2125] leading-relaxed bg-[#F9FAFB] rounded-lg px-4 py-3 whitespace-pre-wrap">
          {bio}
        </p>
      </article>

      <article className="mt-6">
        <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">지원 동기</h2>
        <p className="text-[13.5px] text-[#1E2125] leading-relaxed bg-[#F9FAFB] rounded-lg px-4 py-3 whitespace-pre-wrap">
          {motivationLetter}
        </p>
      </article>
    </section>
  );
}