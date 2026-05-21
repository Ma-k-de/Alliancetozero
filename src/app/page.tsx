import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { Mission } from '@/components/Mission'
import { Pillars } from '@/components/Pillars'
import { Members } from '@/components/Members'
import { JoinCTA } from '@/components/JoinCTA'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Mission />
        <Pillars />
        <Members />
        <JoinCTA />
      </main>
      <Footer />
    </>
  )
}
