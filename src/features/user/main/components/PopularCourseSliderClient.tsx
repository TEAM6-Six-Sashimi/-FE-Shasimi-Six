'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CourseFromAPI } from '../../courses/types';
import { checkAlreadyEnrolledAction } from '../../courses/actions';
import { getThumbnailUrl, isLocalhostUrl } from '@/lib/thumbnail';
import { useToast } from '@/components/ui/ToastContext';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

interface CourseWithCategory extends CourseFromAPI {
  categoryName: string;
}

interface PopularCourseSliderClientProps {
  courses: CourseWithCategory[];
}

// 뷰포트 너비에 따른 한 슬라이드당 카드 개수 (모바일 1 / 태블릿 2 / 데스크톱 3)
function getItemsPerSlide(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

const GRID_COLS_CLASS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

// 리사이즈 중 매 픽셀마다 재계산하지 않도록 가벼운 디바운스만 적용
function useItemsPerSlide(): number {
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    // window는 클라이언트에서만 접근 가능하므로 마운트 후 이펙트에서 초기값을 잡아야 함
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItemsPerSlide(getItemsPerSlide(window.innerWidth));

    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setItemsPerSlide(getItemsPerSlide(window.innerWidth)), 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return itemsPerSlide;
}

export default function PopularCourseSliderClient({ courses }: PopularCourseSliderClientProps) {
  const itemsPerSlide = useItemsPerSlide();
  const [current, setCurrent] = useState(0);

  const slides = Array.from({ length: Math.ceil(courses.length / itemsPerSlide) }, (_, i) =>
    courses.slice(i * itemsPerSlide, i * itemsPerSlide + itemsPerSlide),
  );
  // slides가 빈 배열이면 slides.length - 1이 -1이 되어 인덱스 계산이 어긋나므로 0으로 바닥을 깐다
  const lastIndex = Math.max(0, slides.length - 1);

  // 뷰포트가 바뀌어 슬라이드 개수가 달라지면 범위를 벗어난 인덱스에 머물지 않도록 보정
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent((p) => Math.min(p, lastIndex));
  }, [lastIndex]);

  const prev = () => setCurrent((p) => Math.max(0, p - 1));
  const next = () => setCurrent((p) => Math.min(lastIndex, p + 1));

  return (
    <section className="px-6">
      <div className="mb-6">
        <h2 className="text-[26px] font-bold text-[#1E2125]">
          <span className="text-[#FF5E5E]">인기</span> 강의
        </h2>
        <p className="text-[13.5px] text-[#6A7282] mt-1">
          지금 가장 많이 수강하는 강의를 슬라이드로 만나보세요
        </p>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((group, gIdx) => (
              <div
                key={gIdx}
                className={`min-w-full grid ${GRID_COLS_CLASS[itemsPerSlide]} gap-5`}
              >
                {group.map((course) => (
                  <SliderCourseCard key={course.courseId} course={course} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          aria-label="이전 슬라이드"
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#D1D5DB] shadow-md flex items-center justify-center text-[#1E2125] hover:bg-[#F9FAFB] disabled:opacity-30 transition-all cursor-pointer"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          disabled={current === lastIndex}
          aria-label="다음 슬라이드"
          className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#D1D5DB] shadow-md flex items-center justify-center text-[#1E2125] hover:bg-[#F9FAFB] disabled:opacity-30 transition-all cursor-pointer"
        >
          ›
        </button>
      </div>

      <div
        className="flex items-center justify-center gap-2 mt-6"
        role="tablist"
        aria-label="슬라이드 페이지"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={current === i}
            aria-label={`${i + 1}번째 슬라이드`}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all cursor-pointer ${
              current === i ? 'w-6 h-2.5 bg-[#FF5E5E]' : 'w-2.5 h-2.5 bg-[#D1D5DB]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function SliderCourseCard({ course }: { course: CourseWithCategory }) {
  const router = useRouter();
  const { showToast } = useToast();
  const thumbnailUrl = getThumbnailUrl(course.thumbnail);
  const courseHref = `/courses/${encodeURIComponent(course.categoryName)}/${course.courseId}`;

  const [isCheckingPurchase, setIsCheckingPurchase] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handlePurchase = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCheckingPurchase) return;
    setIsCheckingPurchase(true);

    try {
      const alreadyEnrolled = await checkAlreadyEnrolledAction(course.courseId);
      if (alreadyEnrolled) {
        showToast('이미 수강 중인 강의입니다.', 'alarm');
        return;
      }
      setShowPurchaseModal(true);
    } finally {
      setIsCheckingPurchase(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden border border-[#D1D5DB] hover:shadow-lg transition-shadow duration-200">
        {/* 썸네일 */}
        <Link href={courseHref} className="relative block" tabIndex={-1} aria-hidden="true">
          <div className="relative w-full aspect-video bg-[#E5E7EB]">
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                unoptimized={isLocalhostUrl(thumbnailUrl)}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            )}
            <span className="absolute top-3 right-3 bg-[#FF5E5E] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              인기
            </span>
          </div>
        </Link>

        {/* 강의 정보 */}
        <Link href={courseHref}>
          <div className="px-4 pt-3.5 pb-4 flex flex-col gap-1.5">
            <div className="flex flex-col gap-1.5">
              <p className="text-[#1E2125] text-[14px] font-semibold leading-snug line-clamp-2">
                {course.title}
              </p>
              <p className="text-[#6A7282] text-[12px]">{course.instructorName}</p>
              <div className="flex items-center gap-1">
                <span className="text-[#FFD700] text-[12px]">★</span>
                <span className="text-[#1E2125] text-[12px] font-semibold">
                  {course.ratingAvg.toFixed(1)}
                </span>
                <span className="text-[#6A7282] text-[11px]">
                  ({course.studentCount.toLocaleString()}명)
                </span>
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-[#1E2125] text-[15px] font-bold">
                  {course.price.toLocaleString()} 크레딧
                </p>
                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={isCheckingPurchase}
                  className="px-4 py-1.5 rounded-lg border-2 border-[#1E2125] text-[12px] font-semibold text-[#1E2125] hover:bg-[#1E2125] hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>

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
    </>
  );
}
