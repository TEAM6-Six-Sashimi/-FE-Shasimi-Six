'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CourseDetailFromAPI, CourseSession } from '@/features/user/courses/types';
import { useToast } from '@/components/ui/ToastContext';
import { AuthSessionError } from '@/features/auth/errors';
import { logoutAction } from '@/features/auth/actions';
import { buildDownloadHref } from '@/lib/file-url';
import { saveSessionProgressAction } from '../actions';
import PlayerTopBar from './PlayerTopBar';
import VideoPlayer from './VideoPlayer';
import CurriculumSidebar from './CurriculumSidebar';

interface PlayerPageProps {
  course: CourseDetailFromAPI;
  courseId: number;
  sessionId: number;
}

export default function PlayerPage({ course, courseId, sessionId }: PlayerPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const sortedSessions = [...course.sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);
  const currentSession: CourseSession | undefined = sortedSessions.find(
    (s) => s.sessionId === sessionId,
  );

  // 이어보기 시작 지점 - 쿼리(t)가 있으면 우선, 없으면 세션 응답의 lastPositionSeconds 사용
  const startSeconds = (() => {
    const queryT = Number(searchParams.get('t'));
    if (!Number.isNaN(queryT) && queryT > 0) return queryT;
    return currentSession?.lastPositionSeconds ?? 0;
  })();

  const loggedOutRef = useRef(false);
  // 미리보기(PUBLIC)는 저장 API 호출 대상이 아님
  const isEnrolled = course.viewerType !== 'PUBLIC';

  const saveProgress = useCallback(
    async (positionSeconds: number): Promise<'success' | 'authError' | 'error'> => {
      if (!isEnrolled) return 'success';
      try {
        await saveSessionProgressAction(courseId, sessionId, Math.floor(positionSeconds));
        return 'success';
      } catch (error) {
        // 세션이 완전히 끊긴 경우 - 안내 후 한 번만 로그아웃 처리
        if (error instanceof AuthSessionError) {
          if (!loggedOutRef.current) {
            loggedOutRef.current = true;
            showToast(error.message, 'alarm');
            await logoutAction();
          }
          return 'authError';
        }
        return 'error';
      }
    },
    [isEnrolled, courseId, sessionId, showToast],
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
  }, []);

  const handleEndLearning = async () => {
    setIsEnding(true);
    const result = await saveProgress(videoRef.current?.currentTime ?? 0);

    if (result === 'success' && isEnrolled) {
      showToast('학습 진행 상황이 저장되었습니다.', 'positive');
    } else if (result === 'error') {
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
      <PlayerTopBar
        isEnding={isEnding}
        endLabel={isEnrolled ? '학습 종료' : '미리보기 종료'}
        onBack={() => router.back()}
        onEndLearning={handleEndLearning}
      />

      {/* 본문 */}
      <div className="max-w-330 mx-auto w-full px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row gap-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* 좌측: 비디오 + 정보 */}
        <div className="flex-1 lg:min-h-0 bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:overflow-y-auto">
          <VideoPlayer
            videoRef={videoRef}
            src={currentSession.videoUrl}
            startSeconds={startSeconds}
            onEnded={() => saveProgress(videoRef.current?.duration ?? 0)}
            onPlayingChange={setIsPlaying}
          />

          {/* 세션 제목 + 강의명 + 자료 다운로드 */}
          <div className="flex items-center justify-between mt-5">
            <div>
              <h1 className="text-[18px] font-bold text-[#1E2125]">{currentSession.title}</h1>
              <p className="text-[13px] text-[#6A7282] mt-1">{course.title}</p>
            </div>
            {currentSession.attachmentUrl && (
              <a
                href={buildDownloadHref(currentSession.attachmentUrl)}
                download={currentSession.attachmentName || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-lg border border-[#FF5E5E] text-[#FF5E5E] text-[13px] font-semibold hover:bg-[#FFEBEB] transition-colors whitespace-nowrap"
              >
                강의 자료 다운로드
              </a>
            )}
          </div>
        </div>

        {/* 우측: 커리큘럼 */}
        <CurriculumSidebar
          sessions={sortedSessions}
          currentSessionId={sessionId}
          courseId={courseId}
        />
      </div>
    </div>
  );
}
