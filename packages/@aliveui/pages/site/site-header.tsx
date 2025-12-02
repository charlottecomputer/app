"use client"

import { SidebarIcon } from "lucide-react"

import {
  Button,
  // SearchForm,
  useSidebar,
  // FloslateLogo,
  Text,
  SidebarTrigger,
} from "@aliveui/ui"
import { AppLauncher } from "./app-launcher"
import { NavUser } from "./nav-user"
import { Icon, type IconName } from "@aliveui/ui/icon"
import React from "react"
import Link from "next/link"

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

  return (
    <header className="bg-sidebar sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-[40px] w-full items-center gap-3 px-4">

        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-3">

          <div className="flex items-center gap-2">
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
              //  className="md:hidden"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}

            >
              {/* @ts-ignore */}
              <SidebarIcon className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center: Search (if enabled and has space) */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            {/* <SearchForm className="w-full" /> */}
          </div>
        )}

        {/* Right: Sidebar toggle (mobile) and User menu */}
        <div className="flex items-center gap-2 ml-auto">
          <SidebarTrigger side="right" />
          <AppLauncher />
          <NavUser user={user} />
        </div>
      </div>
    </header>
  )
}
