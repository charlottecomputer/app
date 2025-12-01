"use client"

import { Navigation } from "@aliveui";

export function ClientLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <Navigation />
            {children}
        </>
    );
}
