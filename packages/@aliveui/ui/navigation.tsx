"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { cn } from "../lib/utils"

export function Navigation() {
    const pathname = usePathname()

    const links = [
        { href: "/", label: "Index", glyph: "A" },
        { href: "/work", label: "Work", glyph: "S" },
        { href: "/about", label: "About", glyph: "D" },
        { href: "/contact", label: "Contact", glyph: "F" },
    ]

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="fixed top-0 left-0 right-0 z-40 flex items-start justify-between px-4 py-4 md:px-6 md:py-6 text-[#1a1a1a] mix-blend-difference invert"
        >
            <Link href="/" className="font-sans font-bold tracking-tighter text-xl md:text-2xl uppercase leading-none">
                Applause
                <span className="block text-[10px] font-mono opacity-60 tracking-normal normal-case">
                    Studio Freight
                </span>
            </Link>

            <div className="flex flex-col items-end gap-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="group flex items-center gap-2 font-mono text-sm uppercase hover:opacity-70 transition-opacity"
                    >
                        <span className={cn(
                            "opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0",
                            pathname === link.href && "opacity-100 translate-x-0"
                        )}>
                            [{link.glyph}]
                        </span>
                        <span>{link.label}</span>
                    </Link>
                ))}
            </div>
        </motion.nav>
    )
}
