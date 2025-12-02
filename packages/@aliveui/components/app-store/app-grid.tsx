"use client"

import { AppIcon } from "../../ui/app-icon"
import { mockapps } from "../../lib/apps"
import Link from "next/link"

export function AppGrid() {
    return (
        <div className="min-h-screen w-full p-8 md:p-16">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 md:gap-12 justify-items-center">
                {mockapps.map((app) => (
                    <Link
                        key={app.name}
                        href={app.url}
                        className="flex flex-col items-center gap-3 group transition-transform hover:scale-105"
                    >
                        <AppIcon
                            icon={app.icon as any}
                            label={app.name}
                            color={app.color}
                            size="xl"
                            className="shadow-lg"
                        />
                        <span className="text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                            {app.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
