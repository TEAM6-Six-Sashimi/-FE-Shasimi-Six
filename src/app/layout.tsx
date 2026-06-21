import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ToastProvider } from '@/components/ui/ToastContext';
import Header from '@/components/layout/Header';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn('font-sans', geist.variable)}>
      <body className="flex-1">
        <ToastProvider>
          <Header />
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
