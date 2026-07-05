'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Heart, CalendarDays, BookOpen } from 'lucide-react'
import { broadcaster } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function Hero() {
  const { setView } = useAppStore()

  return (
    <section
      className="relative isolate overflow-hidden min-h-[88vh] flex items-center"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={broadcaster.heroImage}
          alt="A broadcaster in studio"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay" />
        {/* Subtle gold ambient light */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[80%] rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-serif text-4xl font-bold leading-[1.05] text-cream sm:text-5xl lg:text-6xl"
          >
            {broadcaster.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-3 text-base font-medium uppercase tracking-[0.18em] text-gold sm:text-lg"
          >
            {broadcaster.title}
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 max-w-2xl border-l-2 border-gold pl-5"
          >
            <p className="font-serif text-lg italic leading-relaxed text-cream/95 sm:text-xl">
              &ldquo;{broadcaster.quote}&rdquo;
            </p>
            <footer className="mt-2 text-xs uppercase tracking-[0.18em] text-cream/70">
              — {broadcaster.quoteAttribution}
            </footer>
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-cream/85 sm:text-lg"
          >
            {broadcaster.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Button
              onClick={() => setView('about-broadcaster')}
              size="lg"
              className="bg-gold-gradient text-navy font-semibold hover:opacity-90"
            >
              <BookOpen className="mr-2 h-4 w-4" /> Learn About His Legacy
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              onClick={() => setView('donate')}
              size="lg"
              variant="outline"
              className="border-gold/60 bg-navy/30 text-cream hover:bg-navy/50 hover:text-gold"
            >
              <Heart className="mr-2 h-4 w-4 text-gold" /> Support the Foundation
            </Button>
            <Button
              onClick={() => setView('events')}
              size="lg"
              variant="ghost"
              className="text-cream hover:bg-white/10 hover:text-gold"
            >
              <CalendarDays className="mr-2 h-4 w-4" /> Upcoming Events
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
