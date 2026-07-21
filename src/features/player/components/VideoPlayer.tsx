'use client';

import { RefObject, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  src: string;
  startSeconds: number;
  onEnded: () => void;
  onPlayingChange: (isPlaying: boolean) => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// 볼륨/음소거 설정은 다음 영상·다음 방문에도 유지되도록 저장해둔다
const VOLUME_STORAGE_KEY = 'player:volume';
const MUTED_STORAGE_KEY = 'player:muted';

export default function VideoPlayer({
  videoRef,
  src,
  startSeconds,
  onEnded,
  onPlayingChange,
}: VideoPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const updatePlaying = (playing: boolean) => {
    setIsPlaying(playing);
    onPlayingChange(playing);
  };

  // 마운트 시 저장된 볼륨/음소거 설정 복원
  useEffect(() => {
    const storedVolume = Number(localStorage.getItem(VOLUME_STORAGE_KEY));
    if (Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 1) {
      setVolume(storedVolume);
    }
    setIsMuted(localStorage.getItem(MUTED_STORAGE_KEY) === 'true');
  }, []);

  // 볼륨/음소거 상태가 바뀌거나 새 영상이 로드될 때마다 실제 video 엘리먼트에 반영
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = isMuted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, isMuted, src]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem(MUTED_STORAGE_KEY, String(next));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setVolume(next);
    localStorage.setItem(VOLUME_STORAGE_KEY, String(next));
    // 슬라이더를 올리면 음소거 상태였더라도 자동으로 해제 (일반적인 플레이어 UX)
    if (next > 0 && isMuted) {
      setIsMuted(false);
      localStorage.setItem(MUTED_STORAGE_KEY, 'false');
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      updatePlaying(true);
    } else {
      video.pause();
      updatePlaying(false);
    }
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  // 영상 메타데이터가 로드되면 이어보기 지점으로 시작 위치 설정
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setDuration(video.duration);
    if (startSeconds > 0 && startSeconds < video.duration) {
      video.currentTime = startSeconds;
      setCurrentTime(startSeconds);
    }
  };

  // 마운트 시점에 이미 메타데이터가 있으면 즉시 반영
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1 && Number.isFinite(video.duration)) {
      setDuration(video.duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const handleDurationChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  // 같은 세션(같은 videoUrl)으로 t 값만 바뀌어 재진입한 경우
  // src가 안 바뀌어 loadedmetadata가 다시 발생하지 않으므로, 이미 로드된 영상이면 직접 위치를 옮겨줌
  useEffect(() => {
    const video = videoRef.current;
    if (!video || startSeconds <= 0) return;
    if (video.readyState >= 1 && startSeconds < video.duration) {
      video.currentTime = startSeconds;
      setCurrentTime(startSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSeconds]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onPlay={() => updatePlaying(true)}
        onPause={() => updatePlaying(false)}
        onEnded={onEnded}
        onClick={togglePlay}
      />

      {/* 중앙 재생 버튼 (정지 상태일 때만) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          <span className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* 하단 컨트롤 바 */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 mb-2 accent-[#FF5E5E] cursor-pointer"
        />
        <div className="flex items-center justify-between text-white text-[13px]">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="cursor-pointer">
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="group/volume flex items-center gap-1.5">
              <button
                onClick={toggleMute}
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
                onChange={handleVolumeChange}
                aria-label="볼륨 조절"
                className="w-0 group-hover/volume:w-16 focus:w-16 h-1 accent-[#FF5E5E] cursor-pointer opacity-0 group-hover/volume:opacity-100 focus:opacity-100 transition-all"
              />
            </div>
          </div>
          <button onClick={handleFullscreen} className="cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
