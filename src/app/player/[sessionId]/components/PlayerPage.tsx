'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CourseDetailFromAPI, CourseSession } from '@/features/user/courses/types';
import { saveSessionProgressAction } from '@/features/user/courses/actions';
import { useToast } from '@/components/ui/ToastContext';

interface PlayerPageProps {
  course: CourseDetailFromAPI;
  courseId: number;
  sessionId: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerPage({ course, courseId, sessionId }: PlayerPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const sortedSessions = [...course.sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);
  const currentSession: CourseSession | undefined = sortedSessions.find(
    (s) => s.sessionId === sessionId,
  );

  // 이어보기 시작 지점: 쿼리(t)가 있으면 우선, 없으면 세션 응답의 lastPositionSeconds 사용
  const startSeconds = (() => {
    const queryT = Number(searchParams.get('t'));
    if (!Number.isNaN(queryT) && queryT > 0) return queryT;
    return currentSession?.lastPositionSeconds ?? 0;
  })();

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
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

  const saveProgress = useCallback(
    async (positionSeconds: number) => {
      try {
        await saveSessionProgressAction(courseId, sessionId, Math.floor(positionSeconds));
        return true;
      } catch {
        return false;
      }
    },
    [courseId, sessionId],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      saveProgress(videoRef.current?.currentTime ?? 0);
    }, 10000);
    return () => clearInterval(interval);
  }, [isPlaying, saveProgress]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        saveProgress(videoRef.current.currentTime);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndLearning = async () => {
    setIsEnding(true);
    const success = await saveProgress(videoRef.current?.currentTime ?? currentTime);

    if (success) {
      showToast('학습 진행 상황이 저장되었습니다.', 'positive');
    } else {
      showToast('저장에 실패했습니다. 잠시 후 다시 시도해주세요.', 'negative');
    }

    router.back();
    setTimeout(() => router.refresh(), 0);
  };

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-full text-[#6A7282]">
        해당 회차를 찾을 수 없습니다.
      </div>
    );
  }

  if (!currentSession.videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-[#6A7282]">
        <p>이 강의를 재생할 권한이 없습니다.</p>
        <Button
          onClick={() => router.back()}
          className="h-10 px-5 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[13.5px] font-semibold cursor-pointer"
        >
          이전으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="lg:h-full lg:overflow-hidden flex flex-col">
      {/* 상단 바 */}
      <div className="bg-[#1E2125] shrink-0">
        <div className="max-w-340 mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[14px] font-semibold text-white hover:text-[#D1D5DB] transition-colors cursor-pointer"
          >
            <span>←</span> 뒤로가기
          </button>
          <Button
            onClick={handleEndLearning}
            disabled={isEnding}
            className="h-9 px-6 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[13.5px] font-semibold cursor-pointer disabled:opacity-70"
          >
            {isEnding ? '저장 중...' : '학습 종료'}
          </Button>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-330 mx-auto w-full px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row gap-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* 좌측: 비디오 + 정보 */}
        <div className="flex-1 lg:min-h-0 bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:overflow-y-auto">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              src={currentSession.videoUrl}
              className="w-full h-full"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => saveProgress(videoRef.current?.duration ?? currentTime)}
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
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 7.97v8.05A4.48 4.48 0 0 0 16.5 12z" />
                  </svg>
                </div>
                <button onClick={handleFullscreen} className="cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 세션 제목 + 강의명 + 자료 다운로드 */}
          <div className="flex items-center justify-between mt-5">
            <div>
              <h1 className="text-[18px] font-bold text-[#1E2125]">{currentSession.title}</h1>
              <p className="text-[13px] text-[#6A7282] mt-1">{course.title}</p>
            </div>
            {currentSession.attachmentUrl && (
              <a
                href={currentSession.attachmentUrl}
                download={currentSession.attachmentName || undefined}
                className="px-4 py-2.5 rounded-lg border border-[#FF5E5E] text-[#FF5E5E] text-[13px] font-semibold hover:bg-[#FFEBEB] transition-colors whitespace-nowrap"
              >
                강의 자료 다운로드
              </a>
            )}
          </div>
        </div>

        {/* 우측: 커리큘럼 */}
        <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm p-5 flex flex-col lg:min-h-0 lg:overflow-y-auto">
          <h2 className="text-[16px] font-bold text-[#1E2125] mb-4">커리큘럼</h2>
          <div className="flex flex-col gap-2">
            {sortedSessions.map((session, idx) => {
              const isCurrent = session.sessionId === sessionId;
              const isPlayable = !!session.videoUrl;
              const href =
                session.lastPositionSeconds && session.lastPositionSeconds > 0
                  ? `/player/${session.sessionId}?courseId=${courseId}&t=${session.lastPositionSeconds}`
                  : `/player/${session.sessionId}?courseId=${courseId}`;

              return (
                <button
                  key={session.sessionId}
                  onClick={() => isPlayable && router.push(href)}
                  disabled={!isPlayable}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-left transition-colors ${
                    isPlayable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  } ${
                    isCurrent
                      ? 'border border-[#FF5E5E] bg-[#FFEBEB]'
                      : 'border border-transparent hover:bg-[#F9FAFB]'
                  }`}
                >
                  <span
                    className={`flex-1 wrap-break-word text-[13.5px] font-medium ${
                      isCurrent ? 'text-[#FF5E5E] font-extrabold' : 'text-[#1E2125]'
                    }`}
                  >
                    {idx + 1}. {session.title}
                    {session.sessionCompleted && (
                      <span className="text-[11.5px] text-[#9CA3AF] font-normal ml-1">
                        (학습 완료)
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-[12.5px] shrink-0 ml-2 ${
                      isCurrent ? 'text-[#FF5E5E] font-bold' : 'text-[#6A7282]'
                    }`}
                  >
                    {formatDuration(session.durationSeconds)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
