"use client"

import { Loader, Navigation, ASCIIOverlay } from "@aliveui";
import { useState, useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Simulate loading time or wait for resources
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* <ASCIIOverlay /> */}
            {/* <Loader isLoading={isLoading} /> */}
            <Navigation />
            {children}
        </>
    );
}
