export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-white">
      <p className="text-[15px] text-[#6A7282]">로딩 중입니다...</p>
      <div className="flex items-center gap-2">
        {[0, 150, 300].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#FF5533]"
            style={{
              animation: 'bounce 0.6s ease-in-out infinite',
              animationDelay: `${delay}ms`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
