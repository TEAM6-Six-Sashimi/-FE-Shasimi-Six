import Image from "next/image";

interface PortfolioProps {
  portfolioUrl: string;
}

export default function PortfolioSection({ portfolioUrl }: PortfolioProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
      <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">포트폴리오</h2>
      <a
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[13px] text-[#5B8DEE] underline hover:text-[#3B66B9] w-fit"
      >
        <Image src="/chain-link.svg" width={15} height={15} alt="링크" /> {portfolioUrl}
      </a>
    </section>
  );
}
