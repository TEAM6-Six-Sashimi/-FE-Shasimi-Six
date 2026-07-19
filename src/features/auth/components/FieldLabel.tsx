export type FieldLabelVariant = 'semibold' | 'medium';

interface FieldLabelProps {
  label: string;
  variant?: FieldLabelVariant;
}

// 회원가입 자체 필드(이름/아이디 등)는 'semibold' 스타일을,
// 아이디 찾기/비밀번호 찾기 자체 필드는 'medium' 스타일을 쓰고 있어서,
// 공용 필드(EmailVerifyField/PasswordFields)가 페이지에 맞는 스타일을 고를 수 있게 한다.
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
