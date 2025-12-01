import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, EB_Garamond } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "../components/smooth-scroll";




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
      <body className="font-sans">
        <SmoothScroll>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SmoothScroll>
      </body>
    </html>
  );
}
