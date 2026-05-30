'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CourseFromAPI } from '../types';
import { addCartItemAction } from '../../cart/actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import OneButtonModal from '@/components/modals/OneButtonModal';

interface CourseCardProps {
  course: CourseFromAPI;
  category: string;
}

export default function CourseCard({ course, category }: CourseCardProps) {

  const router = useRouter();
  const [ isAddingToCart, setIsAddingToCart ] = useState(false);
  const [ showCartModal, setShowCartModal ] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
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
  }

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPurchaseModal(true);
  }

  return (
    <>
      <div className="flex flex-col bg-[#F9FAFB] rounded-xl overflow-hidden border border-[#D1D5DB] hover:shadow-lg transition-shadow duration-200">

        {/* 썸네일 */}
        <Link
          href={`/courses/${encodeURIComponent(category)}/${encodeURIComponent(course.title)}`}
          className="relative block shrink-0"
        >
          <div className="w-full aspect-video bg-[#E5E7EB]" />
        </Link>

        {/* 카드 본문 */}
        <Link
          href={`/courses/${encodeURIComponent(category)}/${encodeURIComponent(course.title)}`}
          className="flex flex-col gap-1.5 px-3.5 pt-3 pb-2 flex-1"
        >
          {/* 제목 */}
          <p className="text-[#1E2125] text-[13.5px] font-semibold leading-snug line-clamp-2">
            {course.title}
          </p>
          {/* 강사 */}
          <p className="text-[#6A7282] text-[12px]">{course.instructorName}</p>
          {/* 평점 */}
          <div className="flex items-center gap-1">
            <span className="text-[#FFD700] text-[12px]">★</span>
            <span className="text-[#1E2125] text-[12px] font-semibold">{course.ratingAvg.toFixed(1)}</span>
            <span className="text-[#6A7282] text-[11px]">({course.studentCount.toLocaleString()}명)</span>
          </div>
          {/* 가격 */}
          <p className="text-[#1E2125] text-[14px] font-bold mt-auto">
            {course.price.toLocaleString()} 크레딧
          </p>
        </Link>

        {/* 버튼 */}
        <div className="flex gap-2 px-3.5 pb-3.5">
          <Button
            size="sm"
            className="flex-1 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] font-semibold h-8 cursor-pointer"
            onClick={handlePurchase}
          >
            구매하기
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-[#D1D5DB] text-[#1E2125] text-[12.5px] font-semibold h-8 hover:bg-[#E5E7EB] cursor-pointer"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            장바구니
          </Button>
        </div>
      </div>

      {/* 단일 구매 확인 모달 */}
      {showPurchaseModal && (
        <TwoButtonModal
          title="구매 확인"
          message={`"${course.title}"\n강의를 구매하시겠습니까?`}
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
 
      {/* 에러 모달 - TODO: OneButtonModal 컴포넌트 생기면 교체 */}
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