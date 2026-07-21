'use client';

import { useEffect, useRef, useState } from 'react';
import { PLAYBACK_RATES } from '../hooks/usePlayerSettings';

interface SpeedMenuProps {
  playbackRate: number;
  onChangeRate: (rate: number) => void;
}

export default function SpeedMenu({ playbackRate, onChangeRate }: SpeedMenuProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  // 배속 메뉴가 열려있을 때 바깥을 클릭하면 닫기
  useEffect(() => {
    if (!showSpeedMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSpeedMenu]);

  return (
    <div ref={speedMenuRef} className="relative">
      <button
        onClick={() => setShowSpeedMenu((v) => !v)}
        aria-label="재생 속도"
        className="cursor-pointer font-medium min-w-8 text-center"
      >
        {playbackRate}x
      </button>
      {showSpeedMenu && (
        <div className="absolute bottom-full right-0 mb-2 bg-[#1E2125] rounded-lg overflow-hidden shadow-lg">
          {PLAYBACK_RATES.map((rate) => (
            <button
              key={rate}
              onClick={() => {
                onChangeRate(rate);
                setShowSpeedMenu(false);
              }}
              className={`block w-full px-4 py-1.5 text-left whitespace-nowrap hover:bg-white/10 cursor-pointer ${
                rate === playbackRate ? 'text-[#FF5E5E] font-semibold' : 'text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
