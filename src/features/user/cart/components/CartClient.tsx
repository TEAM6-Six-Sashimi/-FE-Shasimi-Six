'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CartContent from '@/features/user/cart/components/CartContent';
import CartSticky from '@/features/user/cart/components/CartSticky';
import { CartCourseItem } from '@/features/user/cart/types';
import { deleteCartItemsAction } from '@/features/user/cart/actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

interface CartClientProps {
  initialItems: CartCourseItem[];
}

export default function CartClient({ initialItems }: CartClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<CartCourseItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialItems.filter((i) => i.selected).map((i) => i.courseId),
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 개별 선택/해제
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // 전체 선택/해제
  const handleToggleAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.courseId));
    }
  };

  // 선택 삭제 확인 모달
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setShowDeleteModal(true);
  };

  // 실제 삭제 실행
  const handleConfirmDelete = async () => {
    try {
      const cartItemIds = items
        .filter((i) => selectedIds.includes(i.courseId))
        .map((i) => i.cartItemId);

      await deleteCartItemsAction(cartItemIds);

      setItems((prev) => prev.filter((i) => !selectedIds.includes(i.courseId)));
      setSelectedIds([]);
    } catch (e) {
      console.error('삭제 실패:', e);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // 구매하기 → 결제 페이지로 이동
  const handlePurchase = () => {
    const ids = selectedItems.map((i) => i.courseId).join(',');
    router.push(`/enrollments?courseIds=${ids}`);
  };

  const selectedItems = items.filter((i) => selectedIds.includes(i.courseId));

  return (
    <>
      <div className="flex gap-6 bg-[#F9FAFB] items-start mx-auto py-6 px-6">
        <div className="flex max-w-275 mx-auto gap-10 w-full">
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-md mb-20">
            <CartContent
              items={items}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleAll={handleToggleAll}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>
          <div className="w-80 shrink-0 sticky top-4">
            <CartSticky selectedItems={selectedItems} onPurchase={handlePurchase} />
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <TwoButtonModal
          title="선택 삭제"
          message={`선택 강의 ${selectedIds.length}개를 삭제하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
