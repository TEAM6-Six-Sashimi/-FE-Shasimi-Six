import { cookies } from 'next/headers';
import { fetchCreditBalance } from '@/services/credit.service';
import CreditClient from '@/features/user/credit/components/CreditClient';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function CreditPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // 서버에서 초기 크레딧 잔액 조회
  let initialCredit = 0;
  if (accessToken) {
    try {
      const data = await fetchCreditBalance(accessToken);
      initialCredit = data.balance;
    } catch (e) {
      // 동시 접속 등으로 세션이 완전히 끊긴 경우 - 잔액 0 대신 로그아웃 처리
      if (e instanceof AuthSessionError) {
        return <SessionExpiredRedirect message={e.message} />;
      }
      // 그 외 실패 시 초기값 0
    }
  }

  return <CreditClient initialCredit={initialCredit} />;
}
