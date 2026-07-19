import ServiceUnavailablePage from '@/components/system/ServiceUnavailablePage';

interface Props {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function MaintenancePage({ searchParams }: Props) {
  const { redirect } = await searchParams;

  return (
    <ServiceUnavailablePage
      message="현재 서비스 점검/업데이트 중입니다. 잠시 후 다시 이용해주세요."
      redirectTo={redirect}
    />
  );
}
