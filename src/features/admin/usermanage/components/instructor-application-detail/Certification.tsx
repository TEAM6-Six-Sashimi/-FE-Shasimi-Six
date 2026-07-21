import Image from 'next/image';
import { CertificationFile } from '@/features/admin/usermanage/types';
import { buildDownloadHref } from '@/lib/file-url';

interface CertificationsProps {
  certifications: CertificationFile[] | null;
}

// 다운로드 URL - key 파라미터에서 실제 파일명을 뽑아냄
const fileNameFromUrl = (url: string) => {
  try {
    const [path, query = ''] = url.split('?');
    const key = new URLSearchParams(query).get('key');
    return decodeURIComponent((key ?? path).split('/').pop() || '파일');
  } catch {
    return '파일';
  }
};

const fileExtFromUrl = (url: string) =>
  fileNameFromUrl(url).split('.').pop()?.toUpperCase() || 'FILE';

function FileRow({ url, name }: { url: string; name: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
      <div className="flex items-center gap-2.5">
        <Image src="/ai-recommendation/text-inactive.svg" alt="" width={16} height={16} />
        <div>
          <p className="text-[13px] font-medium text-[#1E2125]">{name}</p>
          <p className="text-[11px] text-[#9CA3AF]">{fileExtFromUrl(url)}</p>
        </div>
      </div>
      <a
        href={url}
        download={name}
        className="px-3 py-1.5 rounded-md border border-[#D1D5DB] text-[12px] font-medium text-[#1E2125] hover:bg-white transition-colors"
      >
        다운로드
      </a>
    </div>
  );
}

export default function Certifications({ certifications }: CertificationsProps) {
  const list = certifications ?? [];

  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
      <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">보유 자격증</h2>
      {list.length === 0 ? (
        <p className="text-[13px] text-[#6A7282]">등록된 자격증이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((cert, idx) => (
            <FileRow
              key={idx}
              url={buildDownloadHref(cert.fileUrl)}
              name={fileNameFromUrl(cert.fileUrl)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
