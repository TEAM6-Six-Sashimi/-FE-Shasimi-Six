'use client';

import { useState } from 'react';
import type { Category } from '@/features/categories/types';
import { AdminCourse } from '../type';
import { approveCourseAction, rejectCourseAction } from '../action';

interface Props {
  courses: AdminCourse[];
  setCourses: React.Dispatch<React.SetStateAction<AdminCourse[]>>;
  categories: Category[];
}

export default function PendingCourses({ courses, setCourses, categories }: Props) {
  const [rejectModal, setRejectModal] = useState<{ courseId: number; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  const getCategoryName = (categoryId: number) => {
    for (const cat of categories) {
      if (cat.mainCategoryId === categoryId) return cat.name;
      const option = cat.options?.find((o) => o.id === categoryId);
      if (option) return option.name;
    }
    return String(categoryId);
  };

  const sorted = [...courses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleApprove = async (courseId: number) => {
    try {
      setLoading(true);
      await approveCourseAction(courseId);
      setCourses((prev) => prev.filter((c) => c.courseId !== courseId));
    } catch {
      alert('승인 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    if (!rejectReason.trim()) { alert('반려 사유를 입력해주세요.'); return; }
    try {
      setLoading(true);
      await rejectCourseAction(rejectModal.courseId, rejectReason);
      setCourses((prev) => prev.filter((c) => c.courseId !== rejectModal.courseId));
      setRejectModal(null);
      setRejectReason('');
    } catch {
      alert('반려 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
        <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">강의 승인 대기 목록</h2>
        <table className="w-full text-[13px] table-fixed">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="py-3 w-[30%] text-center font-semibold text-[#1E2125]">강의명</th>
              <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">강사명</th>
              <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">카테고리</th>
              <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">등록 요청일</th>
              <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">관리</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center text-[#6A7282]">승인 대기 중인 강의가 없습니다.</td>
              </tr>
            ) : (
              sorted.map((c) => (
                <tr key={c.courseId} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-6 text-left font-semibold text-[#1E2125]">{c.title}</td>
                  <td className="py-3 text-center font-semibold text-[#1E2125]">{c.instructorName}</td>
                  <td className="py-3 text-center text-[#6A7282]">{getCategoryName(c.categoryId)}</td>
                  <td className="py-3 text-center text-[#6A7282]">{c.createdAt.slice(0, 10)}</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleApprove(c.courseId)}
                        disabled={loading}
                        className="px-6 py-1.5 rounded border-2 border-[#CFEE5D] text-[12px] font-semibold text-[#1E2125] bg-white hover:border-[#A8D014] hover:bg-[#F9FBE7] cursor-pointer transition-colors disabled:opacity-50"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => { setRejectModal({ courseId: c.courseId, title: c.title }); setRejectReason(''); }}
                        disabled={loading}
                        className="px-6 py-1.5 rounded border-2 border-[#FF5E5E] text-[12px] font-semibold text-white bg-[#FF5E5E] hover:bg-[#D14848] hover:border-[#D14848] cursor-pointer transition-colors disabled:opacity-50"
                      >
                        반려
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 반려 사유 모달 */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-[16px] font-bold text-[#1E2125] mb-1">반려 사유 입력</h3>
            <p className="text-[13px] text-[#6A7282] mb-4">{rejectModal.title}</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="반려 사유를 입력해주세요."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModal(null)}
                disabled={loading}
                className="px-5 py-2 rounded border-2 border-[#D1D5DB] text-[13px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] cursor-pointer transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={loading}
                className="px-5 py-2 rounded border-2 border-[#FF5E5E] bg-[#FF5E5E] text-[13px] font-semibold text-white hover:bg-[#D14848] hover:border-[#D14848] cursor-pointer transition-colors disabled:opacity-50"
              >
                {loading ? '처리 중...' : '반려'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}