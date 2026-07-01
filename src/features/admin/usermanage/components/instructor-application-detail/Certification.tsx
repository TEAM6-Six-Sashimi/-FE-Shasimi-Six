import { CertificationFile } from '@/features/admin/usermanage/types';
import { buildDownloadHref } from '@/lib/file-url';

interface CertificationsProps {
  certifications: CertificationFile[] | null;
}

export default function Certifications({ certifications }: CertificationsProps) {
  const fieldLabelCls = 'text-[11.5px] text-[#9CA3AF] mb-1';
  const list = certifications ?? [];

  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
      <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">보유 자격증</h2>
      {list.length === 0 ? (
        <p className="text-[13px] text-[#6A7282]">등록된 자격증이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={fieldLabelCls}>자격증명</p>
            <ul className="flex flex-col gap-2 mt-1">
              {list.map((cert, idx) => (
                <li
                  key={idx}
                  className="h-10 flex items-center px-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[13px] text-[#1E2125]"
                >
                  {cert.certificationName}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={fieldLabelCls}>발급 기관 / 파일</p>
            <ul className="flex flex-col gap-2 mt-1">
              {list.map((cert, idx) => (
                <li
                  key={idx}
                  className="h-10 flex items-center justify-between px-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[13px] text-[#1E2125]"
                >
                  <span>{cert.issuedBy}</span>
                  <a
                    href={buildDownloadHref(cert.fileUrl)}
                    className="text-[12px] text-[#5B8DEE] hover:underline"
                  >
                    다운로드
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
