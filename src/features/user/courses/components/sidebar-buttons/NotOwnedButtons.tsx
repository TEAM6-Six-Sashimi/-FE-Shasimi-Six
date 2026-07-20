'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CourseDetailFromAPI } from '@/features/user/courses/types';
import { addCartItemAction } from '../../../cart/actions';
import { useMaintenance } from '@/components/system/MaintenanceProvider';
import { useToast } from '@/components/ui/ToastContext';
import { logoutAction } from '@/features/auth/actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

interface NotOwnedButtonsProps {
  course: CourseDetailFromAPI;
}

export default function NotOwnedButtons({ course }: NotOwnedButtonsProps) {
  const router = useRouter();
  const { setMaintenance } = useMaintenance();
  const { showToast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      const result = await addCartItemAction(course.courseId);

      if (result.success) {
        setShowCartModal(true);
        router.refresh();
        return;
      }

      if (result.maintenance) {
        setMaintenance(true, result.message);
        return;
      }

      if (result.code === 'UNAUTHORIZED') {
        router.push('/auth/login');
        return;
      }
      if (result.code === 'AUTH_SESSION_EXPIRED') {
        showToast(result.message ?? '다시 로그인해주세요.', 'alarm');
        await logoutAction();
        return;
      }
      if (result.code === 'CART_002') {
        showToast('이미 장바구니에 담긴 강의입니다.', 'alarm');
      } else if (result.code === 'ENROLLMENT_001') {
        showToast('이미 수강 중인 강의입니다.', 'alarm');
      } else {
        showToast('장바구니 추가에 실패했습니다. 다시 시도해주세요.', 'negative');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <Button
        className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
        onClick={() => setShowPurchaseModal(true)}
      >
        구매하기
      </Button>
      <Button
        variant="outline"
        disabled={isAddingToCart}
        className="w-full h-11 border-[1.5px] border-[#1E2125] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
        onClick={handleAddToCart}
      >
        <Image src="/header/cart.svg" width={17} height={17} alt="장바구니" /> 장바구니 담기
      </Button>

      {showPurchaseModal && (
        <TwoButtonModal
          title="구매 확인"
          message={`"${course.title}"\n강의를 구매하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowPurchaseModal(false);
            router.push(`/payments?courseIds=${course.courseId}`);
          }}
          onCancel={() => setShowPurchaseModal(false)}
        />
      )}

      {showCartModal && (
        <TwoButtonModal
          title="장바구니 담기"
          message={`"${course.title}" 강의가 담겼습니다.\n장바구니로 이동하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowCartModal(false);
            router.push('/cart');
          }}
          onCancel={() => setShowCartModal(false)}
        />
      )}
    </>
  );
}
