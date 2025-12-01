"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { MacOSDock } from "@aliveui"
import { Text } from "../../../packages/@aliveui/ui/text"

const apps = [
    {
        id: 'finder',
        name: 'Finder',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024'
    },
    {
        id: 'calculator',
        name: 'Calculator',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024'
    },
    {
        id: 'terminal',
        name: 'Terminal',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024'
    },
    {
        id: 'mail',
        name: 'Mail',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024'
    },
    {
        id: 'notes',
        name: 'Notes',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024'
    },
    {
        id: 'safari',
        name: 'Safari',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/safari-2021-06-02.png?rf=1024'
    },
    {
        id: 'photos',
        name: 'Photos',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/photos-2021-05-28.png?rf=1024'
    },
    {
        id: 'music',
        name: 'Music',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/music-2021-05-25.png?rf=1024'
    },
    {
        id: 'calendar',
        name: 'Calendar',
        icon: 'https://cdn.jim-nielsen.com/macos/1024/calendar-2021-04-29.png?rf=1024'
    },
]

export function Portfolio() {
    const [openApps, setOpenApps] = useState<string[]>(['finder', 'safari'])

    const handleAppClick = (appId: string) => {
        console.log('App clicked:', appId)

        setOpenApps(prev =>
            prev.includes(appId)
                ? prev.filter(id => id !== appId)
                : [...prev, appId]
        )
    }

    return (
        <section className="home-portfolio layout-fh" style={{ position: "relative" }}>
            <div className="home-portfolio__content layout-block">
                <Text variant="h1">
                    <span>
                        <motion.span
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="block"
                        >
                            Portfolio
                        </motion.span>
                    </span>
                    <span className="b-small counter">
                        <motion.span
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="block"
                        >
                            0{apps.length}
                        </motion.span>
                    </span>
                </Text>
                <a href="/portfolio/" className="a-div has-link b-small link">
                    <span className="block overflow-hidden">
                        <motion.span
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="blue-dot-hover b-small block"
                        >
                            <span className="text-content">See Full Portfolio</span>
                        </motion.span>
                    </span>
                </a>
            </div>
            <motion.div
                className="home-portfolio__footer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                style={{ bottom: 0, position: "relative", width: "100%", display: "flex", justifyContent: "center", marginTop: "var(--spacer-xl)" }}
            >
                <MacOSDock
                    apps={apps}
                    onAppClick={handleAppClick}
                    openApps={openApps}
                />
            </motion.div>
        </section>
    )
}
