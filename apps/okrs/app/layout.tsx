import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@aliveui";
import { AppSidebar, sidebarData } from "@/components/app-sidebar-wrapper";
import { getUserProfile } from "@/actions/user-actions";
import { getKeyResults } from "@/actions/key-results-actions";
import { KeyResultsProvider } from "@/context/key-results-context";
import { SiteHeader } from "@/components/site-header";
import { MobileNav } from "@/components/mobile-nav";
import { ReduxProvider } from "@repo/store";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Floslate OKRs",
  description: "Manage your objectives and key results",
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

  // Fetch initial data
  const initialData = await getKeyResults();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>
          <KeyResultsProvider initialData={initialData}>
            <AppShell
              user={user}
              navMain={sidebarData.navMain}
              appName="OKRs"
              sidebar={<AppSidebar navMain={sidebarData.navMain} user={user} />}
              header={
                <SiteHeader
                  user={user}
                  navMain={sidebarData.navMain}
                  appName="OKRs"
                />
              }
              mobileNav={<MobileNav user={user} />}
            >
              {children}
            </AppShell>
          </KeyResultsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
