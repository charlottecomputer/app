"use client"

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Icon,
} from "@aliveui/ui"
import { AppIcon } from "@aliveui/ui"
import { GridIcon } from "lucide-react"
export const mockapps = [
  {
    name: "Todo",
    icon: "todo" as const,
    color: "bg-chart-1",
    url: "http://localhost:3001"
  },
  {
    name: "Calendar",
    icon: "calendar" as const,
    color: "bg-chart-2",
    url: "http://localhost:3002"
  },
  ,
  {
    name: "Mad Cooking",
    icon: "chef",
    color: "bg-chart-3",
    url: "http://localhost:3002"
  },
  {
    name: "Quiz Creator",
    icon: "quiz",
    color: "bg-chart-4",
    url: "http://localhost:3002"
  },
  {
    name: "Aspie Chat",
    icon: "chat",
    color: "bg-chart-5",
    url: "http://localhost:3002"
  }, {
    name: "Hypertrophy",
    icon: "weight",
    color: "bg-chart-1",
    url: "http://localhost:3002"
  },
  {
    name: "Tea Creations",
    icon: "tea",
    color: "bg-chart-2",
    url: "http://localhost:3002"
  },
  {
    name: "Journal",
    icon: "journal",
    color: "bg-chart-3",
    url: "http://localhost:3002"
  },
  // Future apps can be added here
]

interface AppLauncherProps {
  apps?: Array<{
    name: string
    icon: string
    color: string
    url: string
  }>
}



export function AppLauncher({ apps = mockapps }: AppLauncherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Icon icon="apps" weight="bold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Apps</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 flex flex-wrap px-4">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.url}
              className="col-span-1"
            >
              <div className="transition-transform group-hover:scale-110">
                <AppIcon
                  icon={app.icon as any}
                  label={app.name}
                  color={app.color}
                  size="lg"

                />
              </div>
              {/* <span className="text-xs text-center">{app.name}</span> */}
            </a>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
