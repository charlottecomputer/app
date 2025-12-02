"use client"

import { RevealOnScroll } from "@aliveui"

export function Blurb() {
    return (
        <RevealOnScroll
            segments={[
                { type: 'text', content: "Your daily life revolves around " },
                { type: 'label', content: "apps" },
                { type: 'text', content: " that actually fit you " },
                { type: 'label', content: "beautifully" },
                { type: 'text', content: " and your hectic life." },
                { type: 'text', content: " Get a suite minimally made to blend seamlessly into your everyday." }
            ]}
        />
    )
}
