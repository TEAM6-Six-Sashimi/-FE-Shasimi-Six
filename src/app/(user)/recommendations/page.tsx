'use client';

import { useEffect, useState } from 'react';
import URLForm from '@/features/user/recommendations/components/URLForm';
import TextForm from '@/features/user/recommendations/components/TextForm';
import RecomResult from '@/features/user/recommendations/components/RecomResult';
import {
  createRecommendation,
  getLatestRecommendation,
  recommendCourses,
  getRequiredSkills,
  getRecommendedCertificates,
} from '@/services/recommendation.service';
import type {
  JobPostingRecommendationResponse,
  CourseRecommendationResponse,
  RequiredSkillRecommendationResponse,
  CertificateRecommendationResponse,
} from '@/features/user/recommendations/types';

type Tab = 'URL' | 'TEXT';

export default function RecommendationPage() {
  const [tab, setTab] = useState<Tab>('URL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recommendation, setRecommendation] = useState<JobPostingRecommendationResponse | null>(null);
  const [courses, setCourses] = useState<CourseRecommendationResponse[]>([]);
  const [skills, setSkills] = useState<RequiredSkillRecommendationResponse[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecommendationResponse[]>([]);

  // 페이지 진입 시 최근 추천 자동 로드
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const latest = await getLatestRecommendation();
        if (aborted || !latest) return;
        setRecommendation(latest);
        if (latest.analysisStatus === 'COMPLETED') {
          await fetchSubResults();
        }
      } catch {
        // 401 등은 무시 (조용히 비로그인 처리)
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  const fetchSubResults = async () => {
    const [c, s, cert] = await Promise.all([
      recommendCourses().catch(() => []),
      getRequiredSkills().catch(() => []),
      getRecommendedCertificates().catch(() => []),
    ]);
    setCourses(c);
    setSkills(s);
    setCertificates(cert);
  };

  const runAnalyze = async (payload: { sourceUrl?: string; rawContent?: string }) => {
    setError(null);
    setLoading(true);
    try {
      const result = await createRecommendation({
        inputType: tab,
        ...payload,
      });
      setRecommendation(result);
      await fetchSubResults();
    } catch (err: any) {
      setError(err.message || '분석에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleURLSubmit = (sourceUrl: string) => runAnalyze({ sourceUrl });
  const handleTextSubmit = (rawContent: string) => runAnalyze({ rawContent });

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-[#F9FBE7] border border-[#E4E97B] rounded-xl px-5 py-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[16px]">✨</span>
            <h1 className="text-[18px] font-bold text-[#1E2125]">AI 맞춤 강의 추천</h1>
          </div>
          <p className="text-[12.5px] text-[#6A7282] mt-1">
            <span className="px-1.5 py-0.5 rounded bg-[#FFF5C2] font-semibold text-[#1E2125]">채용공고</span>를 등록하고 나에게 필요한 강의를 추천받아보세요.
          </p>
        </div>

        {/* 입력 카드 */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 mb-6">
          {/* 탭 */}
          <div className="inline-flex p-1 rounded-lg bg-[#F3F4F6] mb-5">
            <TabBtn active={tab === 'URL'} onClick={() => setTab('URL')}>
              🔗 URL 입력
            </TabBtn>
            <TabBtn active={tab === 'TEXT'} onClick={() => setTab('TEXT')}>
              📝 텍스트 입력
            </TabBtn>
          </div>

          {tab === 'URL' ? (
            <URLForm onSubmit={handleURLSubmit} loading={loading} />
          ) : (
            <TextForm onSubmit={handleTextSubmit} loading={loading} />
          )}

          {error && (
            <div className="mt-4 px-4 py-3 rounded-lg text-[13px] font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">
              {error}
            </div>
          )}
        </section>

        {/* 결과 */}
        {recommendation && (
          <RecomResult
            recommendation={recommendation}
            courses={courses}
            skills={skills}
            certificates={certificates}
          />
        )}
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-colors cursor-pointer ${
        active
          ? 'bg-white text-[#1E2125] shadow-sm'
          : 'text-[#6A7282] hover:text-[#1E2125]'
      }`}
    >
      {children}
    </button>
  );
}
