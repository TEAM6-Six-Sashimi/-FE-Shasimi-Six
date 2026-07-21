import { useEffect, useRef, useState } from 'react';

const CONTROLS_HIDE_DELAY_MS = 3000; // 재생 중 마우스가 안 움직이면 이 시간 후 컨트롤 바를 숨김

// 일시정지 상태면 항상 보이게 유지
export function useAutoHideControls(isPlaying: boolean) {
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);

    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    hideControlsTimerRef.current = setTimeout(() => setShowControls(false), CONTROLS_HIDE_DELAY_MS);
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(
        () => setShowControls(false),
        CONTROLS_HIDE_DELAY_MS,
      );
    }
  };

  return { showControls, handleMouseMove };
}
