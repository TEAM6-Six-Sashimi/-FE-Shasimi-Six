'use client';

import { RefObject } from 'react';
import { useVideoCurrentTime } from '../hooks/useVideoCurrentTime';

interface SeekBarProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  duration: number;
}

// 재생 시간(currentTime)이 초당 여러 번 바뀌므로, 이 값을 쓰는 탐색바만 별도 컴포넌트로
// 분리해서 재생/음량/배속 등 나머지 컨트롤까지 매 tick마다 다시 렌더링되는 걸 막는다.
export default function SeekBar({ videoRef, duration }: SeekBarProps) {
  const currentTime = useVideoCurrentTime(videoRef);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Number(e.target.value);
  };

  return (
    <input
      type="range"
      min={0}
      max={duration || 0}
      value={currentTime}
      onChange={handleSeek}
      className="w-full h-1 mb-2 accent-[#FF5E5E] cursor-pointer"
    />
  );
}
