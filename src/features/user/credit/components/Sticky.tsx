interface StickyProps {
    currentCredit: number;
    chargeAmount: number;
    afterCredit: number;
}

export default function Sticky({ currentCredit, chargeAmount, afterCredit }: StickyProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <h2 className="text-[17px] font-bold mt-2 mb-3">충전 요약</h2>
                {/* 현재 보유 크레딧 */}
                <div className="flex justify-between items-center">
                    <span className="text-[13.5px] text-[#6A7282]">현재 보유 크레딧</span>
                    <span className="text-[14px] font-semibold text-[#1E2125]">
                        {currentCredit.toLocaleString()}
                    </span>
                </div>
 
                {/* 충전 금액 */}
                <div className="flex justify-between items-center">
                    <span className="text-[13.5px] text-[#6A7282]">충전 금액</span>
                    <span className={`text-[14px] font-semibold ${chargeAmount > 0 ? 'text-[#FF5E5E]' : 'text-[#6A7282]'}`}>
                        {chargeAmount > 0 ? `+${chargeAmount.toLocaleString()}` : '-'}
                    </span>
                </div>
 
                <hr className="border-[#D1D5DB]" />
 
                {/* 충전 후 예상 잔액 */}
                <div className="flex justify-between items-center">
                    <span className="text-[15px] font-semibold text-[#1E2125]">충전 후 예상 잔액</span>
                    <span className="text-[20px] font-bold text-[#1E2125]">
                        {afterCredit.toLocaleString()}
                    </span>
                </div>
            </div>

            <button
                type="button"
                disabled={chargeAmount <= 0}
                className={`w-full py-3 rounded-lg text-[15px] font-medium transition-colors duration-150
                    ${chargeAmount > 0
                        ? 'bg-[#FF5E5E] text-white hover:bg-[#D14848] cursor-pointer'
                        : 'bg-[#E5E7EB] text-[#6A7282]'
                    }`}
            >
                충전하기
            </button>
        </div>
    );
}