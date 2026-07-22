import { cookies } from 'next/headers';
import MonitoringCard from '@/features/admin/Dashboard/components/MonitoringCard';
import DashboardSummary from '@/features/admin/Dashboard/components/DashboardSummary';
import DashboardCharts from '@/features/admin/Dashboard/components/DashboardCharts';
import {
  fetchAdminDashboardSummary,
  fetchAdminDashboardStatistics,
} from '@/services/admin-dashboard.service';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  const [summary, statistics] = await Promise.all([
    fetchAdminDashboardSummary(accessToken),
    fetchAdminDashboardStatistics(accessToken),
  ]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      <DashboardSummary summary={summary} statistics={statistics} />
      <DashboardCharts />
      <MonitoringCard />
    </div>
  );
}
