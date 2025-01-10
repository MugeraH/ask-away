import type { Metadata } from "next";

import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Providers, TransitionWrapper } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Askaway",
  description: "Bring your questions , I will answer them",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex bg-[#121212] `}>
        <Sidebar />

        <Providers>
          <TransitionWrapper>
            <div className="w-full min-h-screen  flex-3  transition-all delay-100  text-white">
              {children}
            </div>
          </TransitionWrapper>
        </Providers>
      </body>
    </html>
  );
}
