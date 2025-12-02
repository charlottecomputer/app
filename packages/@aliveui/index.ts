export * from "./lib/utils";
export * from "./hooks/use-mobile";
export * from "./ui/scroll-reveal-text";
export { Navigation } from "./ui/navigation";
export { Marquee } from "./ui/marquee";
export { Button } from "./ui/button";
export { MacOSDock, type DockApp, type MacOSDockProps } from "./components/ui/shadcn-io/mac-os-dock";
export {Card,CardContent} from "./ui/card";
export {Input} from "./ui/input";
export {Icon, type IconName} from "./ui/icon";
export {AppShell} from "./blocks/app-shell"
export {Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,

  useSidebar,
 
  SidebarTrigger,
} from "./ui/sidebar"
export {Separator} from "./ui/separator"
export {Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger} from "./ui/sheet"
export {Skeleton} from "./ui/skeleton"

export {Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,   } from "./ui/tooltip"


export {Collapsible,
  CollapsibleContent,
  CollapsibleTrigger} from "./ui/collapsible"

export {RightSidebar} from "./ui/right-sidebar"

export {Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,} from "./ui/breadcrumb"

  export { DropdownMenu,
  DropdownMenuTrigger,  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,} from "./ui/dropdown-menu"

  export {AppIcon} from "./ui/app-icon" 

  export {  Avatar,
  AvatarFallback,
  AvatarImage} from "./ui/avatar"
  export {Text} from "./ui/text"
  export { ScrollProvider, useScrollContainer } from "./ui/scroll-context"