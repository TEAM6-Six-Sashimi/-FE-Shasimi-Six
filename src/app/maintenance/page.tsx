import ServiceUnavailablePage from '@/components/system/ServiceUnavailablePage';

export default function MaintenancePage() {
  return (
    <ServiceUnavailablePage message="현재 서비스 점검/업데이트 중입니다. 잠시 후 다시 이용해주세요." />
  );
}
