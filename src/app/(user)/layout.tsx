import { cookies } from 'next/headers';
import Footer from '@/components/layout/Footer';
import Menubar from '@/components/layout/Menubar';
import { fetchCategories } from '@/services/categories.service';
import { fetchUserMe } from '@/services/user.service';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  console.log('=== Layout Debug ===');
  console.log('accessToken:', accessToken ? accessToken.slice(0, 20) + '...' : '없음');

  const [categories, user] = await Promise.all([
    fetchCategories(),
    accessToken ? fetchUserMe(accessToken) : Promise.resolve(null),
  ]);

  console.log('user:', user);
  console.log('role:', user?.role ?? 'GUEST');

  const role = user?.role === 'STUDENT' || user?.role === 'INSTRUCTOR' ? user.role : 'GUEST';

  return (
    <div className="min-h-screen flex flex-col">
      <Menubar categories={categories} role={role} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
