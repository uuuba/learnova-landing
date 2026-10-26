import { Providers } from '@/components/Providers'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import {
  Courses,
  Faq,
  Features,
  Footer,
  How,
  Stats,
  Subscribe,
} from '@/components/Sections'

export default function Page() {
  return (
    <Providers>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <How />
        <Courses />
        <Faq />
        <Subscribe />
      </main>
      <Footer />
    </Providers>
  )
}
