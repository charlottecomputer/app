"use client"

import { AppShell, Navigation } from "@aliveui";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@aliveui"
import { AppSidebar } from "@aliveui/pages/site/app-sidebar";
import { type IconName } from "@aliveui"

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
        name: "Charlotte",
        email: "charlotte@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Todos",
            url: "/dashboard",
            icon: "todo",
            isActive: true,
            items: [
                {
                    title: "My Todos",
                    url: "/dashboard",
                },
            ],
        },
        {
            title: "Documents",
            url: "/dashboard/documents",
            icon: "inbox",
            items: [],
        },
        {
            title: "Projects",
            url: "/dashboard/projects",
            icon: "filter",
            items: [],
        },
        {
            title: "Calendar",
            url: "/dashboard/calendar",
            icon: "calendar",
            items: [],
        },
    ],
}






export function AppSidebarWrapper() {
    return <AppSidebar navMain={sidebarData.navMain} />
}


export function ClientLayout({ children }: { children: React.ReactNode }) {

    return (
        <AppShell
            user={sidebarData.user}
            sidebar={false}
            collapsible="offcanvas"
            backgroundAnimated={true}
        >

            {/* <Navigation /> */}
            {children}
        </AppShell>
    );
}
