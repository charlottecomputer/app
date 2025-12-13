"use client"

import { SidebarIcon, Search } from "lucide-react"
import {
    Button,
    Label,
    useSidebar,
    Text,
    Input,
    Icon,
    type IconName,
    AppLauncher,
    NavUser,
    AppCommand,
    SmileyProgress
} from "@aliveui"
import React from "react"
import Link from "next/link"
import { useTodos } from "../hooks/use-todos"

export function SiteHeader({
    user,
    navMain,
    appName,
    showSearch = false,
}: {
    user?: { name: string; email: string; avatar: string },
    navMain?: { title: string; url: string; icon: IconName; isActive?: boolean; items?: { title: string; url: string }[] }[],
    appName?: string,
    showSearch?: boolean,
}) {
    const { toggleSidebar } = useSidebar()
    const [open, setOpen] = React.useState(false)
    const { dailyProgress } = useTodos()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <header className="bg-sidebar sticky top-0 z-50 flex w-full items-center ">
            <AppCommand open={open} onOpenChange={setOpen} />
            <div className=" grid grid-cols-7 h-[40px] w-full items-center gap-3 px-2">

                {/* Left: Logo and App Name */}
                <div className="col-span-2 flex items-center gap-3">

                    <div className="flex  items-center gap-2">
                        {/* @ts-ignore */}
                        <Link href="http://localhost:3000/">
                            <Icon icon="power" />
                        </Link>
                        {appName && (
                            <>
                                <Text size="lg" className="text-muted-foreground/50">|</Text>
                                <div className="cursor-pointer">
                                    <Text className="uppercase" variant="light" size="lg">{appName}</Text>
                                </div>
                            </>
                        )}
                    </div>

                    {navMain && navMain.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                        >
                            {/* @ts-ignore */}
                            <SidebarIcon className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                {/* Center: Search (if enabled and has space) OR Smiley Progress */}
                <div className="hidden col-span-3 md:flex flex-1 justify-center flex align-center">
                    {dailyProgress ? (
                        <SmileyProgress
                            current={dailyProgress.current}
                            total={dailyProgress.total}
                            onClick={() => setOpen(true)}
                        />
                    ) : (
                        <div className="w-full cursor-pointer" onClick={() => setOpen(true)}>
                            <div className="relative w-full pointer-events-none">
                                <Label htmlFor="search" className="sr-only">
                                    Search
                                </Label>
                                <Input
                                    id="search"
                                    placeholder="Type to search..."
                                    className="h-8 pl-7 pointer-events-none"
                                />
                                <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 flex">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Sidebar toggle (mobile) and User menu */}
                <div className="col-span-2 flex items-center gap-2 ml-auto">
                    <AppLauncher />
                    <NavUser user={user} />
                </div>
            </div>
        </header>
    )
}
