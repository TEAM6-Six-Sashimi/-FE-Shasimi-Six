'use client';

import { useState, useEffect } from "react";
import { checkLoginIdDuplicate, sendEmailVerification, verifyEmailCode } from "@/services/auth.service";


interface IntroductionProps {
    onNext: (formData: any) => void;
}

export default function Signup01Introduction({ onNext }: IntroductionProps) {

    const inputCls = 'w-full h-9 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';

    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        phone: '',
        email: '',
        login_id: '',
        password: '',
        passwordConfirm: ''
    });

    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [email_verified, setEmail_verified] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');

    const [isIdChecked, setIsIdChecked] = useState(false);
    const [idCheckMessage, setIdCheckMessage] = useState('');
    const [isIdAvailable, setIsIdAvailable] = useState(false);

    const [isPasswordMatched, setIsPasswordMatched] = useState(false);

    // 비밀번호 확인
    useEffect(() => {
        if (!formData.password || !formData.passwordConfirm) {
            setIsPasswordMatched(false);
        } else if (formData.password === formData.passwordConfirm) {
            setIsPasswordMatched(true);
        } else {
            setIsPasswordMatched(false);
        }
    }, [formData.password, formData.passwordConfirm]);

    // 핸들 체인지
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value}));

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
    }

    // 아이디 중복 확인
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
                setIdCheckMessage('사용 가능한 아이디입니다! ✅');
            }
        } catch (error) {
            setIsIdChecked(false);
            setIsIdAvailable(false);
            setIdCheckMessage('서버 통신에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
    };

    // 이메일 인증번호 발송
    const handleEmailSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!formData.email || formData.email.trim() === '') {
            setEmailMessage('이메일 주소를 입력해 주세요.');
            return;
        }
        try {
            setEmailMessage('인증번호를 발송 중입니다... ⏳');
            await sendEmailVerification(formData.email);
            setIsVerificationSent(true); // 인증번호 입력창 띄우기
            setEmailMessage('인증번호가 메일로 발송되었습니다. 확인 후 입력해 주세요.');
        } catch (error) {
            setIsVerificationSent(false);
            setEmailMessage('인증번호 발송에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // 이메일 인증번호 확인
    const handleEmailVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!verificationCode || verificationCode.trim() === '') {
            setEmailMessage('인증번호를 입력해 주세요.');
            return;
        }
        try {
            // 백엔드로 검증 요청 (true/false)
            const isSuccess = await verifyEmailCode(formData.email, verificationCode);
            if (isSuccess) {
                setEmail_verified(true); // 최종 가입 관문 통과
                setEmailMessage('이메일 인증이 완료되었습니다! ✅');
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
        onNext(formData);
    };

    // 다음버튼 활성화 여부 판단
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
                <div className="mb-4">
                    <div className="flex font-medium mb-1"><p className="text-[15px]">이름</p><p className="text-[#FF5F5F]">*</p></div>
                    <input
                        type="text" name="name" value={formData.name} onChange={handleChange} required
                        className={inputCls}/>
                </div>

                <div className="mb-4">
                    <div className="flex font-medium mb-1"><p className="text-[15px]">생년월일</p><p className="text-[#FF5F5F]">*</p></div>
                    <input
                        type="date" name="birth_date" value={formData.birth_date} onChange={handleChange}
                        className={inputCls} required/>
                </div>

                <div className="mb-4">
                    <div className="flex font-medium mb-1"><p className="text-[15px]">전화번호</p><p className="text-[#FF5F5F]">*</p></div>
                    <input
                        type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                        className={inputCls}/>
                </div>

                <div className="mb-4">
                    <div className="flex font-medium mb-1"><p className="text-[15px]">이메일</p><p className="text-[#FF5F5F]">*</p></div>
                    <div className="flex gap-1.5">
                        <input
                            type="email" name="email"
                            value={formData.email} onChange={handleChange}
                            disabled={email_verified} required
                            className={inputCls} />
                        <button
                            type="button"
                            onClick={(e) => handleEmailSend(e)}
                            disabled={email_verified}
                            className={`px-3 py-2 text-[12px] rounded-lg font-medium transition-colors whitespace-nowrap min-w-23.75 ${
                                email_verified 
                                ? "bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed"
                                : "bg-[#FF5F5F] text-white hover:bg-[#D14848] cursor-pointer"
                            }`}>{email_verified ? "인증 완료" : "인증번호 발송"}</button>
                    </div>
                    {isVerificationSent && (
                        <div className="flex gap-2 mt-2">
                            <input 
                                type="text" 
                                placeholder="인증번호 6자리 입력"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                disabled={email_verified}
                                className={inputCls}
                            />
                            <button 
                                type="button" 
                                onClick={(e) => handleEmailVerify(e)}
                                disabled={email_verified}
                                className={`px-4 py-2 text-[12px] rounded-lg font-medium transition-colors whitespace-nowrap min-w-23.75 ${
                                    email_verified 
                                    ? "bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed"
                                    : "bg-[#FF5F5F] text-white hover:bg-[#D14848] cursor-pointer"
                                }`}
                            >
                                {email_verified ? "인증 완료" : "인증 확인"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <div className="flex font-medium mb-1"><p className="text-[15px]">아이디</p><p className="text-[#FF5F5F]">*</p></div>
                    <div className="flex gap-1.5">
                        <input
                            type="text" name="login_id" value={formData.login_id} onChange={handleChange}
                            className={inputCls}/>
                        <button
                            type="button" onClick={(e) => handleIdCheck(e)}
                            disabled={isIdChecked && isIdAvailable}
                            className={`px-4 py-2 text-[12px] rounded-lg font-medium whitespace-nowrap min-w-23.75
                                ${isIdChecked && isIdAvailable
                                ? "bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed"
                                : "bg-[#FF5F5F] text-white hover:bg-[#D14848] cursor-pointer"}`}
                        > {isIdChecked && isIdAvailable ? "확인 완료" : "중복 확인"}
                        </button>
                    </div>
                    <p className="text-[12px] text-[#6A7282] mt-0.5">6자 이상 20자 이하</p>
                    {idCheckMessage && (
                        <p className={`text-xs mt-1 font-medium ${isIdAvailable ? "text-green-600" : "text-red-500"}`}>
                            {idCheckMessage}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <div className="flex font-mediu mb-1"><p className="text-[15px]">비밀번호</p><p className="text-[#FF5F5F]">*</p></div>
                    <input
                        type="text" name="password" value={formData.password} onChange={handleChange} required
                        className={inputCls}/>
                    <p className="text-[12px] text-[#6A7282] mt-0.5">대소문자, 숫자, 특수문자(!@#$%^_) 포함, 8자 이상 16자 이하</p>
                </div>

                <div className="mb-10">
                    <div className="flex font-medium"><p className="text-[15px]">비밀번호 확인</p><p className="text-[#FF5F5F]">*</p></div>
                    <input
                        type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange}
                        className={inputCls}/>
                    {formData.passwordConfirm && (
                        <p className={`text-xs mt-1 font-medium ${isPasswordMatched ? "text-green-600" : "text-red-500"}`}>
                            {isPasswordMatched ? "비밀번호가 일치합니다. ✅" : "비밀번호가 일치하지 않습니다."}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                        isFormValid
                        ? "bg-[#FF5F5F] text-white hover:bg-[#D14848] cursor-pointer"
                        : "bg-[#E5E7EB] text-[#6A7282]"
                    }`}>
                    다 음
                </button>
            </form>
        </div>
    );
}