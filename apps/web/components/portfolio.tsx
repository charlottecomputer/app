"use client"

const apps = [
    { name: "Bartender", id: "bartender" },
    { name: "Blood Pressure Tracker+", id: "blood-pressure" },
    { name: "Glucose", id: "glucose" },
    { name: "Group Text", id: "group-text" },
    { name: "Meditation Moments", id: "meditation" },
    { name: "Nomorobo", id: "nomorobo" },
    { name: "SeizAlarm", id: "seizalarm" },
    { name: "Strongbox", id: "strongbox" },
    { name: "Voice Dream", id: "voice-dream" },
]

export function Portfolio() {
    return (
        <section className="home-portfolio layout-fh" style={{ maxHeight: "60svh", position: "relative" }}>
            <div className="home-portfolio__content layout-block">
                <p className="h1">
                    <span>
                        <span className="animate">Portfolio</span>
                    </span>
                    <span className="b-small counter">
                        <span className="animate">0{apps.length}</span>
                    </span>
                </p>
                <a href="/portfolio/" className="a-div has-link b-small link">
                    <span className="animate">
                        <span className="blue-dot-hover b-small">
                            <span className="text-content">See Full Portfolio</span>
                        </span>
                    </span>
                </a>
            </div>
            <div className="home-portfolio__footer" style={{ bottom: 0, position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                <div className="home-portfolio__footer__content" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--spacer-x) var(--spacer-md)", marginTop: "var(--spacer-xl)", maxWidth: "calc(var(--icon-size) * 4 + var(--spacer-md) * 3)" }}>
                    {apps.map((app) => (
                        <div key={app.id} className="dock-icon" style={{ height: "66px", width: "66px" }}>
                            <div>
                                <div style={{ opacity: 1, transform: "translate(0px, 0px)" }}>
                                    <div className="btn-icon active is-svg" style={{ backgroundColor: "var(--grey-100)", borderRadius: "14.301191766px", height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div className="btn-icon__content">
                                            <span className="btn-icon__content--icon" style={{ fontSize: "20px", color: "var(--white)" }}>
                                                {app.name.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="p-small">
                                <span>{app.name}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
