import { AppShell } from "@aliveui"
import { sidebarData } from "@/components/app-sidebar-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell user={sidebarData.user} navMain={sidebarData.navMain}>
      {children}
    </AppShell>
  )
}
