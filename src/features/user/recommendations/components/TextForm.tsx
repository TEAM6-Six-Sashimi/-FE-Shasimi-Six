'use client';

import { useState } from 'react';

interface TextFormProps {
  onSubmit: (rawContent: string) => void;
  loading: boolean;
}

const MIN_LENGTH = 30;

export default function TextForm({ onSubmit, loading }: TextFormProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = text.trim();
    if (trimmed.length < MIN_LENGTH) {
      setError(`최소 ${MIN_LENGTH}자 이상 입력해 주세요. (현재 ${trimmed.length}자)`);
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-[13px] font-semibold text-[#1E2125] mb-2">
        채용공고 본문 <span className="text-[#FF5F5F]">*</span>
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`채용공고 본문을 그대로 붙여넣어 주세요.

예)
[모집부문] 백엔드 개발자
[주요업무] Spring Boot 기반 서비스 개발/운영, MSA 환경에서의 API 설계 ...
[자격요건] Java/Spring 3년 이상, MySQL, AWS 사용 경험
[우대사항] Kafka, Redis 경험, 정보처리기사 ...`}
        disabled={loading}
        rows={10}
        className="w-full px-3.5 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5F5F] transition-colors disabled:bg-[#F9FAFB] resize-y leading-relaxed"
      />
      <div className="flex items-center justify-between mt-1.5">
        {error ? (
          <p className="text-[12px] text-[#DC2626] font-medium">{error}</p>
        ) : (
          <p className="text-[11.5px] text-[#6A7282]">
            본문을 자세히 붙여넣을수록 추천 정확도가 올라갑니다.
          </p>
        )}
        <span className="text-[11.5px] text-[#9CA3AF]">{text.trim().length}자</span>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-4 h-11 rounded-lg text-white font-semibold text-[14px] transition-all ${
          loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-[#FF5F5F] hover:bg-[#D14848] cursor-pointer active:scale-[0.99]'
        }`}
      >
        {loading ? 'AI가 분석 중...' : '분석하기'}
      </button>
    </form>
  );
}
