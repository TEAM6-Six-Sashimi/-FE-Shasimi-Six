import { Button } from '@/components/ui/button';

interface PlayerTopBarProps {
  isEnding: boolean;
  onBack: () => void;
  onEndLearning: () => void;
}

export default function PlayerTopBar({ isEnding, onBack, onEndLearning }: PlayerTopBarProps) {
  return (
    <div className="bg-[#1E2125] shrink-0">
      <div className="max-w-340 mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] font-semibold text-white hover:text-[#D1D5DB] transition-colors cursor-pointer"
        >
          <span>←</span> 뒤로가기
        </button>
        <Button
          onClick={onEndLearning}
          disabled={isEnding}
          className="h-9 px-6 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[13.5px] font-semibold cursor-pointer disabled:opacity-70"
        >
          {isEnding ? '저장 중...' : '학습 종료'}
        </Button>
      </div>
    </div>
  );
}
