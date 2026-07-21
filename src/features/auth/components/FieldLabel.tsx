export type FieldLabelVariant = 'semibold' | 'medium';

interface FieldLabelProps {
  label: string;
  variant?: FieldLabelVariant;
}

// 회원가입: semibold'
// 아이디 찾기/비밀번호 찾기: 'medium'
export default function FieldLabel({ label, variant = 'medium' }: FieldLabelProps) {
  if (variant === 'semibold') {
    return (
      <div className="flex mb-1">
        <p className="text-[15px] font-semibold text-[#1E2125]">{label}</p>
        <p className="text-[#FF5F5F]">*</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <label className="block font-medium mb-2 text-[15px]">{label}</label>
      <p className="text-[#FF5F5F]">*</p>
    </div>
  );
}
