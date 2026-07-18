'use client';

import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';

interface OneButtonModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export default function OneButtonModal({
  title,
  message,
  confirmLabel = '확인',
  onConfirm,
}: OneButtonModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-85 p-7 flex flex-col gap-5">
        <div>
          <h2 className="text-[18px] font-bold text-[#1E2125] mb-2">{title}</h2>
          <p className="text-[14px] text-[#6A7282] leading-relaxed whitespace-pre-line wrap-break-word">
            {message}
          </p>
        </div>
        <Button
          onClick={onConfirm}
          className="w-full py-3 h-auto rounded-xl bg-[#FF5E5E] text-white text-[15px] font-semibold hover:bg-[#D14848] cursor-pointer"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>,
    document.body,
  );
}
