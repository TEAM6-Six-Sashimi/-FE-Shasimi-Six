import SelfIntroMain from './SelfIntroMain';
import SelfIntroSidebar from './SelfIntroSidebar';
import { CoverLetterResponse } from '../types';

interface SelfIntroPageClientProps {
  userName: string;
  userPhone: string;
  userEmail: string;
  savedCoverLetter: CoverLetterResponse | null;
  isLoggedIn: boolean;
}

export default function SelfIntroPageClient({
  userName,
  userPhone,
  userEmail,
  savedCoverLetter,
  isLoggedIn,
}: SelfIntroPageClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 items-start">
      <div className="min-w-0">
        <SelfIntroMain
          userName={userName}
          userPhone={userPhone}
          userEmail={userEmail}
          savedCoverLetter={savedCoverLetter}
          isLoggedIn={isLoggedIn}
        />
      </div>
      <div className="sticky top-4">
        <SelfIntroSidebar />
      </div>
    </div>
  );
}
