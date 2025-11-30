"use client"

import { motion } from "motion/react"

export function Footer() {
    return (
        <footer className="layout-fh" style={{ minHeight: "50vh", justifyContent: "flex-end", paddingBottom: "var(--spacer-lg)" }}>
            <div className="layout-grid">
                <div className="layout-block" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="h1" style={{ fontSize: "12vw", lineHeight: 0.9 }}>
                            charlotte.computer
                        </h2>
                        <p className="b-small" style={{ marginTop: "var(--spacer-md)", opacity: 0.6 }}>
                            charlotte.computer
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ marginTop: "var(--spacer-xl)", display: "flex", justifyContent: "center", gap: "var(--spacer-md)" }}
                    >
                        <a href="#" className="b-small link">Twitter</a>
                        <a href="#" className="b-small link">Instagram</a>
                        <a href="mailto:hello@charlotte.computer.studio" className="b-small link">Email</a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ marginTop: "var(--spacer-xxl)", opacity: 0.4 }}
                    >
                        <p className="b-small">© 2024 charlotte.computer. All rights reserved.</p>
                    </motion.div>
                </div>
            </div>
        </footer>
    )
}
