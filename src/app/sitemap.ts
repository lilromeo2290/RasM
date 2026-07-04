import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site.config'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url
  const now = new Date()

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]
}
