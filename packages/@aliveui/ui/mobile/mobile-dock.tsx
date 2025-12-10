"use client"

import * as React from "react"
import Link from "next/link"
import { cn, Icon, type IconName } from "@aliveui"
import { Monoco } from "@monokai/monoco-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"

export interface MobileDockItem {
    id: string
    label: string
    icon?: IconName
    type?: "icon" | "action" | "avatar"
    onClick?: () => void
    active?: boolean
    image?: string // For avatar
    href?: string
}

interface MobileDockProps {
    items: MobileDockItem[]
    className?: string
}

export function MobileDock({ items, className }: MobileDockProps) {
    return (
        <div className={cn("fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none", className)}>
            <Monoco
                borderRadius={32}
                smoothing={1}
                clip={true}
                className="pointer-events-auto flex items-center gap-2 bg-background/80 px-2 py-2 shadow-lg backdrop-blur-xl border border-white/10"
            >
                {items.map((item) => {
                    const content = (
                        <React.Fragment>
                            {item.type === "action" ? (
                                <div
                                    className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform active:scale-95"
                                >
                                    <Icon icon={item.icon || "plus"} weight="bold" className="h-6 w-6" />
                                </div>
                            ) : item.type === "avatar" ? (
                                <div
                                    className={cn(
                                        "relative flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95",
                                        item.active && "ring-2 ring-primary ring-offset-2"
                                    )}
                                >
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={item.image} alt={item.label} />
                                        <AvatarFallback><Icon icon="user" /></AvatarFallback>
                                    </Avatar>
                                </div>
                            ) : (
                                <div
                                    className={cn(
                                        "group relative flex h-10 w-10 flex-col items-center justify-center rounded-xl transition-all active:scale-95 hover:bg-white/10",
                                        item.active ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <Icon
                                        icon={item.icon || "apps"}
                                        weight={item.active ? "fill" : "regular"}
                                        className={cn("h-6 w-6 transition-colors", item.active && "text-primary")}
                                    />
                                    {/* Optional label or dot for active state */}
                                    {item.active && (
                                        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    )

                    if (item.href) {
                        return (
                            <Link key={item.id} href={item.href} onClick={item.onClick}>
                                {content}
                            </Link>
                        )
                    }

                    return (
                        <button key={item.id} onClick={item.onClick}>
                            {content}
                        </button>
                    )
                })}
            </Monoco>
        </div>
    )
}
