import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell, Text } from "@aliveui";
import { AppSidebar, sidebarData } from "@/components/app-sidebar-wrapper";
import { getUserProfile } from "@/actions/user-actions";
import { getDailyProgress } from "@/actions/todo-actions";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Try to get the user profile, but don't fail if not authenticated
  let user;
  try {
    user = await getUserProfile();
  } catch (error) {
    // User not authenticated, user will be undefined
    user = undefined;
  }

  const dailyProgress = await getDailyProgress();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppShell
          user={user}
          navMain={sidebarData.navMain}
          appName="Todo"
          sidebar={<AppSidebar navMain={sidebarData.navMain} user={user} />}
          dailyProgress={{
            current: dailyProgress.completed,
            total: dailyProgress.total
          }}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
