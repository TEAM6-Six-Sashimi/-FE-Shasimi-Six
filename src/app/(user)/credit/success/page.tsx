'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmCreditChargeAction } from '@/features/user/credit/actions';
import OneButtonModal from '@/components/modals/OneButtonModal';

type ConfirmState = 'loading' | 'success' | 'error';

export default function CreditSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ConfirmState>('loading');
  const [chargedAmount, setChargedAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setErrorMessage('결제 정보가 올바르지 않습니다.');
      setState('error');
      return;
    }

    confirmCreditChargeAction({
      paymentKey,
      orderId,
      amount: Number(amount),
    })
      .then((result) => {
        setChargedAmount(result.chargedAmount);
        setState('success');
      })
      .catch((err) => {
        setErrorMessage(
          err instanceof Error ? err.message : '결제 승인에 실패했습니다.',
        );
        setState('error');
      });
    // searchParams는 최초 진입 시 한 번만 읽으면 되므로 의존성 배열 비움
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-[15px] text-[#6A7282]">결제를 승인하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {state === 'success' && (
        <OneButtonModal
          title="충전 완료"
          message={`${chargedAmount.toLocaleString()} 크레딧이 충전되었습니다.`}
          onConfirm={() => router.push('/credit')}
        />
      )}
      {state === 'error' && (
        <OneButtonModal
          title="충전 실패"
          message={errorMessage}
          onConfirm={() => router.push('/credit')}
        />
      )}
    </div>
  );
}