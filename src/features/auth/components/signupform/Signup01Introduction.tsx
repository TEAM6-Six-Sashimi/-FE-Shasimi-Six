'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SignupFormData, SignupStatusData } from '../../types';
import NameField from './fields/Namefield';
import BirthdateField from './fields/Birthdatefield';
import PhoneField from './fields/Phonefield';
import EmailVerifyField from './fields/Emailverifyfield';
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
  const [email_verified, setEmail_verified] = useState(initialStatusData.email_verified);
  const [isIdChecked, setIsIdChecked] = useState(initialStatusData.isIdChecked);
  const [isIdAvailable, setIsIdAvailable] = useState(initialStatusData.isIdAvailable);
  const [isVerificationSent, setIsVerificationSent] = useState(
    initialStatusData.isVerificationSent,
  );
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onNext(formData, {
      email_verified,
      isIdChecked,
      isIdAvailable,
      isVerificationSent,
    });
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.birth_date.trim() !== '' &&
    formData.phone.trim() !== '' &&
    email_verified &&
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

        <EmailVerifyField
          email={formData.email}
          onEmailChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
          verified={email_verified}
          onVerifiedChange={setEmail_verified}
          isVerificationSent={isVerificationSent}
          onVerificationSentChange={setIsVerificationSent}
        />

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
