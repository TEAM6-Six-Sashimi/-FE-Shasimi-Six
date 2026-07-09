'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';
import { createReviewAction } from '../actions';

interface ReviewFormProps {
  courseId: number;
}

export default function ReviewForm({ courseId }: ReviewFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = rating > 0 && content.trim();

  const handleSubmitClick = () => {
    setSubmitted(true);
    if (!isValid) return;
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await createReviewAction(courseId, { rating, content: content.trim() });

    if (result.success) {
      setConfirmOpen(false);
      setRating(0);
      setContent('');
      setSubmitted(false);
      showToast('리뷰가 등록되었습니다.', 'positive');
      router.refresh();
    } else {
      showToast(result.message, 'negative');
    }

    setIsSubmitting(false);
  };

  return (
    <section
      aria-labelledby="review-form-heading"
      className="flex flex-col gap-4 pb-6 border-b border-[#E5E7EB]"
    >
      <h3 id="review-form-heading" className="text-[15px] font-bold text-[#1E2125]">
        수강평 작성하기
      </h3>

      {/* 별점 */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-[#1E2125] mb-2">
          평점 선택 <span className="text-[#FF5E5E]">*</span>
        </legend>
        <div className="flex items-center gap-1" role="group" aria-label="별점 선택">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star}점`}
              aria-pressed={rating === star}
              onClick={() => setRating(star)}
              className="text-[28px] cursor-pointer transition-colors"
            >
              <span className={star <= rating ? 'text-[#FFD700]' : 'text-[#D1D5DB]'}>★</span>
            </button>
          ))}
        </div>
        {submitted && rating === 0 && (
          <p role="alert" className="text-[12px] text-[#FF5E5E] mt-1">
            평점을 선택해주세요.
          </p>
        )}
      </fieldset>

      {/* 안내 문구 */}
      <p
        role="note"
        className="bg-[#FFEBEB] rounded-lg px-4 py-4 font-medium text-[13px] text-[#FF5E5E]"
      >
        ⚠ 작성한 수강평은 수정할 수 없으며, 삭제 후에도 다시 작성할 수 없습니다.
      </p>

      {/* 텍스트 입력 */}
      <div>
        <label htmlFor="review-content" className="sr-only">
          수강평 내용
        </label>
        <textarea
          id="review-content"
          placeholder="이 강의에 대한 솔직한 평가를 남겨주세요."
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 200))}
          maxLength={200}
          rows={4}
          aria-describedby="review-content-count"
          className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none"
        />
        <p id="review-content-count" className="text-[11.5px] text-[#6A7282] text-right mt-1">
          {content.length}/200
        </p>
        {submitted && !content.trim() && (
          <p role="alert" className="text-[12px] text-[#FF5E5E]">
            내용을 입력해주세요.
          </p>
        )}
      </div>

      {/* 리뷰 등록 버튼 */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmitClick}
          className="h-10 px-6 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[13.5px] cursor-pointer"
        >
          리뷰 등록
        </Button>
      </div>

      {confirmOpen && (
        <TwoButtonModal
          title="리뷰 등록 확인"
          message={
            '한 번 리뷰를 등록하시면 수정할 수 없으며, 삭제 후에도 다시 작성할 수 없습니다.\n리뷰를 등록하시겠습니까?'
          }
          confirmLabel={isSubmitting ? '등록 중...' : '확인'}
          cancelLabel="취소"
          onConfirm={handleConfirm}
          onCancel={() => !isSubmitting && setConfirmOpen(false)}
        />
      )}
    </section>
  );
}
