'use client';

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NameField({ value, onChange }: NameFieldProps) {
  const inputCls =
    'w-full h-9 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';

  return (
    <div className="mb-4">
      <div className="flex mb-1">
        <p className="text-[15px] font-semibold text-[#1E2125] ">이름</p>
        <p className="text-[#FF5F5F]">*</p>
      </div>
      <input
        type="text"
        name="name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={inputCls}
      />
    </div>
  );
}
