"use client"

import React from 'react';
import { ScrollRevealText, ScrollRevealSegment } from '@aliveui';

const segments: ScrollRevealSegment[] = [
    { type: 'label', content: 'Founder Letter' },
    {
        type: 'text',
        content: 'Applause is reinventing mobile apps—crafting and curating brands with an emphasis on excellent, elegant, and ethical design. For users lost in a sea of dark patterns, we aspire to be a beacon of light. Join us to build different.',
    }
];

export default function AboutPage() {
    return (
        <main className="about">
            <section className="about-hero layout-fh">
                <div className="about-hero__content">
                    <div className="about-hero__content--svg" style={{ opacity: 1 }}>
                        <svg width="372" height="440" viewBox="0 0 372 440" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.48">
                                <path d="M371.988 0.650045V12.5118C367.729 12.5118 363.419 12.5118 359.16 12.5118C359.122 16.4499 359.186 20.4354 359.16 24.3854H346.32V12.5118C350.579 12.5118 354.889 12.5118 359.16 12.5118C359.199 8.57368 359.135 4.58814 359.16 0.638184H372L371.988 0.650045Z" fill="#E2E2E2"></path>
                                <path d="M320.68 59.9693C320.718 56.0312 320.654 52.0457 320.68 48.0957H333.52V59.9693C329.261 59.993 324.951 59.9218 320.68 59.9693C320.641 63.9074 320.706 67.8929 320.68 71.8429H307.84V59.9693C312.098 59.9456 316.408 60.0167 320.68 59.9693Z" fill="#E2E2E2"></path>
                                <path d="M51.3089 261.617C34.2358 261.878 17.073 261.427 0 261.617V237.894H12.8272V202.308H25.6673L25.6544 190.435H38.4945V178.585H64.1489V166.711L76.9889 166.723V154.85H115.458V119.264H141.112V107.391L153.952 107.403V95.5291H205.248V107.403L218.088 107.391V119.264L230.916 119.253V131.126C235.161 131.126 239.471 131.126 243.73 131.126C243.768 127.188 243.704 123.202 243.73 119.253C247.989 119.229 252.299 119.3 256.57 119.253C256.608 115.314 256.544 111.329 256.57 107.379C260.829 107.355 265.139 107.426 269.41 107.379C269.448 103.441 269.384 99.4553 269.41 95.5054H282.25V107.379C277.991 107.403 273.681 107.332 269.41 107.379C269.372 111.317 269.436 115.303 269.41 119.253C265.151 119.276 260.841 119.205 256.57 119.253C256.531 123.191 256.596 127.176 256.57 131.126C252.311 131.126 248.001 131.126 243.73 131.126C243.691 135.064 243.756 139.05 243.73 143H230.89V154.85H269.372V166.711H295.026V178.585L307.866 178.573V190.447L320.693 190.435V202.308H333.508V309.064H320.668L319.936 297.178H307.84V309.064H269.359V297.202H243.704V285.329C235.174 285.246 226.58 285.459 218.05 285.329C218.011 277.441 218.075 269.493 218.05 261.593C213.791 261.57 209.481 261.641 205.21 261.593C205.146 257.655 205.261 253.67 205.21 249.72H192.37V261.593C196.628 261.617 200.938 261.546 205.21 261.593C205.351 269.481 205.107 277.429 205.21 285.329C209.468 285.376 213.778 285.257 218.05 285.329C218.204 312.99 217.934 340.711 218.05 368.373H205.21L205.223 380.234H192.383V403.946H166.728V415.808H128.247V427.681L115.406 427.669V439.543H102.579V427.669L89.752 427.681V415.808L76.9248 415.819V403.946H64.1104V380.222H51.2832V344.637H38.456V320.914H51.296C51.5398 301.176 50.9369 281.343 51.296 261.605C55.5547 261.546 59.8646 261.653 64.1361 261.605V249.732H51.296C51.2447 253.67 51.373 257.655 51.296 261.605L51.3089 261.617ZM218.075 166.711H205.235V178.585H218.075V166.711ZM179.594 226.02H166.754V237.894H179.594V226.02Z" fill="#E2E2E2"></path>
                            </g>
                        </svg>
                    </div>
                    <h1 className="super" aria-label="Towards a better app store">
                        <span className="upper">
                            <span>Towards a better</span>
                        </span>
                        <span className="divisor" style={{ width: '100%' }}></span>
                        <span className="lower">
                            <span>app store</span>
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
                    We believe apps deserve better. At Applause, we’re assembling the best of the best—brands that prioritize thoughtful design and straightforward value. If you’re tired of rummaging through manipulative pop-ups or hunting for the one app that doesn’t misuse your data, you’re not alone. We see a future where quality software is easier to find and simpler to trust.
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

