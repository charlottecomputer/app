"use client"

import { SiteHeader } from "@aliveui"

const user = {
  name: "Charlotte Bondarev",
  email: "charlotte@example.com",
  avatar: "https://media.gq-magazin.de/photos/67444f69e08fe3c8fb1a1be5/16:10/w_2240,c_limit/GQ0624_GER_Coverstory_Michele%20Lamy_4.jpg",
}

import { sidebarData } from "./app-sidebar-wrapper"

export function SiteHeaderWrapper() {
  return <SiteHeader user={user} navMain={sidebarData.navMain} appName="Todo" />
}
