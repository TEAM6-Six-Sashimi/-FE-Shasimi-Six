import { cookies } from 'next/headers';
import { fetchCreditBalance } from '@/services/credit.service';
import CreditClient from '@/features/user/credit/components/CreditClient';

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
      console.error('크레딧 조회 실패:', e);
    }
  }

  return <CreditClient initialCredit={initialCredit} />;
}
