"use client"

import {
  // EtheralShadow,
  RightSidebar,
} from "@aliveui"
import { Monoco } from "@monokai/monoco-react"
import {

  SiteFooter

} from "../pages/site/site-footer"
import { SiteHeader } from "../pages/site/site-header"
import { SidebarInset, SidebarProvider } from "@aliveui"
import { AppSidebar } from "../pages/site/app-sidebar"
import { ScrollProvider } from "../ui/scroll-context"
import * as React from "react"

interface AppShellProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar: string
  }
  navMain?: React.ComponentProps<typeof AppSidebar>["navMain"]
  sidebar?: React.ReactNode
  collapsible?: "offcanvas" | "icon" | "none"
  logo?: React.ReactNode
  appName?: string,
  backgroundAnimated?: boolean
}

export function AppShell({ children, user, navMain, sidebar, collapsible = "offcanvas", backgroundAnimated = false, appName }: AppShellProps) {
  const scrollRef = React.useRef<HTMLElement>(null)

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col h-svh w-svw bg-sidebar ">
        <SiteHeader user={user} navMain={navMain} appName={appName} />
        <div className="flex flex-1 bg-sidebar overflow-hidden">
          {/* {sidebar ? sidebar : <AppSidebar navMain={navMain} user={user} collapsible={collapsible} />} */}
          <SidebarInset className="flex flex-col bg-sidebar flex-1 overflow-hidden  p-[1px] relative">
            <Monoco
              borderRadius={45}
              smoothing={1}
              clip={true}
              className="flex-1 h-full w-full relative overflow-hidden"
            >
              {backgroundAnimated ? (
                <>
                  <div className="relative overflow-hidden shadow-inset shadow-[inset_0px_4px_58px_15px_var(--muted)] flex-1 h-full z-10">
                    <ScrollProvider containerRef={scrollRef}>
                      <main ref={scrollRef} className="flex-1 h-full w-full overflow-y-scroll !scrollbar-none">
                        {children}
                      </main>
                    </ScrollProvider>
                  </div>
                </>
              ) : (
                <main className="flex-1 border overflow-y-auto h-full">
                  {children}
                </main>
              )}
            </Monoco>
          </SidebarInset>
          {/* <RightSidebar /> */}
        </div>
        <SiteFooter />
      </div>
    </SidebarProvider>
  )
}
