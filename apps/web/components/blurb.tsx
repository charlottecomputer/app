"use client"

export function Blurb() {
    return (
        <section className="home-blurb layout-fh" style={{ marginTop: "144px", marginBottom: "144px" }}>
            <div className="layout-grid">
                <div className="home-blurb__content layout-block" style={{ gridColumn: "span 4" }}>
                    <h4>
                        <div className="storyblok-content body">
                            <p>
                                <span className="home-blurb-item" style={{ opacity: 1 }}>
                                    <span className="home-blurb-item__content">
                                        <span className="home-blurb-item__content--text">
                                            <span>Applause</span>
                                        </span>
                                    </span>
                                </span>{" "}
                                is reinventing mobile apps. We craft and curate{" "}
                                <span className="home-blurb-item" style={{ opacity: 1 }}>
                                    <span className="home-blurb-item__content">
                                        <span className="home-blurb-item__content--text">
                                            <span>brands</span>
                                        </span>
                                    </span>
                                </span>{" "}
                                with an emphasis on excellent, elegant, and ethical design. For users lost in a sea
                                of dark patterns, we aspire to be a beacon of light.{" "}
                                <span className="home-blurb-item" style={{ opacity: 1 }}>
                                    <span className="home-blurb-item__content">
                                        <span className="home-blurb-item__content--text">
                                            <span>Join us</span>
                                        </span>
                                    </span>
                                </span>{" "}
                                to build different.
                            </p>
                        </div>
                    </h4>
                </div>
            </div>
        </section>
    )
}
