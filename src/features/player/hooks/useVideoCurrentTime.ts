import { RefObject, useEffect, useState } from 'react';

// video 엘리먼트의 재생 시간을 구독 
// timeupdate(재생 중)와 seeked(탐색 완료) 둘 다 들어야 일시정지 상태도 값이 갱신된다.
export function useVideoCurrentTime(videoRef: RefObject<HTMLVideoElement | null>): number {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = () => setCurrentTime(video.currentTime);
    video.addEventListener('timeupdate', update);
    video.addEventListener('seeked', update);
    return () => {
      video.removeEventListener('timeupdate', update);
      video.removeEventListener('seeked', update);
    };
  }, [videoRef]);

  return currentTime;
}
