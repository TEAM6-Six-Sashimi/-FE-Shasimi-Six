'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import OneButtonModal from '@/components/modals/OneButtonModal';

export default function CreditFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') ?? '결제가 취소되었거나 실패했습니다.';

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <OneButtonModal title="결제 실패" message={message} onConfirm={() => router.push('/credit')} />
    </div>
  );
}