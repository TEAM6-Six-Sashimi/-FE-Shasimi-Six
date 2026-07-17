import Image from 'next/image';

export default function ChatHeader() {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-[#F3F4F6] shrink-0">
      <Image src="/main/ai-chatbot-2.png" alt="" width={35} height={35} className="shrink-0" />
      <div className="min-w-0">
        <h2 className="text-[17px] font-bold text-[#1E2125]">AI 진로 상담사 (핏봇)</h2>
        <p className="text-[12px] text-[#FF5E5E] font-semibold">
          창을 닫으면 대화 내용이 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}
