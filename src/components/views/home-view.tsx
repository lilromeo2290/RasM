'use client'

import { Hero } from '@/components/sections/hero'
import { Legacy } from '@/components/sections/legacy'
import { MemorialGallery } from '@/components/sections/memorial-gallery'
import { FoundationOverview } from '@/components/sections/foundation-overview'
import { FeaturedPrograms } from '@/components/sections/featured-programs'
import { Testimonials } from '@/components/sections/testimonials'

export function HomeView() {
  return (
    <>
      <Hero />
      <Legacy />
      <MemorialGallery />
      <FoundationOverview />
      <FeaturedPrograms />
      <Testimonials />
    </>
  )
}
