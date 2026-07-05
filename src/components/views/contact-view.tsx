'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  CheckCircle2,
} from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { SectionHeading } from '@/components/shared/section-heading'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Office Address',
    lines: ['Nyasorgbor House,', 'Denu Beach Road, opposite NHIS Office', 'Ketu South'],
  },
  {
    icon: Phone,
    title: 'Telephone',
    lines: ['0242115299'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['info@rasmutafoundation.org', 'press@rasmutafoundation.org'],
  },
  {
    icon: Clock,
    title: 'Office Hours',
    lines: ['Monday – Friday: 9:00 – 17:00 WAT', 'Saturday: 10:00 – 14:00 WAT'],
  },
]

const socials = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
]

export function ContactView() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [subject, setSubject] = React.useState('general')
  const [message, setMessage] = React.useState('')

  const canSubmit = !!fullName && /\S+@\S+\.\S+/.test(email) && !!subject && !!message

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, subject, message }),
      })
      const data = await res.json()
      if (data.ok) {
        setDone(true)
        toast({
          title: 'Message sent',
          description: 'We will reply to your message within two working days.',
        })
      } else {
        toast({
          title: 'Could not send',
          description: data.error || 'Please try again.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Whether you would like to volunteer, donate, partner, or simply share a memory of Edem, we would be glad to hear from you."
        image="/placeholders/hero-contact.svg"
      />

      {/* Contact info cards */}
      <section className="memorial-pattern py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Card className="lift-on-hover h-full border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-gradient ring-1 ring-gold/40">
                      <c.icon className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="mt-4 font-serif text-base text-navy dark:text-gold">{c.title}</h3>
                    <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                      {c.lines.map((l) => (
                        <div key={l}>{l}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="bg-muted/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Form */}
            <div>
              <SectionHeading
                eyebrow="Send us a message"
                title="Contact Form"
                align="left"
              />
              <Card className="mt-6 border-border bg-card">
                <CardContent className="p-6 sm:p-8">
                  {done ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45 }}
                      className="flex flex-col items-center py-10 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40">
                        <CheckCircle2 className="h-8 w-8 text-gold-dark dark:text-gold" />
                      </div>
                      <h3 className="mt-4 font-serif text-2xl text-navy dark:text-gold">
                        Message received
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                        Thank you, {fullName.split(' ')[0]}. We will reply to your message at
                        {email} within two working days.
                      </p>
                      <Button
                        onClick={() => {
                          setDone(false)
                          setFullName(''); setEmail(''); setPhone('')
                          setSubject('general'); setMessage('')
                        }}
                        variant="outline"
                        className="mt-6"
                      >
                        Send another
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={onSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="c-name">Full name *</Label>
                          <Input
                            id="c-name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="c-email">Email *</Label>
                          <Input
                            id="c-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="c-phone">Phone</Label>
                          <Input
                            id="c-phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="024 XXX XXXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="c-subject">Subject *</Label>
                          <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger id="c-subject">
                              <SelectValue placeholder="Choose a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General enquiry</SelectItem>
                              <SelectItem value="donation">Donation enquiry</SelectItem>
                              <SelectItem value="volunteer">Volunteering</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="press">Press & media</SelectItem>
                              <SelectItem value="tribute">Tribute or memory</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="c-msg">Message *</Label>
                        <Textarea
                          id="c-msg"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Your message..."
                          rows={5}
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          We typically respond within 2 working days.
                        </p>
                        <Button
                          type="submit"
                          disabled={!canSubmit || submitting}
                          className="bg-gold-gradient text-navy font-semibold hover:opacity-90"
                        >
                          {submitting ? 'Sending...' : (
                            <>
                              <Send className="mr-1 h-4 w-4" /> Send message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Map + Socials */}
            <div>
              <SectionHeading
                eyebrow="Find us"
                title="Our Location"
                align="left"
              />
              <Card className="mt-6 overflow-hidden border-border bg-card">
                <div className="aspect-[4/3] w-full bg-muted">
                  <iframe
                    title="Foundation office location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=1.155%2C6.095%2C1.205%2C6.125&layer=mapnik&marker=6.110%2C1.180"
                    className="h-full w-full border-0"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-dark dark:text-gold" />
                    <div>
                      <div className="font-serif text-base text-navy dark:text-gold">
                        Nyasorgbor House
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Denu Beach Road, opposite NHIS Office, Ketu South
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="https://wa.me/233242115299"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground ring-1 ring-border transition-colors hover:bg-gold hover:text-navy"
                      >
                        <s.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6 border-gold/30 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg text-navy dark:text-gold">
                    Press & media enquiries
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For interviews, archive requests, or accreditation to Foundation events,
                    please contact the Editorial Office directly.
                  </p>
                  <div className="mt-3 text-sm">
                    <a href="mailto:press@rasmutafoundation.org" className="font-medium text-navy dark:text-gold hover:underline">
                      press@rasmutafoundation.org
                    </a>
                    <div className="text-muted-foreground">0242115299</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
