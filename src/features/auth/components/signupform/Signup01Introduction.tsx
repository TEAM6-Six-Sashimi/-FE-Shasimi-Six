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
                <input type="calendar" />

                <div className="flex"><p>전화번호</p><p>*</p></div>
                <input type="email" />

                <button
                    onClick={onNext}
                    className="w-full rounded-lg bg-[#FF5F5F] text-white hover:bg-[#D14848]">
                    다음
                </button>
            </form>
        </div>
    );
}