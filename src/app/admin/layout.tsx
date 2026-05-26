import AdminSidebar from "@/components/layout/AdminSidebar";
import Footer from "@/components/layout/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}