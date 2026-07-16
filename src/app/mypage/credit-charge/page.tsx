import { cookies } from 'next/headers';
import { fetchCreditChargeHistory } from '@/services/credit.service';
import CreditChargeTable from '@/features/mypage/components/credit-charge/CreditChargeTable';

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

  const history = await fetchCreditChargeHistory(accessToken);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">크레딧 충전 내역</h1>

      <CreditChargeTable items={history.items} />
    </div>
  );
}
