'use client';

import { useState } from 'react';
import ResumeMain from './ResumeMain';
import ResumeSidebar from './ResumeSidebar';
import { SavedResume } from '../types';

interface ResumePageClientProps {
  userName: string;
  userPhone: string;
  userEmail: string;
  savedResume: SavedResume | null;
  isLoggedIn: boolean;
}

export default function ResumePageClient({
  userName,
  userPhone,
  userEmail,
  savedResume,
  isLoggedIn,
}: ResumePageClientProps) {
  const [isSaved, setIsSaved] = useState(!!savedResume);
  const [resumeId, setResumeId] = useState<number | null>(savedResume?.resumeId ?? null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 items-start">
      <div className="min-w-0">
        <ResumeMain
          userName={userName}
          userPhone={userPhone}
          userEmail={userEmail}
          savedResume={savedResume}
          isLoggedIn={isLoggedIn}
          onSavedStateChange={(saved, id) => {
            setIsSaved(saved);
            setResumeId(id);
          }}
        />
      </div>
      <div className="sticky top-4">
        <ResumeSidebar isSaved={isSaved} resumeId={resumeId} />
      </div>
    </div>
  );
}
