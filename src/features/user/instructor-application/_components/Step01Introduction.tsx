'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { UserInfo } from '@/lib/api/users';

interface Step01Data {
  motivation: string;
  introduction: string;
  equipment: string[];
}

interface Step01IntroductionProps {
  userInfo: UserInfo;
  data: Step01Data;
  onNext: (data: Step01Data) => void;
}

const EQUIPMENT_OPTIONS = ['카메라', '마이크', '조명'];

export default function Step01Introduction({ userInfo, data, onNext }: Step01IntroductionProps) {
  const [form, setForm] = useState<Step01Data>(data);
  const [submitted, setSubmitted] = useState(false);

  const toggleEquipment = (item: string) => {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const isValid = !!form.motivation.trim() && !!form.introduction.trim();

  const handleNext = () => {
    setSubmitted(true);
    if (!isValid) return;
    onNext(form);
  };

  const inputCls =
    'w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none';
  const labelCls = 'block text-[13.5px] font-semibold text-[#1E2125] mb-1.5';
  const isError = submitted && !isValid;

  return (
    <div className="flex flex-col gap-6">
      {/* 안내 메시지 */}
      <div className={`flex items-center gap-2 rounded-lg px-4 py-3 border transition-colors ${
        isError
          ? 'bg-[#FFEBEB] border-[#FF5E5E]'
          : 'bg-[#F9FBE7] border-[#827717]'
      }`}>
        <span className={`font-semibold ${isError ? 'text-[#FF5E5E]' : 'text-[#827717]'}`}>ⓘ</span>
        <p className={`text-[13px] font-semibold ${isError ? 'text-[#FF5E5E]' : 'text-[#827717]'}`}>
          지원자 기본 정보와 자기소개를 입력해주세요. 모든 항목은 필수 입력 사항입니다.
        </p>
      </div>

      {/* 로그인 정보 (수정 불가) */}
      <div className="border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#6A7282]">🔒</span>
          <span className="text-[14px] font-semibold text-[#6A7282]">로그인 정보 (수정 불가)</span>
        </div>
        <div className="flex gap-10">
          <div className="w-22 h-22 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center text-[#6A7282] text-[20px]">
            👤
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 flex-1">
            <div>
              <p className="text-[11.5px] text-[#6A7282]">이름</p>
              <p className="text-[13.5px] font-semibold text-[#1E2125]">{userInfo.name}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#6A7282]">생년월일</p>
              <p className="text-[13.5px] font-semibold text-[#1E2125]">{userInfo.birthDate}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#6A7282]">전화번호</p>
              <p className="text-[13.5px] font-semibold text-[#1E2125]">{userInfo.phone}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#6A7282]">이메일</p>
              <p className="text-[13.5px] font-semibold text-[#1E2125]">{userInfo.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 지원 동기 */}
      <div>
        <label className={labelCls}>
          지원 동기 <span className="text-[#FF5E5E]">*</span>
        </label>
        <textarea
          placeholder="강사로 지원하게 된 동기를 작성해주세요"
          value={form.motivation}
          onChange={(e) => setForm((prev) => ({ ...prev, motivation: e.target.value }))}
          rows={5}
          className={inputCls}
        />
      </div>

      {/* 간략한 자기 소개 */}
      <div>
        <label className={labelCls}>
          간략한 자기 소개 <span className="text-[#FF5E5E]">*</span>
        </label>
        <textarea
          placeholder="자신을 간략하게 소개해주세요"
          value={form.introduction}
          onChange={(e) => setForm((prev) => ({ ...prev, introduction: e.target.value }))}
          rows={5}
          className={inputCls}
        />
      </div>

      {/* 활영 장비 보유 여부 */}
      <div>
        <label className={labelCls}>활영 장비 보유 여부 (선택)</label>
        <div className="flex flex-col gap-2.5">
          {EQUIPMENT_OPTIONS.map((item) => (
            <label key={item} className="flex items-center gap-2.5 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={form.equipment.includes(item)}
                onChange={() => toggleEquipment(item)}
                className="w-4 h-4 accent-[#CFEE5D] cursor-pointer"
              />
              <span className="text-[13.5px] text-[#1E2125]">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 다음 버튼 */}
      <Button
        onClick={handleNext}
        className="w-full h-12 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
      >
        다음 &gt;
      </Button>
    </div>
  );
}