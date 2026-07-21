import Image from 'next/image';
import { buildDownloadHref } from '@/lib/file-url';

interface ResumeProps {
  resumeFileUrl: string;
  mainCareers: string[] | null;
}

export default function Resume({ resumeFileUrl, mainCareers }: ResumeProps) {
  const careers = mainCareers ?? [];

  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
      <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">이력서</h2>
      <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] mb-5">
        <div className="flex items-center gap-2.5">
          <Image src="/ai-recommendation/text-inactive.svg" alt="" width={16} height={16} />
          <p className="text-[13px] font-medium text-[#1E2125]">이력서 파일</p>
        </div>
        <a
          href={buildDownloadHref(resumeFileUrl)}
          className="px-3 py-1.5 rounded-md border border-[#D1D5DB] text-[12px] font-medium text-[#1E2125] hover:bg-white transition-colors"
        >
          다운로드
        </a>
      </div>

      {careers.length > 0 && (
        <>
          <h3 className="text-[13.5px] font-semibold text-[#1E2125] mb-2">주요 이력</h3>
          <ul className="bg-[#F9FAFB] rounded-lg px-4 py-3 flex flex-col gap-1.5">
            {careers.map((item, idx) => (
              <li key={idx} className="text-[13px] text-[#1E2125] flex items-start gap-2">
                <span className="text-[#6A7282] mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
