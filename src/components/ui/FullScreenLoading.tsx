interface FullScreenLoadingProps {
  message?: string;
}

export default function FullScreenLoading({
  message = '처리 중입니다...',
}: FullScreenLoadingProps) {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 bg-white/60">
      <p className="text-[15px] text-[#6A7282]">{message}</p>
      <div className="flex items-center gap-2">
        {[0, 150, 300].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#FF5533]"
            style={{
              animation: 'fullscreen-loading-bounce 0.6s ease-in-out infinite',
              animationDelay: `${delay}ms`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes fullscreen-loading-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
