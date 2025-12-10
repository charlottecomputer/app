"use client"

import { MobileDock, type MobileDockItem, Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@aliveui"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AddHabitForm } from "./add-habit-form"

export function TodoMobileNav({ user }: { user?: any }) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const items: MobileDockItem[] = [
        {
            id: "today",
            label: "Today",
            icon: "calendar",
            href: "/",
            active: pathname === "/"
        },
        {
            id: "projects",
            label: "Projects",
            icon: "apps",
            href: "/projects",
            active: pathname.startsWith("/projects")
        },
        {
            id: "add",
            label: "Add Task",
            type: "action",
            icon: "plus",
            onClick: () => {
                setOpen(true)
            }
        },
        {
            id: "goals",
            label: "Goals",
            icon: "todo",
            href: "/goals",
            active: pathname.startsWith("/goals")
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
                        <DrawerTitle>New Habit</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-8 h-[80vh]">
                        <AddHabitForm onSuccess={() => setOpen(false)} />
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}
