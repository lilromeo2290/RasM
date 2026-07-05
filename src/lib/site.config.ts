/**
 * Central site configuration.
 *
 * Update this file when deploying to a new domain. All SEO metadata,
 * OpenGraph URLs, sitemap references, and absolute URLs across the app
 * should read from these values so the production site resolves correctly.
 */

export const siteConfig = {
  /** Production domain (no protocol, no trailing slash). */
  domain: 'rasmutafoundation.org',

  /** Full base URL (no trailing slash). */
  get url() {
    return `https://${this.domain}`
  },

  /** Site name shown in browser tab, OpenGraph, and footer. */
  name: 'RAS MUTA Foundation',

  /** Short tagline used in metadata descriptions. */
  tagline:
    'Honoring the life, work, and enduring legacy of broadcaster Edem Divine Nyasorgbor through education, mentorship, and community development.',

  /** Default OG/Twitter share image (relative to /public). */
  ogImage: '/ras-muta-logo.jpg',

  /** Contact email shown across the site. */
  email: {
    general: 'info@rasmutafoundation.org',
    press: 'press@rasmutafoundation.org',
  },

  /** Primary phone number. */
  phone: '0242115299',

  /** Social profile (only Facebook is currently used). */
  social: {
    facebook: 'https://facebook.com',
  },

  /** WhatsApp click-to-chat link. */
  whatsapp: 'https://wa.me/233242115299',
} as const

export type SiteConfig = typeof siteConfig
