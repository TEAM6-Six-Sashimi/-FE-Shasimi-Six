import { RefObject, useEffect, useState } from 'react';

// 볼륨/음소거/배속 설정은 다음 영상·다음 방문에도 유지되도록 저장해둔다
const VOLUME_STORAGE_KEY = 'player:volume';
const MUTED_STORAGE_KEY = 'player:muted';
const PLAYBACK_RATE_STORAGE_KEY = 'player:playbackRate';
export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

// localStorage 접근이 막힌 환경(서드파티 쿠키 차단 등)에서도 재생 자체는 계속되도록 조용히 무시
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장 실패해도 재생 자체엔 영향 없으므로 무시
  }
}

// 볼륨/음소거/배속 상태와 localStorage 저장, video 엘리먼트 반영을 한데 묶는다.
export function usePlayerSettings(videoRef: RefObject<HTMLVideoElement | null>, src: string) {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // 마운트 시 저장된 설정 복원 (SSR에는 localStorage가 없어 마운트 후에 읽는다)
  useEffect(() => {
    // getItem은 저장된 값이 없으면 null을 반환하는데, Number(null)은 NaN이 아니라 0이라
    // null 여부를 먼저 확인하지 않으면 최초 방문자의 볼륨이 항상 0(음소거)으로 초기화된다.
    const storedVolumeRaw = safeGetItem(VOLUME_STORAGE_KEY);
    if (storedVolumeRaw !== null) {
      const storedVolume = Number(storedVolumeRaw);
      if (Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 1) {
        setVolume(storedVolume);
      }
    }

    setIsMuted(safeGetItem(MUTED_STORAGE_KEY) === 'true');

    const storedRateRaw = safeGetItem(PLAYBACK_RATE_STORAGE_KEY);
    if (storedRateRaw !== null) {
      const storedRate = Number(storedRateRaw);
      if (PLAYBACK_RATES.includes(storedRate)) {
        setPlaybackRate(storedRate);
      }
    }
  }, []);

  // 볼륨/음소거/배속이 바뀌거나 새 영상이 로드될 때마다 실제 video 엘리먼트에 반영
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = isMuted;
    video.playbackRate = playbackRate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, isMuted, playbackRate, src]);

  // 함수형 업데이트를 써야 한다 - 키보드 단축키 쪽 핸들러는 마운트 시 한 번만 등록되는
  // 클로저라 isMuted를 직접 읽으면 항상 마운트 시점의 값(false)만 보고 매번 "음소거 켜기"로만
  // 동작한다(꺼지지 않음). setIsMuted의 콜백 인자로 최신 값을 받아야 토글이 제대로 된다.
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      safeSetItem(MUTED_STORAGE_KEY, String(next));
      return next;
    });
  };

  const handleVolumeChange = (nextVolume: number) => {
    setVolume(nextVolume);
    safeSetItem(VOLUME_STORAGE_KEY, String(nextVolume));
    // 슬라이더를 올리면 음소거 상태였더라도 자동으로 해제 (일반적인 플레이어 UX)
    if (nextVolume > 0 && isMuted) {
      setIsMuted(false);
      safeSetItem(MUTED_STORAGE_KEY, 'false');
    }
  };

  // 키보드 ↑/↓ 단축키용 - 현재 볼륨 기준 상대 조절
  const adjustVolume = (delta: number) => {
    setVolume((v) => {
      const next = Math.min(1, Math.max(0, Math.round((v + delta) * 100) / 100));
      safeSetItem(VOLUME_STORAGE_KEY, String(next));
      return next;
    });
    if (delta > 0) setIsMuted(false);
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    safeSetItem(PLAYBACK_RATE_STORAGE_KEY, String(rate));
  };

  return {
    volume,
    isMuted,
    playbackRate,
    toggleMute,
    handleVolumeChange,
    adjustVolume,
    changePlaybackRate,
  };
}
