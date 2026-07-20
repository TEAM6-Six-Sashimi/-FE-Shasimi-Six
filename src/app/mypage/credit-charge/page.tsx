import { cookies } from 'next/headers';
import { fetchCreditChargeHistory } from '@/services/credit.service';
import CreditChargeTable from '@/features/mypage/components/credit-charge/CreditChargeTable';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function MyPageCreditChargePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center text-[#6A7282]">
        로그인이 필요합니다.
      </div>
    );
  }

  let history;
  try {
    history = await fetchCreditChargeHistory(accessToken);
  } catch (e) {
    // 동시 접속 등으로 세션이 완전히 끊긴 경우 - 로그아웃 처리
    if (e instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={e.message} />;
    }
    throw e;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">크레딧 충전 내역</h1>

      <CreditChargeTable items={history.items} />
    </div>
  );
}
