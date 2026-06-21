'use client';

import { useState, useEffect } from 'react';
import {
  checkLoginIdDuplicate,
  sendEmailVerification,
  verifyEmailCode,
} from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { SignupFormData, SignupStatusData } from '../../types';

interface IntroductionProps {
  initialFormData: SignupFormData;
  initialStatusData: SignupStatusData;
  onNext: (updatedForm: SignupFormData, updatedStatus: SignupStatusData) => void;
}

// 유효성 검사 정규식
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_ID_REGEX = /^[a-zA-Z0-9]{6,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

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

  const [verificationCode, setVerificationCode] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  // 입력값의 형식 유효성
  const isEmailFormatValid = EMAIL_REGEX.test(formData.email);
  const isIdFormatValid = LOGIN_ID_REGEX.test(formData.login_id);
  const isPasswordFormatValid = PASSWORD_REGEX.test(formData.password);

  const inputCls = (hasError: boolean) =>
    `w-full h-9 px-4 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none transition-colors ${
      hasError ? 'border-[#FF5F5F]' : 'border-[#D1D5DB] focus:border-[#1E2125]'
    }`;

  // 비밀번호 형식 + 일치 여부 검사
  useEffect(() => {
    if (!formData.password) {
      setPasswordMessage('');
    } else if (!isPasswordFormatValid) {
      setPasswordMessage('비밀번호 형식을 확인해주세요');
    } else {
      setPasswordMessage('');
    }
 
    if (!formData.password || !formData.passwordConfirm) {
      setIsPasswordMatched(false);
    } else if (formData.password === formData.passwordConfirm) {
      setIsPasswordMatched(true);
    } else {
      setIsPasswordMatched(false);
    }
  }, [formData.password, formData.passwordConfirm, isPasswordFormatValid]);

  // 전화번호 자동 하이픈
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: formatPhone(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'login_id') {
      setIsIdChecked(false);
      setIdCheckMessage('');
    }
    if (name === 'email') {
      setEmail_verified(false);
      setIsVerificationSent(false);
      setVerificationCode('');
      setEmailMessage('');
    }
  };

  // 인증번호 입력 8자리 제한
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 8);
    setVerificationCode(value);
  };

  const handleIdCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.login_id || formData.login_id.trim() === '') {
      setIdCheckMessage('아이디를 입력해 주세요.');
      setIsIdAvailable(false);
      return;
    }
    try {
      const isDuplicate = await checkLoginIdDuplicate(formData.login_id);
      if (isDuplicate) {
        setIsIdChecked(false);
        setIsIdAvailable(false);
        setIdCheckMessage('이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.');
      } else {
        setIsIdChecked(true);
        setIsIdAvailable(true);
        setIdCheckMessage('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      setIsIdChecked(false);
      setIsIdAvailable(false);
      setIdCheckMessage('서버 통신에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleEmailSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isEmailFormatValid) {
      setEmailMessage('이메일 형식을 지켜주세요');
      return;
    }
 
    try {
      setEmailMessage('인증번호를 발송 중입니다.');
      await sendEmailVerification(formData.email);
      setIsVerificationSent(true);
      setEmailMessage('인증번호가 메일로 발송되었습니다. 확인 후 입력해 주세요.');
    } catch {
      setIsVerificationSent(false);
      setEmailMessage('인증번호 발송에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleEmailVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.trim() === '') {
      setEmailMessage('인증번호를 입력해 주세요.');
      return;
    }
    try {
      const isSuccess = await verifyEmailCode(formData.email, verificationCode);
      if (isSuccess) {
        setEmail_verified(true);
        setEmailMessage('이메일 인증이 완료되었습니다!');
      } else {
        setEmail_verified(false);
        setEmailMessage('인증번호가 일치하지 않습니다. 다시 확인해 주세요.');
      }
    } catch (error) {
      setEmail_verified(false);
      setEmailMessage('인증 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

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
    isEmailFormatValid &&
    email_verified &&
    isIdFormatValid &&
    isIdChecked &&
    isIdAvailable &&
    isPasswordFormatValid &&
    isPasswordMatched;

    // 이메일 input 에러 상태
  const emailHasError = formData.email !== '' && !isEmailFormatValid;
  const idHasError = formData.login_id !== '' && !isIdFormatValid;
  const passwordHasError = formData.password !== '' && !isPasswordFormatValid;
  const passwordConfirmHasError = formData.passwordConfirm !== '' && !isPasswordMatched;
  const verifyCodeHasError = emailMessage === '인증번호를 확인해주세요';

  // 비밀번호 보이기/숨기기 토글
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  return (
    <div>
      <form onSubmit={handleNextStep}>
        <div className="mb-4">
          <div className="flex mb-1">
            <p className="text-[15px] font-semibold text-[#1E2125] ">이름</p>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputCls(false)}
          />
        </div>

        <div className="mb-4">
          <div className="flex mb-1">
            <p className="text-[15px] font-semibold text-[#1E2125]">생년월일</p>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className={inputCls(false)}
            required
          />
        </div>

        <div className="mb-4">
          <div className="flex mb-1">
            <p className="text-[15px] font-semibold text-[#1E2125]">전화번호</p>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={inputCls(false)}
          />
        </div>

        <div className="mb-4">
          <div className="flex mb-1">
            <p className="text-[15px] font-semibold text-[#1E2125]">이메일</p>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <div className="flex gap-1.5">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={email_verified}
              required
              className={inputCls(emailHasError)}
            />
            <Button
              type="button"
              onClick={(e) => handleEmailSend(e)}
              disabled={email_verified}
              className={`px-3 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 ${
                email_verified
                  ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
                  : isVerificationSent
                    ? 'bg-[#FFEBEB] text-[#FF5E5E] cursor-not-allowed'
                    : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
              }`}
            >
              {email_verified ? '발송됨' : '인증번호 발송'}
            </Button>
          </div>
          {!emailHasError && emailMessage && (
            <p
              className={`text-xs mt-1 font-medium ${
                verifyCodeHasError ? 'text-[#DC2626]' : 'text-[#6A7282]'
              }`}
            >
              {emailMessage}
            </p>
          )}
          {isVerificationSent && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="인증번호 8자리 입력"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                disabled={email_verified}
                className={inputCls(verifyCodeHasError)}
              />
              <Button
                type="button"
                onClick={(e) => handleEmailVerify(e)}
                disabled={email_verified}
                className={`px-4 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 ${
                  email_verified
                    ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
                    : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
                }`}
              >
                {email_verified ? '인증 완료' : '인증 확인'}
              </Button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex mb-1">
            <p className="text-[15px] font-semibold text-[#1E2125]">아이디</p>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              name="login_id"
              value={formData.login_id}
              onChange={handleChange}
              className={inputCls(idHasError)}
            />
            <Button
              type="button"
              onClick={(e) => handleIdCheck(e)}
              disabled={isIdChecked && isIdAvailable}
              className={`px-4 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 ${
                isIdChecked && isIdAvailable
                  ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
                  : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
              }`}
            >
              {isIdChecked && isIdAvailable ? '확인 완료' : '중복 확인'}
            </Button>
          </div>
          <p className="text-[12px] text-[#6A7282] mt-0.5">영문 대소문자, 숫자 포함 6자 이상 20자 이하</p>
          {idHasError ? (
            <p className="text-xs mt-1 font-medium text-[#DC2626]">아이디 형식을 확인해주세요</p>
          ) : (
            idCheckMessage && (
              <p
                className={`text-xs mt-1 font-medium ${isIdAvailable ? 'text-green-600' : 'text-[#DC2626]'}`}
              >
                {idCheckMessage}
              </p>
            )
          )}
        </div>

        <div className="mb-4">
          <div className="flex mb-1">
            <p className="text-[15px] font-semibold text-[#1E2125]">비밀번호</p>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={inputCls(passwordHasError)}
          />
          <p className="text-[12px] text-[#6A7282] mt-0.5">
            대소문자, 숫자, 특수문자(!@#$%^_) 포함, 8자 이상 16자 이하
          </p>
          {passwordHasError && (
            <p className="text-xs mt-1 font-medium text-[#DC2626]">{passwordMessage}</p>
          )}
        </div>

        <div className="mb-10">
          <div className="flex ">
            <p className="text-[15px] font-semibold text-[#1E2125]">비밀번호 확인</p>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <div className="relative">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={`${inputCls(passwordConfirmHasError)} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보이기'}
            >
              <Image
                src={showPasswordConfirm ? '/auth/openeye.svg' : '/auth/closeeye.svg'}
                alt=""
                width={18}
                height={18}
              />
            </button>
          </div>
          {formData.passwordConfirm && (
            <p className={`text-xs mt-1 font-medium ${isPasswordMatched ? '' : 'text-[#DC2626]'}`}>
              {isPasswordMatched ? '' : '비밀번호가 일치하지 않습니다.'}
            </p>
          )}
        </div>

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
