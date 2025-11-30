"use client"

import React from 'react';
import { ScrollRevealText, ScrollRevealSegment } from '@aliveui';

const segments: ScrollRevealSegment[] = [
    { type: 'label', content: 'Letter from Charlotte' },
    {
        type: 'text',
        content: 'This is me just revisiting what the personal computer was supposed to be. A blended solution into our daily life. A tool that worked plainly getting its job fulfilled wihtout asking of us to learn it\'s bizarre menu patterns and over-experimental UI choices.',
    }
];

export default function AboutPage() {
    return (
        <main className="about">
            <section className="about-hero layout-fh">
                <div className="about-hero__content">

                    <h1 className="super" aria-label="Towards a better app store">
                        <span className="upper">
                            <span>Minimal apps</span>
                        </span>
                        <span className="divisor" style={{ width: '100%' }}></span>
                        <span className="lower">
                            <span>to get shit done</span>
                        </span>
                    </h1>
                </div>
            </section>

            <section className="about-letter">
                <div className="about-letter__content layout-block">
                    <ScrollRevealText segments={segments} className="about-letter__content--title" />
                </div>
            </section>

            <section className="manifesto-section">
                <p>
                    <span className="manifesto-dropcap">S</span>
                    omething happened to mobile apps. They used to be refreshing discoveries—small marvels that enriched our lives without trying to trick us. You paid a fair price, and you got something you felt good about. It wasn’t perfect, but it was simpler, more direct, and driven by genuine innovation.
                </p>
                <p>
                    Then the tide turned. Dark patterns crept in, subscriptions multiplied, and algorithms buried honest work beneath gimmicks. The promise of a truly global marketplace for indie developers got tangled in hidden fees, abrupt reviews, and oversaturated charts. Many creators still build brilliant things, but their spark can be drowned out by noise.
                </p>
                <p>
                    We believe apps deserve better. At charlotte.computer, we’re assembling the best of the best—brands that prioritize thoughtful design and straightforward value. If you’re tired of rummaging through manipulative pop-ups or hunting for the one app that doesn’t misuse your data, you’re not alone. We see a future where quality software is easier to find and simpler to trust.
                </p>
                <p>
                    That’s where curation comes in. We sift through the clutter to champion apps that genuinely help you learn, relax, connect, or create. We don’t hide behind endless paywalls or sneaky tactics. Instead, we focus on delight, utility, and ethics. Every app we celebrate is built by people who think differently about user respect and product longevity.
                </p>
                <p>
                    The result is a fresh approach to an industry that lost its way. You...
                </p>
            </section>
        </main>
    );
}

