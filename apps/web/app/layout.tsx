import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";





import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "charlotte.computer",
  description: "A personal app store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans max-h-screen">
        <ClientLayout>

          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
