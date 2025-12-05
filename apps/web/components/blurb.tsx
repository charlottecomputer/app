"use client"

import { RevealOnScroll } from "@aliveui"

export function Blurb() {
    return (
        <div className="flex flex-col px-24  justify-center w-full items-center  ">


            <RevealOnScroll
                segments={[
                    { type: 'text', content: "Start with your own " },
                    { type: 'label', content: "personal OS" },
                    { type: 'text', content: ". Curate from a " },
                    { type: 'label', content: "catalogue of 1000s" },
                    { type: 'text', content: " of apps. Make it completely yours with " },
                    { type: 'label', content: "unified themes" },
                    { type: 'text', content: ". Minimalistic apps for every job to be done: Todos, Calendar, Projects, Documents. " },
                    { type: 'label', content: "Super minimal" },
                    { type: 'text', content: "." }
                ]}
            />
        </div>
    )
}
