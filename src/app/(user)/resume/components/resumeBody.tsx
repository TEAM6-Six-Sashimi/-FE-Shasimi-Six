import ResumeMain from '@/features/user/resume/components/ResumeMain';
import ResumeSidebar from '@/features/user/resume/components/ResumeSidebar';

export default function ResumeBody() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex gap-10 items-start">
          <div className="flex-1 min-w-0">
            <ResumeMain />
          </div>
          <div className="w-72 shrink-0 sticky top-4">
            <ResumeSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
