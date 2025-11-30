import { Hero } from "../components/hero"
import { Blurb } from "../components/blurb"
import { Portfolio } from "../components/portfolio"
import { Footer } from "../components/footer"
import WorkPage from "./work/page"

export default function Home() {
  return (
    <main className="front-page">
      <Hero />
      <Blurb />

      <WorkPage />
      <Portfolio />
      <Footer />
    </main>
  )
}
