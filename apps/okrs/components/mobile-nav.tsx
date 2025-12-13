"use client"

import { MobileDock, type MobileDockItem, Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@aliveui"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AddKeyResultDrawer } from "./add-key-result-drawer"

export function MobileNav({ user }: { user?: any }) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const items: MobileDockItem[] = [
        {
            id: "today",
            label: "Today",
            icon: "calendar",
            href: "/dashboard",
            active: pathname === "/dashboard"
        },
        {
            id: "objectives",
            label: "Objectives",
            icon: "sun",
            href: "/dashboard/objectives",
            active: pathname.startsWith("/dashboard/objectives")
        },
        {
            id: "add",
            label: "Add Key Result",
            type: "action",
            icon: "plus",
            onClick: () => {
                setOpen(true)
            }
        },
        {
            id: "inbox",
            label: "Inbox",
            icon: "todo",
            href: "/inbox",
            active: pathname.startsWith("/inbox")
        },
        {
            id: "profile",
            label: "Profile",
            type: "avatar",
            image: user?.avatar,
            href: "/settings",
            active: pathname.startsWith("/settings")
        }
    ]

    return (
        <>
            <MobileDock items={items} className="md:hidden" />
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>New Key Result</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-8 h-[80vh]">
                        <AddKeyResultDrawer onSuccess={() => setOpen(false)} />
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}
