interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  ariaLabel?: string;
  disabled?: boolean;
  // 체크됐을 때 배경/테두리 색
  color?: string;
  // 체크 아이콘 색
  checkColor?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const BOX_SIZE_CLASS: Record<'sm' | 'md', string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

const ICON_SIZE_CLASS: Record<'sm' | 'md', string> = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
};

export default function Checkbox({
  checked,
  onChange,
  id,
  ariaLabel,
  disabled = false,
  color = '#FF5E5E',
  checkColor = 'white',
  size = 'sm',
  className = '',
}: CheckboxProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${BOX_SIZE_CLASS[size]} ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`appearance-none ${BOX_SIZE_CLASS[size]} rounded border border-[#D1D5DB] cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60`}
        style={checked ? { backgroundColor: color, borderColor: color } : undefined}
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={checkColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`pointer-events-none absolute transition-opacity ${ICON_SIZE_CLASS[size]} ${
          checked ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}
