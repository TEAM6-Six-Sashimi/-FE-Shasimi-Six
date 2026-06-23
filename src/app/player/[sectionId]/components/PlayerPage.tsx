'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface SessionItem {
  sessionId: number;
  order: number;
  title: string;
  durationLabel: string; // "15:32"
  completed: boolean;
}

interface PlayerPageProps {
  sectionId: string;
}

// TODO: 실제 API 연결 전까지 사용하는 임시 데이터
const MOCK_COURSE_TITLE = '[2026 최신판!] 정보처리기사 필기 완전정복';
const MOCK_SESSION_TITLE = '1-2. DDL 명령어 완전 정복';
const MOCK_VIDEO_URL = '/mock-videos/sample.mp4';
const MOCK_ATTACHMENT_URL = '#';

const MOCK_CURRICULUM: SessionItem[] = [
  {
    sessionId: 1,
    order: 1,
    title: '데이터베이스 기초 이론',
    durationLabel: '15:32',
    completed: false,
  },
  {
    sessionId: 2,
    order: 2,
    title: 'DDL 명령어 완전 정복',
    durationLabel: '22:45',
    completed: false,
  },
  { sessionId: 3, order: 3, title: 'DML 활용 실습', durationLabel: '18:20', completed: false },
  {
    sessionId: 4,
    order: 4,
    title: '소프트웨어 생명 주기',
    durationLabel: '20:15',
    completed: false,
  },
  { sessionId: 5, order: 5, title: '요구사항 분석 기법', durationLabel: '25:30', completed: true },
  { sessionId: 6, order: 6, title: '프로세스 관리', durationLabel: '19:40', completed: true },
  { sessionId: 7, order: 7, title: '메모리 관리 전략', durationLabel: '21:20', completed: false },
];

const CURRENT_SESSION_ID = 2; // 현재 재생 중인 세션(빨간 테두리로 표시)

export default function PlayerPage({ sectionId }: PlayerPageProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
            onClick={() => router.back()}
            className="h-9 px-6 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[13.5px] font-semibold cursor-pointer"
          >
            학습 종료
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
              src={MOCK_VIDEO_URL}
              className="w-full h-full"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
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
              <h1 className="text-[18px] font-bold text-[#1E2125]">{MOCK_SESSION_TITLE}</h1>
              <p className="text-[13px] text-[#6A7282] mt-1">{MOCK_COURSE_TITLE}</p>
            </div>
            <a
              href={MOCK_ATTACHMENT_URL}
              download
              className="px-4 py-2.5 rounded-lg border border-[#FF5E5E] text-[#FF5E5E] text-[13px] font-semibold hover:bg-[#FFEBEB] transition-colors whitespace-nowrap"
            >
              강의 자료 다운로드
            </a>
          </div>
        </div>

        {/* 우측: 커리큘럼 */}
        <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm p-5 flex flex-col lg:min-h-0 lg:overflow-y-auto">
          <h2 className="text-[16px] font-bold text-[#1E2125] mb-4">커리큘럼</h2>
          <div className="flex flex-col gap-2">
            {MOCK_CURRICULUM.map((session) => {
              const isCurrent = session.sessionId === CURRENT_SESSION_ID;
              return (
                <button
                  key={session.sessionId}
                  onClick={() => router.push(`/player/${session.sessionId}`)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-left transition-colors cursor-pointer ${
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
                    {session.order}. {session.title}
                    {session.completed && (
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
                    {session.durationLabel}
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
