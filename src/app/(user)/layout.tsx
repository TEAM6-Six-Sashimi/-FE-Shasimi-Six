import Footer from '@/components/layout/Footer';
import Menubar from '@/components/layout/Menubar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Menubar />
      <main className="flex-1 container mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
