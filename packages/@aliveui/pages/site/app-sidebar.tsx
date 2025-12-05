import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, Icon, IconName } from "@aliveui";
import { NavMain } from "./nav-main";

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
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    navMain?: {
        title: string
        url: string
        icon: IconName
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
    user?: {
        name: string
        email: string
        avatar: string
    }
}
export function AppSidebar({ navMain, user, ...props }: AppSidebarProps) {

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

export default AppSidebar;