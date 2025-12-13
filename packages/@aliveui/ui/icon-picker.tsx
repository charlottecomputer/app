"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@aliveui"
import { Button } from "./button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Icon, icons, type IconName } from "./icon"
import { Input } from "./input"

interface IconPickerProps {
  value?: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredIcons = React.useMemo(() => {
    return Object.keys(icons).filter((icon) =>
      icon.toLowerCase().includes(search.toLowerCase())
    ) as IconName[]
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 px-3"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Icon icon={value as IconName} className="h-5 w-5" />
              <span className="capitalize">{value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select icon...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2 border-b">
          <div className="flex items-center px-2 border rounded-md bg-muted/50">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
            />
          </div>
        </div>
        <div className="p-2 grid grid-cols-5 gap-1 max-h-[300px] overflow-y-auto">
          {filteredIcons.map((iconName) => (
            <button
              key={iconName}
              onClick={() => {
                onChange(iconName)
                setOpen(false)
              }}
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                value === iconName && "bg-accent text-accent-foreground ring-2 ring-primary ring-offset-1"
              )}
              title={iconName}
            >
              <Icon icon={iconName} className="h-6 w-6" />
            </button>
          ))}
          {filteredIcons.length === 0 && (
            <div className="col-span-5 py-4 text-center text-sm text-muted-foreground">
              No icons found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
