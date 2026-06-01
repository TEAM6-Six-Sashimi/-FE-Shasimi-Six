'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CourseDetailFromAPI, DIFFICULTY_LABEL } from '../types';
import { addCartItemAction } from '../../cart/actions';
import type { CourseDetail } from '@/constants/mockCourseDetail';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import OneButtonModal from '@/components/modals/OneButtonModal';

interface CourseDetailSidebarProps {
  course: CourseDetailFromAPI;
}

export default function CourseDetailSidebar({ course }: CourseDetailSidebarProps) {
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 강의 수
  const lectureCount = course.sessions.length;
  // 총 시간  초 → 시간 단위
  const durationHours = Math.ceil(course.totalDuration / 3600);
  // 난이도 한글 변환
  const difficultyLabel = DIFFICULTY_LABEL[course.difficulty] ?? course.difficulty;

  // 구매하기 → 확인 모달
  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  // 장바구니 담기
  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addCartItemAction(course.courseId);
      setShowCartModal(true);
    } catch (err) {
      const code = err instanceof Error ? err.message : '';

      if (code === 'UNAUTHORIZED') {
        router.push('/login');
        return;
      }

      if (code === 'CART_002') {
        setErrorMessage('이미 장바구니에 담긴 강의입니다.');
      } else if (code === 'ENROLLMENT_001') {
        setErrorMessage('이미 수강 중인 강의입니다.');
      } else {
        setErrorMessage('장바구니 추가에 실패했습니다. 다시 시도해주세요.');
      }
      setShowErrorModal(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <div className="w-80 shrink-0 flex flex-col gap-3 bg-white rounded-xl shadow-md p-6">
        {/* 썸네일 */}
        <div className="w-full aspect-video rounded-xl bg-[#E5E7EB] overflow-hidden" />

        {/* 가격 */}
        <p className="text-[#1E2125] text-[22px] font-bold">
          {course.price.toLocaleString()} 크레딧
        </p>

        {/* 구매하기 */}
        <Button
          className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
          onClick={handlePurchase}
        >
          구매하기
        </Button>

        {/* 장바구니 */}
        <Button
          variant="outline"
          className="w-full h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          <Image src="/header/cart.svg" width={17} height={17} alt="" /> 장바구니 담기
        </Button>

        {/* 강의 정보 */}
        <div className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2.5 mt-1">
          {[
            { label: '총 강의 수', value: `${lectureCount}강` },
            { label: '총 강의 시간', value: `${durationHours}시간` },
            { label: '난이도', value: difficultyLabel },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[#6A7282] text-[13px]">{label}</span>
              <span className="text-[#1E2125] text-[13px] font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 단일 구매 확인 모달 */}
      {showPurchaseModal && (
        <TwoButtonModal
          title="구매 확인"
          message={`"${course.title}" 강의를 구매하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowPurchaseModal(false);
            router.push(`/enrollments?courseIds=${course.courseId}`);
          }}
          onCancel={() => setShowPurchaseModal(false)}
        />
      )}

      {/* 장바구니 담기 성공 모달 */}
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

      {/* 에러 모달 */}
      {showErrorModal && (
        <OneButtonModal
          title="알림"
          message={errorMessage}
          confirmLabel="확인"
          onConfirm={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
}
