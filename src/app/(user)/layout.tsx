import Footer from '@/components/layout/Footer';
import Menubar from '@/components/layout/Menubar';
import { fetchCategories } from '@/services/categories.service';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const categories = await fetchCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Menubar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
