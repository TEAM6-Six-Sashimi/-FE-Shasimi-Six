import Header from '@/components/layout/Header';
import Menubar from '@/components/layout/Menubar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Menubar />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
