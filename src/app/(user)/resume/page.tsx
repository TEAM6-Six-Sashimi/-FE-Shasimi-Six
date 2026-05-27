'use client';

import { useEffect, useState } from 'react';
import ResumeForm from '@/features/user/resume/components/ResumeForm';
import AIReviewPanel from '@/features/user/resume/components/AIReviewPanel';
import { getMyResumes } from '@/services/resume.service';
import type { ResumeResponse } from '@/features/user/resume/types';

export default function ResumePage() {
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const list = await getMyResumes();
        if (aborted) return;
        setResumes(list);
        if (list.length > 0) setSelectedId(list[0].resumeId);
      } catch (err: any) {
        if (aborted) return;
        setLoadError(err.message || '이력서 목록을 불러오지 못했습니다.');
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-[#F9FBE7] border border-[#E4E97B] rounded-xl px-5 py-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[16px]">📄</span>
            <h1 className="text-[18px] font-bold text-[#1E2125]">AI 이력서 작성 & 평가</h1>
          </div>
          <p className="text-[12.5px] text-[#6A7282] mt-1">
            템플릿으로 이력서를 작성하고 AI가 점수와 개선 방향까지 알려드려요.
          </p>
        </div>

        {/* 기존 이력서가 있으면 AI 평가용으로 선택 */}
        {resumes.length > 0 && (
          <div className="mb-5 flex items-center gap-3">
            <label className="text-[13px] font-semibold text-[#1E2125]">AI 평가 대상 이력서</label>
            <select
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-[#D1D5DB] bg-white text-[13px] text-[#1E2125] outline-none focus:border-[#FF5F5F] cursor-pointer"
            >
              {resumes.map((r) => (
                <option key={r.resumeId} value={r.resumeId}>
                  {r.title}
                  {r.defaultResume ? ' (기본)' : ''}
                </option>
              ))}
            </select>
            <span className="text-[11.5px] text-[#9CA3AF]">
              ← 기존에 저장된 이력서 대상으로 AI 평가가 가능합니다
            </span>
          </div>
        )}

        {loadError && (
          <div className="mb-5 px-4 py-3 rounded-lg text-[13px] font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">
            {loadError} (로그인 상태를 확인해 주세요)
          </div>
        )}

        {/* 폼 + 사이드 패널 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <ResumeForm />
          </div>
          <div className="lg:col-span-1">
            <AIReviewPanel resumeId={selectedId} />
          </div>
        </div>
      </div>
    </div>
  );
}
