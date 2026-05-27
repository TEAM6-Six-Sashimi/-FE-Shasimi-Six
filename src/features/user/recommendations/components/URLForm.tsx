'use client';

import { useState } from 'react';

interface URLFormProps {
  onSubmit: (sourceUrl: string) => void;
  loading: boolean;
}

export default function URLForm({ onSubmit, loading }: URLFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = url.trim();
    if (!trimmed) {
      setError('채용공고 URL을 입력해 주세요.');
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setError('올바른 URL 형식이 아닙니다. (예: https://...)');
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-[13px] font-semibold text-[#1E2125] mb-2">
        채용공고 URL <span className="text-[#FF5F5F]">*</span>
      </label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.example.com/job-posting/123"
        disabled={loading}
        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5F5F] transition-colors disabled:bg-[#F9FAFB]"
      />
      {error && (
        <p className="text-[12px] text-[#DC2626] mt-1.5 font-medium">{error}</p>
      )}
      <p className="text-[11.5px] text-[#6A7282] mt-1.5">
        잡코리아, 사람인, 원티드 등의 채용공고 URL을 입력하세요.
      </p>
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
