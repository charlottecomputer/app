"use client"

import * as React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    AppIcon,
} from "@aliveui/ui"
import { mockapps } from "../../lib/apps"
import { useRouter } from "next/navigation"

interface AppCommandProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AppCommand({ open, onOpenChange }: AppCommandProps) {
    const router = useRouter()

    const runCommand = React.useCallback((command: () => unknown) => {
        onOpenChange(false)
        command()
    }, [onOpenChange])

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search apps..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Apps">
                    {mockapps.map((app) => (
                        <CommandItem
                            key={app.name}
                            onSelect={() => {
                                runCommand(() => router.push(app.url))
                            }}
                            className="flex items-center gap-3 p-2 cursor-pointer"
                        >
                            <div className="flex-shrink-0">
                                <AppIcon
                                    icon={app.icon as any}
                                    // label={app.name}
                                    color={app.color}
                                    size="sm"
                                />
                            </div>
                            <span className="font-medium">{app.name}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
