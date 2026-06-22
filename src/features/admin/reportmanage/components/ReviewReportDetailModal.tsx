'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext';
import {
  fetchReviewReportDetailAction,
  deleteReportedReviewAction,
  rejectReportedReviewAction,
} from '../actions';
import {
  ReviewReportDetail,
  REPORT_CATEGORY_LABEL,
  REPORT_CATEGORY_STYLE,
} from '../types';

interface Props {
  reportId: number;
  onClose: () => void;
  onProcessed: (reportId: number) => void; // 삭제/반려 처리 후 목록 갱신용
}

export default function ReviewReportDetailModal({ reportId, onClose, onProcessed }: Props) {
  const { showToast } = useToast();
  const [detail, setDetail] = useState<ReviewReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchReviewReportDetailAction(reportId).then((data) => {
      if (active) {
        setDetail(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [reportId]);

  const handleDelete = async () => {
    try {
      setProcessing(true);
      await deleteReportedReviewAction(reportId);
      showToast('신고된 수강평이 삭제되었습니다.');
      onProcessed(reportId);
      onClose();
    } catch {
      showToast('삭제 처리에 실패했습니다.', 'negative');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      await rejectReportedReviewAction(reportId);
      showToast('신고가 반려 처리되었습니다.');
      onProcessed(reportId);
      onClose();
    } catch {
      showToast('반려 처리에 실패했습니다.', 'negative');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-bold text-[#1E2125]">신고 상세 내용</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#6A7282] hover:bg-[#F3F4F6] hover:text-[#1E2125] transition-colors cursor-pointer text-[18px]"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-center text-[#6A7282] text-[13px] py-10">불러오는 중...</p>
        ) : !detail ? (
          <p className="text-center text-[#6A7282] text-[13px] py-10">
            신고 정보를 불러올 수 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">신고된 리뷰 내용</p>
              <p className="text-[13.5px] text-[#1E2125] bg-[#F9FAFB] rounded-lg px-3 py-2.5 leading-relaxed">
                {detail.reviewContent}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F9FAFB] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-[#9CA3AF] mb-0.5">작성자 ID</p>
                <p className="text-[13.5px] font-semibold text-[#1E2125]">
                  {detail.writerLoginId}
                </p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-[#9CA3AF] mb-0.5">신고자 ID</p>
                <p className="text-[13.5px] font-semibold text-[#1E2125]">
                  {detail.reporterLoginId}
                </p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-[#9CA3AF] mb-0.5">신고일</p>
                <p className="text-[13.5px] font-semibold text-[#1E2125]">
                  {detail.reportedAt.slice(0, 10)}
                </p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-[#9CA3AF] mb-0.5">신고 카테고리</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[11.5px] font-semibold ${REPORT_CATEGORY_STYLE[detail.category]}`}
                >
                  {REPORT_CATEGORY_LABEL[detail.category]}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">신고 사유 (직접 입력)</p>
              <p className="text-[13.5px] text-[#1E2125] bg-[#F9FAFB] rounded-lg px-3 py-2.5 leading-relaxed">
                {detail.reason}
              </p>
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleDelete}
                disabled={processing}
                className="flex-1 h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
              >
                {processing ? '처리 중...' : '신고된 리뷰 삭제'}
              </Button>
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={processing}
                className="flex-1 h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
              >
                반려
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}