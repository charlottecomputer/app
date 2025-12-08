import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell, Text } from "@aliveui";
import { sidebarData } from "@/components/app-sidebar-wrapper";
// import { sidebarData } from "@/components/app-sidebar-wrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});



export const metadata: Metadata = {
  title: "Floslate Todo",
  description: "Manage your tasks with Floslate Todo",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppShell
          user={sidebarData.user}
          navMain={sidebarData.navMain}
          appName="Todo"
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
