import { fetchReviewReportsAction } from '@/features/admin/reportmanage/actions';
import ReportManagePage from './components/ReportManagePage';

export default async function Page() {
  const reports = await fetchReviewReportsAction();

  return <ReportManagePage initialReports={reports} />;
}