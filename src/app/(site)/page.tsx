import { cmsEnabled } from '@/cms/client'
import { Landing } from '@/components/Landing'
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

export const dynamic = 'force-dynamic'

export default function Page() {
  if (cmsEnabled()) return <Providers><Landing /></Providers>
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
