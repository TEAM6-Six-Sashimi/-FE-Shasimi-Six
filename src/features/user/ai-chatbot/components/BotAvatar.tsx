import Image from 'next/image';

export default function BotAvatar() {
  return (
    <span className="mr-1.5">
      <Image src="/main/ai-chatbot-2.png" alt="" width={25} height={25} />
    </span>
  );
}
