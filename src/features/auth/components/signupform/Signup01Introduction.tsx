'use client';

import { useState, useEffect } from "react";

interface IntroductionProps {
    onNext: () => void;
}

export default function Signup01Introduction({ onNext }: IntroductionProps) {
    return (
        <div>
            <form>
                <div className="flex"><p>이름</p><p>*</p></div>
                <input type="text" />

                <div className="flex"><p>성별</p><p>*</p></div>
                <div><input type="radio" /> 남성 <input type="radio" /> 여성</div>

                <div className="flex"><p>생년월일</p><p>*</p></div>
                <input type="date" />

                <div className="flex"><p>전화번호</p><p>*</p></div>
                <input type="number" />

                <div className="flex"><p>이메일</p><p>*</p></div>
                <div><input type="email" /><button>인증번호 발송</button></div>

                <div className="flex"><p>아이디</p><p>*</p></div>
                <div><input type="text" /><button>중복 확인</button></div>

                <div className="flex"><p>비밀번호</p><p>*</p></div>
                <input type="password" />
                <p>대소문자, 숫자, 특수문자(!@#$%^_) 포함, 8자 이상 16자 이하</p>

                <div className="flex"><p>비밀번호 확인</p><p>*</p></div>
                <input type="password" />

                <button
                    onClick={onNext}
                    className="w-full rounded-lg bg-[#FF5F5F] text-white hover:bg-[#D14848]">
                    다음
                </button>
            </form>
        </div>
    );
}