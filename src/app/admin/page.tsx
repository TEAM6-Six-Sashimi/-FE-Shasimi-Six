import { cookies } from 'next/headers';
import MonitoringCard from '@/features/admin/Dashboard/MonitoringCard';
import DashboardSummary from '@/features/admin/Dashboard/DashboardSummary';
import { fetchAdminDashboardSummary } from '@/services/admin-dashboard.service';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  const summary = await fetchAdminDashboardSummary(accessToken);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      <DashboardSummary summary={summary} />
      <MonitoringCard />
    </div>
  );
}