import { useEffect, useRef, useState } from 'react';

const CONTROLS_HIDE_DELAY_MS = 3000; // 재생 중 마우스가 안 움직이면 이 시간 후 컨트롤 바를 숨긴다

// 재생 중에는 일정 시간 마우스가 안 움직이면 컨트롤 바를 자동으로 숨긴다.
// 일시정지 상태면 항상 보이게 유지한다.
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
      hideControlsTimerRef.current = setTimeout(() => setShowControls(false), CONTROLS_HIDE_DELAY_MS);
    }
  };

  return { showControls, handleMouseMove };
}
