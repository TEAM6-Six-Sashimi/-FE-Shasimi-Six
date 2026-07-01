import { cookies } from 'next/headers';
import Footer from '@/components/layout/Footer';
import Menubar from '@/components/layout/Menubar';
import { fetchCategories } from '@/services/categories.service';
import { fetchUserMe } from '@/services/user.service';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const [categories, user] = await Promise.all([
    fetchCategories(),
    accessToken ? fetchUserMe(accessToken) : Promise.resolve(null),
  ]);

  const role = user?.role === 'STUDENT' || user?.role === 'INSTRUCTOR' ? user.role : 'GUEST';

  return (
    <div className="min-h-screen flex flex-col">
      <Menubar categories={categories} role={role} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
