'use client';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

export default function VolumeControl({
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange,
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onToggleMute}
        aria-label={isMuted || volume === 0 ? '음소거 해제' : '음소거'}
        className="cursor-pointer shrink-0"
      >
        {isMuted || volume === 0 ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white">
            <path d="M3 10v4h4l5 5V5L7 10H3z" fill="white" stroke="none" />
            <path d="M15.5 9.5l5 5m0-5l-5 5" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 7.97v8.05A4.48 4.48 0 0 0 16.5 12z" />
          </svg>
        )}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        aria-label="볼륨 조절"
        className="w-14 sm:w-16 h-1 accent-[#FF5E5E] cursor-pointer"
      />
    </div>
  );
}
