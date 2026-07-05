'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  Award,
  Radio,
  Briefcase,
  Clock,
} from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { SectionHeading } from '@/components/shared/section-heading'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

const interestAreas = [
  { id: 'events', label: 'Events & Ceremonies' },
  { id: 'mentorship', label: 'Mentorship Programme' },
  { id: 'community', label: 'Community Outreach' },
  { id: 'scholarships', label: 'Scholarships & Education' },
  { id: 'media', label: 'Media & Communications' },
  { id: 'health', label: 'Health & Social Intervention' },
  { id: 'fundraising', label: 'Fundraising' },
  { id: 'archive', label: 'Archive & Restoration' },
]

const skillOptions = [
  'Photography',
  'Videography',
  'Audio production',
  'Writing & editing',
  'Web & social media',
  'Graphic design',
  'Event coordination',
  'Logistics',
  'Translation',
  'Public speaking',
  'Fundraising',
  'Healthcare',
]

const benefits = [
  {
    icon: Sparkles,
    title: 'Skills & training',
    body: 'Free access to masterclasses, the mentorship clinic, and the Foundation\'s annual residential week.',
  },
  {
    icon: Users,
    title: 'A community that lasts',
    body: 'Join a network of more than 320 active volunteers across the country — many of them lifelong friends of Edem.',
  },
  {
    icon: Award,
    title: 'Recognition',
    body: 'Hours and contributions are recognised at the annual Volunteer Recognition evening and in the annual report.',
  },
  {
    icon: HeartHandshake,
    title: 'Service in his name',
    body: 'The chance to carry forward the work of a broadcaster who believed service was the point of the microphone.',
  },
]

export function VolunteerView() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [occupation, setOccupation] = React.useState('')
  const [availability, setAvailability] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [interests, setInterests] = React.useState<string[]>([])
  const [skills, setSkills] = React.useState<string[]>([])

  const toggle = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    if (arr.includes(value)) setArr(arr.filter((v) => v !== value))
    else setArr([...arr, value])
  }

  const canSubmit = !!fullName && /\S+@\S+\.\S+/.test(email) && !!phone && interests.length > 0

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          location,
          occupation,
          skills,
          interests,
          availability,
          message,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setDone(true)
        toast({
          title: 'Welcome aboard',
          description: 'Your application has been received. We will be in touch within 5 working days.',
        })
      } else {
        toast({
          title: 'Could not submit',
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
        eyebrow="Volunteer"
        title="Lend Your Hands to the Work"
        description="More than 320 volunteers already give their time and skills to the Foundation — at events, in newsrooms, in the field, and behind the scenes."
        image="/placeholders/hero-volunteer.svg"
      />

      {/* Why volunteer */}
      <section className="memorial-pattern py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why volunteer"
            title="A chance to carry the candle"
            description="Volunteers are at the heart of everything the Foundation does. We offer training, community, recognition, and the rare satisfaction of service in a broadcaster's name."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, idx) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Card className="lift-on-hover h-full border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40">
                      <b.icon className="h-5 w-5 text-gold-dark dark:text-gold" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg text-navy dark:text-gold">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section className="bg-muted/40 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Registration"
            title="Volunteer Registration Form"
            description="Tell us a little about yourself. We will be in touch within five working days to discuss where you might fit best."
          />

          <Card className="mt-10 border-border bg-card">
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
                    Application received
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Thank you, {fullName.split(' ')[0]}. Your application has been recorded and
                    our Volunteer Coordinator will reach out to you at {email} within five
                    working days.
                  </p>
                  <Button
                    onClick={() => {
                      setDone(false)
                      setFullName(''); setEmail(''); setPhone(''); setLocation('')
                      setOccupation(''); setAvailability(''); setMessage('')
                      setInterests([]); setSkills([])
                    }}
                    variant="outline"
                    className="mt-6"
                  >
                    Submit another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Contact details */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="v-name">Full name *</Label>
                      <Input
                        id="v-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="v-email">Email *</Label>
                      <Input
                        id="v-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="v-phone">Phone *</Label>
                      <Input
                        id="v-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="024 XXX XXXX"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="v-location">Location</Label>
                      <Input
                        id="v-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="v-occupation">Occupation</Label>
                      <Input
                        id="v-occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="e.g. Journalist, Student, Retired Teacher"
                      />
                    </div>
                    <div>
                      <Label htmlFor="v-avail">Availability</Label>
                      <Input
                        id="v-avail"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder="e.g. Weekends, Evenings, 2 days/month"
                      />
                    </div>
                  </div>

                  {/* Areas of interest */}
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Areas of interest *
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Choose at least one. You can change this later.
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {interestAreas.map((a) => (
                        <label
                          key={a.id}
                          htmlFor={`i-${a.id}`}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all ${
                            interests.includes(a.id)
                              ? 'border-navy bg-navy/5 dark:bg-white/5'
                              : 'border-border hover:border-navy/40'
                          }`}
                        >
                          <Checkbox
                            id={`i-${a.id}`}
                            checked={interests.includes(a.id)}
                            onCheckedChange={() => toggle(interests, setInterests, a.id)}
                          />
                          {a.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Skills
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Select all that apply.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skillOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggle(skills, setSkills, s)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                            skills.includes(s)
                              ? 'border-gold bg-gold text-navy'
                              : 'border-border hover:border-gold/50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="v-msg">Why are you interested?</Label>
                    <Textarea
                      id="v-msg"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us briefly why you'd like to volunteer with the Foundation."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground">
                      <Clock className="inline h-3 w-3" /> Avg. response time: 5 working days
                    </p>
                    <Button
                      type="submit"
                      disabled={!canSubmit || submitting}
                      className="bg-gold-gradient text-navy font-semibold hover:opacity-90"
                    >
                      {submitting ? 'Submitting...' : 'Submit application'}
                    </Button>
                  </div>
                  {!canSubmit && (
                    <p className="text-right text-xs text-muted-foreground">
                      Please fill required fields and choose at least one area of interest.
                    </p>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
