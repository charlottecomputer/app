"use client"

import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useSidebar,
} from "@aliveui/ui"

export function NavUser({
  user,
}: {
  user?: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  console.log('user', user)
  if (!user) return null

  // if (!user) {
  //   return (
  //     <div className="flex items-center gap-2">
  //       <Button variant="ghost" size="sm" asChild>
  //         <a href="/login/">
  //           Log in
  //         </a>
  //       </Button>
  //       <Button variant="ghost" size="sm" asChild>
  //         <a href="/signup">
  //           Sign up
  //         </a>
  //       </Button>
  //     </div>
  //   )
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full"
          variant="ghost"
          size="icon"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-72 rounded-xl p-2"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-3 text-left">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="font-semibold text-base">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-2.5">
            <Settings className="mr-2 h-4 w-4" />
            Floslate Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2.5">
            <BadgeCheck className="mr-2 h-4 w-4" />
            Manage Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-2.5 text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
