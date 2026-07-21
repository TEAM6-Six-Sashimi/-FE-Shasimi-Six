import { RefObject, useEffect } from 'react';

interface UseVideoKeyboardShortcutsParams {
  videoRef: RefObject<HTMLVideoElement | null>;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onAdjustVolume: (delta: number) => void;
  onFullscreen: () => void;
}

// 키보드 단축키: Space(재생/일시정지), ←/→(±5초 탐색), ↑/↓(볼륨), M(음소거), F(전체화면)
export function useVideoKeyboardShortcuts({
  videoRef,
  onTogglePlay,
  onToggleMute,
  onAdjustVolume,
  onFullscreen,
}: UseVideoKeyboardShortcutsParams) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime = Math.min(
            video.duration || video.currentTime,
            video.currentTime + 5,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          onAdjustVolume(0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          onAdjustVolume(-0.05);
          break;
        case 'm':
        case 'M':
          onToggleMute();
          break;
        case 'f':
        case 'F':
          onFullscreen();
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
