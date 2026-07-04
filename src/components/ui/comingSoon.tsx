import Image from 'next/image';

interface ComingSoonProps {
  message?: string;
}

export default function ComingSoon({ message = '추후 추가될 예정입니다.' }: ComingSoonProps) {
  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="max-w-275 mx-auto py-8 px-6">
        <div className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center gap-5 py-32 px-6">
          <Image src="/before-develop-Icon.svg" alt="개발중입니다" width={40} height={40} />
          <p className="text-[15px] text-[#6A7282] font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
