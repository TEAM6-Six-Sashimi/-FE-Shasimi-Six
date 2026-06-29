'use client';

interface CheckboxToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  size?: 'sm' | 'md';
}

export default function CheckboxToggle({
  checked,
  onChange,
  label,
  size = 'md',
}: CheckboxToggleProps) {
  const boxSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-[11.5px]' : 'text-[12.5px]';

  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-1.5 ${textSize} text-[#1E2125] cursor-pointer`}
    >
      <span
        className={`${boxSize} shrink-0 rounded-sm flex items-center justify-center border transition-colors
          ${checked ? 'bg-[#FF5E5E] border-[#FF5E5E]' : 'bg-white border-[#D1D5DB]'}`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4L4 7L10 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}