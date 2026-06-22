interface InlineDotsLoadingProps {
  label?: string;
  dotColor?: string;
}

export default function InlineDotsLoading({
  label,
  dotColor = '#6A7282',
}: InlineDotsLoadingProps) {
  return (
    <span className="inline-flex items-center gap-2">
      {label && <span>{label}</span>}
      <span className="flex items-center gap-1">
        {[0, 150, 300].map((delay, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: dotColor,
              animation: 'inline-dots-bounce 0.6s ease-in-out infinite',
              animationDelay: `${delay}ms`,
            }}
          />
        ))}
      </span>
      <style>{`
        @keyframes inline-dots-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </span>
  );
}