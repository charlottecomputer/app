
"use client"
import { Hero } from "../components/hero"
import { Blurb } from "../components/blurb"
import { Portfolio } from "../components/portfolio"
import { Footer } from "../components/footer"
import WorkPage from "./work/page"
import { EtheralShadow } from "@aliveui"

export default function Home() {
  return (
    <main className=" rounded-[45px] !bg-background !text-foreground">
      <EtheralShadow
        color="linear-gradient(to bottom right, var(--chart-1), var(--chart-2), var(--chart-3), var(--chart-4), var(--chart-5))"
        // animation={{
        //   scale: 50,
        //   speed: 120
        // }}
        // staticFilter={true}

        className="opacity-80 h-screen absolute inset-0"
      />
      <Hero />
      <Blurb />

      <WorkPage />

      <Footer />
    </main>
  )
}
