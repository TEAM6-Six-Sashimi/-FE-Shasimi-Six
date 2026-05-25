export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col [&_footer]:hidden">
      <main className="flex-1 container mx-auto">
        {children}
      </main>
    </div>
  );
}