"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "../lib/utils"

interface LoaderProps extends HTMLMotionProps<"div"> {
    isLoading?: boolean
}

export function Loader({ className, isLoading = true, ...props }: LoaderProps) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? "auto" : "none" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-black text-white",
                className
            )}
            {...props}
        >
            <div className="relative flex items-center justify-center">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut", repeat: isLoading ? Infinity : 0 }}
                    className="h-[1px] bg-white absolute top-1/2 left-0 -translate-y-1/2"
                />
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-sm font-light tracking-widest uppercase"
                >
                    Loading
                </motion.span>
            </div>
        </motion.div>
    )
}
