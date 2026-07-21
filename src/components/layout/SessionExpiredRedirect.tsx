'use client';

import { useEffect, useRef } from 'react';
import { logoutAction } from '@/features/auth/actions';
import { useToast } from '@/components/ui/ToastContext';

interface Props {
  message: string;
}

// 세션이 죽은 걸 감지하면 이 컴포넌트를 대신 렌더링해 클라이언트에서
// logoutAction을 호출하는 방식으로 쿠키 정리 + 리다이렉트를 수행한다.
export default function SessionExpiredRedirect({ message }: Props) {
  const { showToast } = useToast();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    showToast(message, 'alarm');
    logoutAction();
  }, []);

  return null;
}
