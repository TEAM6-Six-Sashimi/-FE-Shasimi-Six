import AdminSidebar from '@/components/layout/AdminSidebar';
import Footer from '@/components/layout/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-row flex-1">
        <AdminSidebar />
        <main className="flex-1 min-h-screen px-4 py-8 bg-[#F9FAFB]">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
