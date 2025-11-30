import { Hero } from "../components/hero"
import { Blurb } from "../components/blurb"
import { Portfolio } from "../components/portfolio"

export default function Home() {
  return (
    <main className="front-page">
      <Hero />
      <Blurb />
      <Portfolio />
    </main>
  )
}
