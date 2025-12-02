"use client"

import * as React from "react"

interface ScrollContextValue {
    scrollContainerRef: React.RefObject<HTMLElement | null>
}

const ScrollContext = React.createContext<ScrollContextValue | undefined>(undefined)

export function ScrollProvider({
    children,
    containerRef,
}: {
    children: React.ReactNode
    containerRef: React.RefObject<HTMLElement | null>
}) {
    return (
        <ScrollContext.Provider value={{ scrollContainerRef: containerRef }}>
            {children}
        </ScrollContext.Provider>
    )
}

export function useScrollContainer() {
    const context = React.useContext(ScrollContext)
    if (context === undefined) {
        // Return a dummy ref that might point to window/document body if needed, or null
        // Ideally, consumers should handle null or fallback to window
        return { scrollContainerRef: { current: null } }
    }
    return context
}
