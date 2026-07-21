'use client';

import { RefObject } from 'react';
import { useVideoCurrentTime } from '../hooks/useVideoCurrentTime';

interface TimeDisplayProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  duration: number;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TimeDisplay({ videoRef, duration }: TimeDisplayProps) {
  const currentTime = useVideoCurrentTime(videoRef);

  return (
    <span>
      {formatTime(currentTime)} / {formatTime(duration)}
    </span>
  );
}
