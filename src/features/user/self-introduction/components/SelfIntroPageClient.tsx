'use client';

import { useState } from 'react';
import SelfIntroMain from './SelfIntroMain';
import SelfIntroSidebar from './SelfIntroSidebar';
import { CoverLetterResponse, CoverLetterReviewDetail } from '../types';

interface SelfIntroPageClientProps {
  userName: string;
  userPhone: string;
  userEmail: string;
  savedCoverLetter: CoverLetterResponse | null;
  latestCoverLetterReview: CoverLetterReviewDetail | null;
  isLoggedIn: boolean;
}

export default function SelfIntroPageClient({
  userName,
  userPhone,
  userEmail,
  savedCoverLetter,
  latestCoverLetterReview,
  isLoggedIn,
}: SelfIntroPageClientProps) {
  const [isDirty, setIsDirty] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 items-start">
      <div className="min-w-0">
        <SelfIntroMain
          userName={userName}
          userPhone={userPhone}
          userEmail={userEmail}
          savedCoverLetter={savedCoverLetter}
          isLoggedIn={isLoggedIn}
          onDirtyStateChange={setIsDirty}
        />
      </div>
      <div className="sticky top-4">
        <SelfIntroSidebar
          initialReview={latestCoverLetterReview}
          isDirty={isDirty}
          isSaved={savedCoverLetter !== null}
        />
      </div>
    </div>
  );
}
