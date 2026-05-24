import UserSidebar from "@/components/layout/UserSidebar";

export default function UserMypageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-row">
      <UserSidebar />
      <main className="flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
