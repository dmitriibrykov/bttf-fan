import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import Providers from "@/components/Providers";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const exo2Sans = Exo_2({
  variable: "--font-exo-2-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Back to the Future",
  description: "BTTF Fan Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${exo2Sans.variable} ${exo2Sans.className} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <Header />
          <main className="p-2 md:p-6 flex-1 flex">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
