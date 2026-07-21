import CreditCharges from '@/features/admin/creditmanage/components/CreditCharges';

export default function CreditManagePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 크레딧 관리</h1>
      <CreditCharges />
    </div>
  );
}
