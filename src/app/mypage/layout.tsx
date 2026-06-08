import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import UserSidebar from "@/components/layout/UserSidebar";

export default async function UserMypageLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  const user = await fetchUserMe(accessToken);

  return (
    <div className="min-h-screen flex flex-row">
      <UserSidebar role={user.role} />
      <main className="flex-1 px-4 py-8">{children}</main>
    </div>
  );
}