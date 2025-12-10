
import { type IconName } from "@aliveui"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  NavMain
} from "@aliveui"

export function AppSidebar({ navMain, user, ...props }) {

  return (
    <Sidebar
      className="max-h-[calc(100vh-100px)] my-auto"
      {...props}
    >
      <SidebarHeader>

      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain || []} />
      </SidebarContent>
      <SidebarFooter>

      </SidebarFooter>
    </Sidebar>
  )
}

export const sidebarData: {
  user: {
    name: string
    email: string
    avatar: string
  }
  navMain: {
    title: string
    url: string
    icon: IconName
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
} = {
  user: {
    name: "Charlotte Bondarev",
    email: "charlotte@example.com",
    avatar: "https://media.gq-magazin.de/photos/67444f69e08fe3c8fb1a1be5/16:10/w_2240,c_limit/GQ0624_GER_Coverstory_Michele%20Lamy_4.jpg",
  },
  navMain: [
    {
      title: "Today",
      url: "/today",
      icon: "calendar",
      isActive: true,
      items: [],
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: "inbox",
      items: [],
    },
    {
      title: "Upcoming",
      url: "/upcoming",
      icon: "calendar",
      items: [],
    },
  ],
}

export function AppSidebarWrapper() {
  return <AppSidebar navMain={sidebarData.navMain} user={sidebarData.user} />
}
