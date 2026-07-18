'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { sendEmailVerification, verifyEmailCode } from '@/services/auth.service';
import { useEmailVerification } from '../../hooks/useEmailVerification';
import { SignupFormData, SignupStatusData } from '../../types';
import EmailVerifyField from '../EmailVerifyField';
import NameField from './fields/Namefield';
import BirthdateField from './fields/Birthdatefield';
import PhoneField from './fields/Phonefield';
import LoginIdField from './fields/Idfield';
import PasswordFields from './fields/Passwordfield';

interface IntroductionProps {
  initialFormData: SignupFormData;
  initialStatusData: SignupStatusData;
  onNext: (updatedForm: SignupFormData, updatedStatus: SignupStatusData) => void;
}

export default function Signup01Introduction({
  initialFormData,
  initialStatusData,
  onNext,
}: IntroductionProps) {
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [isIdChecked, setIsIdChecked] = useState(initialStatusData.isIdChecked);
  const [isIdAvailable, setIsIdAvailable] = useState(initialStatusData.isIdAvailable);
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  const verification = useEmailVerification({
    sendCode: (email) => sendEmailVerification(email),
    verifyCode: (email, code) => verifyEmailCode(email, code),
    initialEmail: initialFormData.email,
    initialIsSent: initialStatusData.isVerificationSent,
    initialIsVerified: initialStatusData.email_verified,
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onNext(
      { ...formData, email: verification.email },
      {
        email_verified: verification.isVerified,
        isIdChecked,
        isIdAvailable,
        isVerificationSent: verification.isSent,
      },
    );
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.birth_date.trim() !== '' &&
    formData.phone.trim() !== '' &&
    verification.isVerified &&
    isIdChecked &&
    isIdAvailable &&
    isPasswordMatched;

  return (
    <div>
      <form onSubmit={handleNextStep}>
        <NameField
          value={formData.name}
          onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
        />

        <BirthdateField
          value={formData.birth_date}
          onChange={(value) => setFormData((prev) => ({ ...prev, birth_date: value }))}
        />

        <PhoneField
          value={formData.phone}
          onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
        />

        <EmailVerifyField verification={verification} labelVariant="semibold" />

        <LoginIdField
          value={formData.login_id}
          onChange={(value) => setFormData((prev) => ({ ...prev, login_id: value }))}
          isChecked={isIdChecked}
          onCheckedChange={setIsIdChecked}
          isAvailable={isIdAvailable}
          onAvailableChange={setIsIdAvailable}
        />

        <PasswordFields
          password={formData.password}
          onPasswordChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
          passwordConfirm={formData.passwordConfirm}
          onPasswordConfirmChange={(value) =>
            setFormData((prev) => ({ ...prev, passwordConfirm: value }))
          }
          onMatchedChange={setIsPasswordMatched}
        />

        <Button
          type="submit"
          disabled={!isFormValid}
          className={`w-full px-4 py-2 h-auto font-medium transition-colors cursor-pointer ${
            isFormValid
              ? 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
              : 'bg-[#E5E7EB] text-[#6A7282] hover:bg-[#E5E7EB]'
          }`}
        >
          다 음
        </Button>
      </form>
    </div>
  );
}
