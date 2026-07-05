'use client'

import * as React from 'react'
import { Mail, Phone, MapPin, Facebook, MessageCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { navigation } from '@/lib/data'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { setView } = useAppStore()

  return (
    <footer className="mt-auto bg-navy text-cream">
      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-gold/50 overflow-hidden">
              <img src="/ras-muta-logo.jpg" alt="RAS MUTA Foundation logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-serif text-base font-bold text-gold">
                RAS MUTA
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-cream/70">
                Foundation
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-cream/80">
            Carrying the candle forward — honouring a broadcasting legend through
            scholarships, mentorship, and the dignity of communities too often unheard.
          </p>
          <a
            href="https://wa.me/233242115299"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-cream ring-1 ring-white/15 transition-colors hover:bg-white/15"
          >
            <MessageCircle className="h-4 w-4 text-green-400" /> Chat on WhatsApp
          </a>
        </div>

        {/* Quick links */}
        <nav className="space-y-3" aria-label="Footer">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {navigation.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setView(item.key)}
                  className="transition-colors hover:text-gold"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              <span>
                Nyasorgbor House,<br />
                Denu Beach Road, opposite NHIS Office<br />
                Ketu South
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0 text-gold" />
              <span>0242115299</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0 text-gold" />
              <a href="mailto:info@rasmutafoundation.org" className="hover:text-gold">
                info@rasmutafoundation.org
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
            Follow
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream ring-1 ring-white/15 transition-colors hover:bg-gold hover:text-navy"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => setView('admin')}
              className="text-xs uppercase tracking-wider text-cream/60 transition-colors hover:text-gold"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-cream/70 sm:px-6 lg:px-8">
          <p className="text-center font-serif italic text-gold">
            In loving memory of Edem Divine Nyasorgbor (1979&ndash;2022).
          </p>
          <p className="text-center">
            &copy; {new Date().getFullYear()} The RAS MUTA Foundation.
            All rights reserved.
          </p>
          <p className="text-center text-cream/60">
            Powered and Designed by{' '}
            <a
              href="https://clipe233eng.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gold transition-colors hover:text-gold-light underline decoration-gold/40 underline-offset-2"
            >
              Clipe233 Engineers
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
