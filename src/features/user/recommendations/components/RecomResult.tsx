'use client';

import type {
  JobPostingRecommendationResponse,
  CourseRecommendationResponse,
  RequiredSkillRecommendationResponse,
  CertificateRecommendationResponse,
} from '@/features/user/recommendations/types';

interface RecomResultProps {
  recommendation: JobPostingRecommendationResponse;
  courses: CourseRecommendationResponse[];
  skills: RequiredSkillRecommendationResponse[];
  certificates: CertificateRecommendationResponse[];
}

export default function RecomResult({
  recommendation,
  courses,
  skills,
  certificates,
}: RecomResultProps) {
  return (
    <div className="space-y-5">
      {/* ─── 분석 메타정보 (한 줄) ─── */}
      <div className="flex items-center justify-between text-[12px] text-[#6A7282] px-1">
        <div className="flex items-center gap-2">
          <span>📋</span>
          <span className="font-semibold text-[#1E2125]">
            {recommendation.jobTitle || '분석된 채용공고'}
          </span>
          {recommendation.resumeBased && (
            <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1D4ED8] font-semibold text-[11px]">
              내 이력서 기반
            </span>
          )}
          <StatusBadge status={recommendation.analysisStatus} />
        </div>
        <span>{new Date(recommendation.createdAt).toLocaleString('ko-KR')}</span>
      </div>

      {/* ─── 요구 역량 (스킬) ─── */}
      <SkillsSection skills={skills} matchRate={recommendation.matchRate} />

      {/* ─── 추천 자격증 ─── */}
      <CertificatesSection certificates={certificates} />

      {/* ─── 추천 강의 ─── */}
      <CoursesSection courses={courses} />
    </div>
  );
}

// ─────────────────────────────────────
// 요구 역량 (보유/미보유 그룹 + 일치율 진행 바)
// ─────────────────────────────────────
function SkillsSection({
  skills,
  matchRate,
}: {
  skills: RequiredSkillRecommendationResponse[];
  matchRate: number;
}) {
  const matched = skills.filter((s) => s.matched);
  const unmatched = skills.filter((s) => !s.matched);
  const total = skills.length;
  const percent = total > 0 ? matchRate : 0;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
      <SectionTitle icon="📌" label="공고에서 추출된 요구 역량" count={total} />

      {total === 0 ? (
        <EmptyHint text="분석된 요구 역량이 없습니다." />
      ) : (
        <>
          {/* 스킬 태그들 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {matched.map((s, i) => (
              <SkillTag key={`m-${s.name}-${i}`} skill={s} />
            ))}
            {unmatched.map((s, i) => (
              <SkillTag key={`u-${s.name}-${i}`} skill={s} />
            ))}
          </div>

          {/* 일치율 진행바 */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12.5px] font-semibold text-[#1E2125]">
                현재 역량 일치율{' '}
                <span className="text-[#15803D]">{percent}%</span>
                <span className="text-[#6A7282] font-normal ml-1">
                  ({matched.length}/{total}개 보유)
                </span>
              </p>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F3F4F6] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#86EFAC] to-[#15803D] rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
              />
            </div>
          </div>

          {/* 라벨 안내 */}
          <div className="flex items-center gap-4 mt-4 text-[11.5px]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#86EFAC] border border-[#15803D]" />
              <span className="text-[#6A7282]">보유 역량</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F3F4F6] border border-[#D1D5DB]" />
              <span className="text-[#6A7282]">미보유 역량</span>
            </span>
          </div>
        </>
      )}
    </section>
  );
}

function SkillTag({ skill }: { skill: RequiredSkillRecommendationResponse }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-semibold border ${
        skill.matched
          ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#15803D]'
          : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#6A7282]'
      }`}
      title={skill.category}
    >
      {skill.matched && <span>✓</span>}
      {skill.name}
    </span>
  );
}

// ─────────────────────────────────────
// 추천 자격증 (3개 그리드)
// ─────────────────────────────────────
function CertificatesSection({
  certificates,
}: {
  certificates: CertificateRecommendationResponse[];
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
      <SectionTitle icon="🏆" label="추천 자격증" count={certificates.length} />
      {certificates.length === 0 ? (
        <EmptyHint text="추천 자격증이 없습니다." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {certificates.map((cert) => (
            <CertificateCard key={cert.certificationId} cert={cert} />
          ))}
        </div>
      )}
    </section>
  );
}

function CertificateCard({ cert }: { cert: CertificateRecommendationResponse }) {
  return (
    <div className="border border-[#E5E7EB] rounded-xl p-4 hover:border-[#FF5F5F] transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-[14px] font-bold text-[#1E2125] leading-snug">{cert.name}</h4>
        <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#FFF7ED] text-[#C2410C] text-[10.5px] font-semibold whitespace-nowrap">
          {cert.difficulty}
        </span>
      </div>
      <p className="text-[12px] text-[#6A7282] leading-relaxed mb-2 line-clamp-3">{cert.reason}</p>
      {cert.relatedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cert.relatedSkills.map((s) => (
            <span
              key={s}
              className="text-[10.5px] px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#6A7282]"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// 추천 강의 (가로 카드 리스트)
// ─────────────────────────────────────
function CoursesSection({ courses }: { courses: CourseRecommendationResponse[] }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
      <SectionTitle icon="📚" label="역량 보완을 위한 추천 강의" count={courses.length} />
      {courses.length === 0 ? (
        <EmptyHint text="추천 가능한 강의가 없습니다." />
      ) : (
        <div className="space-y-3 mt-4">
          {courses.map((c) => (
            <CourseCard key={c.courseId} course={c} />
          ))}
        </div>
      )}
    </section>
  );
}

function CourseCard({ course }: { course: CourseRecommendationResponse }) {
  return (
    <a
      href={`/courses/all/${course.courseId}`}
      className="flex gap-4 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#FF5F5F] hover:shadow-sm transition-all cursor-pointer group"
    >
      {/* 썸네일 자리 (백엔드 응답에 없으므로 placeholder) */}
      <div className="w-32 h-24 shrink-0 rounded-lg bg-gradient-to-br from-[#FFF5F5] to-[#FFE5E5] flex items-center justify-center">
        <span className="text-[28px] opacity-50">📺</span>
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-[11.5px] text-[#6A7282] mb-0.5">{course.instructor}</p>
        <h4 className="text-[14px] font-bold text-[#1E2125] mb-1.5 line-clamp-1 group-hover:text-[#FF5F5F] transition-colors">
          {course.title}
        </h4>
        <div className="mb-1.5">
          <span className="inline-flex px-2 py-0.5 rounded-md bg-[#FFF5F5] text-[#FF5F5F] text-[11px] font-semibold">
            #{course.matchedSkill}
          </span>
        </div>
        <p className="text-[12px] text-[#6A7282] leading-relaxed line-clamp-2">{course.reason}</p>
      </div>

      {/* 강의보기 */}
      <div className="self-center shrink-0">
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-md text-[12px] font-semibold text-[#FF5F5F] border border-[#FF5F5F] group-hover:bg-[#FF5F5F] group-hover:text-white transition-colors">
          강의 보기 →
        </span>
      </div>
    </a>
  );
}

// ─────────────────────────────────────
// 공용
// ─────────────────────────────────────
function SectionTitle({ icon, label, count }: { icon: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <h3 className="text-[15px] font-bold text-[#1E2125]">{label}</h3>
      <span className="text-[12px] text-[#9CA3AF]">({count})</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    COMPLETED: { bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', label: '분석 완료' },
    PENDING: { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', label: '분석 중' },
    FAILED: { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', label: '분석 실패' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10.5px] ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="text-[12.5px] text-[#9CA3AF] py-6 text-center">{text}</p>;
}
