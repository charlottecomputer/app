"use client"

import { useEffect, useRef } from "react"

export function ASCIIOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const draw = () => {
            if (!ctx || !canvas) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "rgba(0, 0, 0, 0.03)"

            // Draw random noise/pixels
            for (let i = 0; i < canvas.width; i += 4) {
                for (let j = 0; j < canvas.height; j += 4) {
                    if (Math.random() > 0.9) {
                        ctx.fillRect(i, j, 2, 2)
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        resize()
        window.addEventListener("resize", resize)
        draw()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-50 pointer-events-none mix-blend-multiply opacity-50"
        />
    )
}
