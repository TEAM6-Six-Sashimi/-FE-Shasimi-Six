import { CartCourseItem } from '../types';
import { Button } from '@/components/ui/button';

interface CartStickyProps {
  selectedItems: CartCourseItem[];
  onPurchase: () => void;
}

export default function CartSticky({ selectedItems, onPurchase }: CartStickyProps) {
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
      <h2 className="text-[17px] font-bold mt-2 mb-1">결제 요약</h2>

      {/* 선택된 강의 목록 */}
      <div className="flex flex-col gap-2">
        {selectedItems.length === 0 ? (
          <p className="text-[13px] text-[#6A7282] py-2">선택된 강의가 없어요.</p>
        ) : (
          selectedItems.map((item) => (
            <div key={item.courseId} className="flex justify-between items-start gap-2">
              <span className="text-[13px] text-[#6A7282] flex-1 truncate">{item.title}</span>
              <span className="text-[13px] font-medium text-[#1E2125] shrink-0 whitespace-nowrap">
                {item.price.toLocaleString()} 크레딧
              </span>
            </div>
          ))
        )}
      </div>

      <hr className="border-[#D1D5DB]" />

      {/* 총 결제 금액 */}
      <div className="flex justify-between items-center">
        <span className="text-[14px] font-semibold text-[#1E2125]">총 결제 금액</span>
        <span className="text-[20px] font-bold text-[#FF5E5E]">
          {totalPrice.toLocaleString()} 크레딧
        </span>
      </div>

      {/* 구매하기 버튼 */}
      <Button
        type="button"
        onClick={onPurchase}
        disabled={selectedItems.length === 0}
        className={`w-full py-3 h-auto rounded-xl text-[15px] font-bold cursor-pointer ${
          selectedItems.length > 0
            ? 'bg-[#FF5E5E] text-white hover:bg-[#D14848]'
            : 'bg-[#E5E7EB] text-[#6A7282] hover:bg-[#E5E7EB] cursor-not-allowed'
        }`}
      >
        구매하기 ({selectedItems.length}개)
      </Button>
    </div>
  );
}