interface InterestsProps {
    onPrev: () => void;
    onSubmit: () => void;
}

export default function Signup02Interests({ onPrev, onSubmit }: InterestsProps) {
    return (
        <div>Signup02. Interests
            <div className="w-full">
                <button
                    onClick={onPrev}
                    className="bg-white rounded-lg border-[#6A7282] text-[#6A7282] hover:bg-[#F9FAFB]">이전</button>
                <button
                    onClick={onSubmit}
                    className="bg-[#FF5F5F] rounded-lg text-white hover:bg-[#D14848]">회원가입 완료</button>
            </div>
        </div>
    );
}