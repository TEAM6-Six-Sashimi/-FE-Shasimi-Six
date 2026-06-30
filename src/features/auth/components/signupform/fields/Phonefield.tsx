'use client'

interface PhoneFieldProps {
    value: string;
    onChange: (value: string) => void;
}

// 전화번호 자동 하이픈
function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export default function PhoneField({ value, onChange }: PhoneFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(formatPhone(e.target.value));
    }

    return (
        <div className="mb-4">
          <div className="flex mb-1">
            <p className="text-[15px] font-semibold text-[#1E2125]">전화번호</p>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <input
            type="tel"
            name="phone"
            value={value}
            onChange={handleChange}
            required
            className="w-full h-9 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
        </div>
    )
}