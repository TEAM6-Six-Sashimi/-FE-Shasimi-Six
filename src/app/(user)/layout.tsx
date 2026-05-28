import Footer from '@/components/layout/Footer';
import Menubar from '@/components/layout/Menubar';
import { fetchCategories } from '@/services/categories.service';

type Role = 'STUDENT' | 'INSTRUCTOR' | 'GUEST';

async function fetchUserRole(): Promise<Role> {
  // TODO: 실제 로그인 유저 role API 연결
  return 'INSTRUCTOR'; // 임시 목업 → 'INSTRUCTOR'로 바꾸면 강사 메뉴로 전환
}

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const [categories, role] = await Promise.all([
    fetchCategories(),
    fetchUserRole(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Menubar categories={categories} role={role} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}