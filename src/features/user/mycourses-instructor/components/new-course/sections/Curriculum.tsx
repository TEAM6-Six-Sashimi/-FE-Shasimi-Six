'use client';

import { Button } from '@/components/ui/button';
import SessionItem from './SessionItem';
import type { Session } from '@/features/user/mycourses-instructor/types';

export const SESSION_MAX_COUNT = 50;

interface CurriculumSectionProps {
  sessions: Session[];
  isLoading: boolean;
  error?: string;
  onUpdateSession: <K extends keyof Session>(id: number, key: K, value: Session[K]) => void;
  onRemoveSession: (id: number) => void;
  onAddSession: () => void;
  onSessionUploadingChange: (id: number, value: boolean) => void;
}

export default function CurriculumSection({
  sessions,
  isLoading,
  error,
  onUpdateSession,
  onRemoveSession,
  onAddSession,
  onSessionUploadingChange,
}: CurriculumSectionProps) {
  return (
    <section aria-labelledby="curriculum-heading" className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
        <h2 id="curriculum-heading" className="text-[16px] font-bold text-[#1E2125]">
          커리큘럼
        </h2>
        <span className="text-[12px] text-[#9CA3AF]">
          {sessions.length}/{SESSION_MAX_COUNT}
        </span>
      </div>

      <ul className="flex flex-col gap-4">
        {sessions.map((session, idx) => (
          <SessionItem
            key={session.id}
            session={session}
            index={idx}
            canRemove={sessions.length > 1}
            onUpdate={onUpdateSession}
            onRemove={onRemoveSession}
            onUploadingChange={(value) => onSessionUploadingChange(session.id, value)}
          />
        ))}
      </ul>

      {error && <p className="text-[12px] text-[#FF5E5E]">{error}</p>}

      <Button
        type="button"
        onClick={onAddSession}
        disabled={isLoading || sessions.length >= SESSION_MAX_COUNT}
        className="w-full h-11 rounded-lg border border-dashed border-[#D1D5DB] bg-transparent text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] hover:bg-transparent flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        <span className="text-[16px]">+</span> 회차 추가
      </Button>
    </section>
  );
}
