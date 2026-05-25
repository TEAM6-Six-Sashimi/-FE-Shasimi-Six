import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        </body>
    </html>
  );
}
