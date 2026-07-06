'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CourseFromAPI } from '../types';
import { addCartItemAction } from '../../cart/actions';
import { checkAlreadyEnrolledAction } from '../actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import OneButtonModal from '@/components/modals/OneButtonModal';
import Image from 'next/image';
import { getThumbnailUrl, isLocalhostUrl } from '@/lib/thumbnail';

interface CourseCardProps {
  course: CourseFromAPI;
  category: string;
  /** 첫 행 카드(LCP 대상)는 true — Next Image priority 활성화 */
  priority?: boolean;
}

function formatApprovedDate(approvedAt: string | null | undefined): string | null {
  if (!approvedAt) return null;
  const date = new Date(approvedAt);
  if (Number.isNaN(date.getTime())) return null;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const LABEL_TEXT: Record<string, string> = {
  POPULAR: '인기',
  NEW: 'NEW',
};

export default function CourseCard({ course, category, priority = false }: CourseCardProps) {
  const router = useRouter();
  const thumbnailUrl = getThumbnailUrl(course.thumbnail);
  const approvedDateLabel = formatApprovedDate(course.approvedAt);
  const courseHref = `/courses/${encodeURIComponent(category)}/${course.courseId}`;

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAddingToCart) return;
    setIsAddingToCart(true);

    try {
      const result = await addCartItemAction(course.courseId);

      if (!result.success) {
        if (result.code === 'UNAUTHORIZED') {
          router.push('/login');
          return;
        }
        if (result.code === 'CART_002') {
          setErrorMessage('이미 장바구니에 담긴 강의입니다.');
        } else if (result.code === 'PAYMENT_001' || result.code === 'ENROLLMENT_001') {
          setErrorMessage('이미 수강 중인 강의입니다.');
        } else {
          setErrorMessage('장바구니 추가에 실패했습니다.');
        }
        setShowErrorModal(true);
        return;
      }

      setShowCartModal(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePurchase = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCheckingPurchase) return;
    setIsCheckingPurchase(true);

    try {
      const alreadyEnrolled = await checkAlreadyEnrolledAction(course.courseId);
      if (alreadyEnrolled) {
        setErrorMessage('이미 수강 중인 강의입니다.');
        setShowErrorModal(true);
        return;
      }
      setShowPurchaseModal(true);
    } finally {
      setIsCheckingPurchase(false);
    }
  };

  return (
    <>
      <article className="flex flex-col bg-[#F9FAFB] rounded-xl overflow-hidden border border-[#D1D5DB] hover:shadow-lg transition-shadow duration-200 h-full">
        {/* 썸네일 */}
        <Link
          href={courseHref}
          className="relative block shrink-0"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="relative w-full aspect-video bg-[#E5E7EB]">
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                priority={priority}
                unoptimized={isLocalhostUrl(thumbnailUrl)}
                sizes="(max-width: 768px) 50vw, 280px"
                className="object-cover"
              />
            )}
            {course.label && LABEL_TEXT[course.label] && (
              <span
                aria-hidden="true"
                className={`absolute top-2 right-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  course.label === 'NEW' ? 'bg-[#CFEE5D] text-[#1E2125]' : 'bg-[#FF5E5E] text-white'
                }`}
              >
                {LABEL_TEXT[course.label]}
              </span>
            )}
          </div>
        </Link>

        {/* 카드 본문 */}
        <div className="flex flex-col gap-1.5 px-3.5 pt-3 pb-2 flex-1">
          <h3 className="text-[#1E2125] text-[13.5px] font-semibold leading-snug">
            <Link href={courseHref} className="line-clamp-2 hover:underline">
              {course.title}
            </Link>
          </h3>
          <p className="text-[#6A7282] text-[12px]">{course.instructorName}</p>
          <div
            className="flex items-center gap-1"
            aria-label={`평점 ${course.ratingAvg.toFixed(1)}점, 수강생 ${course.studentCount.toLocaleString()}명`}
          >
            <span aria-hidden="true" className="text-[#FFD700] text-[13px]">
              ★
            </span>
            <span className="text-[#1E2125] text-[13px] font-semibold">
              {course.ratingAvg.toFixed(1)}
            </span>
            <span className="text-[#6A7282] text-[12px]">
              · {course.studentCount.toLocaleString()}명
            </span>
          </div>
          {approvedDateLabel && (
            <time dateTime={approvedDateLabel} className="text-[#6A7282] text-[12px]">
              등록일: {approvedDateLabel}
            </time>
          )}
          <p className="text-[#1E2125] text-[18px] font-bold mt-auto">
            {course.price.toLocaleString()} 크레딧
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 px-3.5 pb-3.5">
          <Button
            type="button"
            size="sm"
            className="flex-1 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] font-semibold h-8 cursor-pointer"
            onClick={handlePurchase}
            disabled={isCheckingPurchase}
          >
            구매하기
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1 border-[#1E2125] text-[#1E2125] text-[12.5px] font-semibold h-8 hover:bg-[#F9FAFB] cursor-pointer"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            aria-label={`${course.title} 장바구니에 담기`}
          >
            장바구니
          </Button>
        </div>
      </article>

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
