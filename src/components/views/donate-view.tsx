'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Shield,
  Gift,
  Sparkles,
} from 'lucide-react'
import { stats, programs } from '@/lib/data'
import { PageHero } from '@/components/shared/page-hero'
import { SectionHeading } from '@/components/shared/section-heading'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

const presetAmounts = [25, 50, 100, 250, 500, 1000]

const methods = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, hint: 'Visa, Mastercard, Verve' },
  { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone, hint: 'MTN, Airtel, 9PSB' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2, hint: 'Direct to Foundation account' },
]

const frequencies = [
  { id: 'one_time', label: 'One-time' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'annual', label: 'Annual' },
]

export function DonateView() {
  const { toast } = useToast()
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const [amount, setAmount] = React.useState<number>(100)
  const [frequency, setFrequency] = React.useState('one_time')
  const [method, setMethod] = React.useState('card')
  const [program, setProgram] = React.useState<string>('general')
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [message, setMessage] = React.useState('')

  const percent = Math.min(100, Math.round((stats.donationReceived / stats.donationGoal) * 100))

  const canProceedStep1 = amount > 0 && !!frequency && !!method
  const canProceedStep2 = !!fullName && /\S+@\S+\.\S+/.test(email) && !!phone

  const onSubmit = async () => {
    if (!canProceedStep1 || !canProceedStep2) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          amount,
          currency: 'USD',
          method,
          frequency,
          program: program === 'general' ? null : program,
          message: message || null,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setDone(true)
        toast({
          title: 'Thank you',
          description: `Your gift of $${amount.toLocaleString()} has been received.`,
        })
      } else {
        toast({
          title: 'Could not process donation',
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
        eyebrow="Donate"
        title="Carry the Candle Forward"
        description="Your gift funds scholarships, mentorship, community radio, and the institutions Edem D. Nyasorgbor spent a lifetime building."
        image="/placeholders/hero-donate.svg"
      />

      {/* Progress band */}
      <section className="bg-navy-gradient py-12 text-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-[0.24em] text-gold">
              Donation Progress
            </span>
            <div className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
              ${stats.donationReceived.toLocaleString()}{' '}
              <span className="text-cream/70">of ${stats.donationGoal.toLocaleString()}</span>
            </div>
            <div className="mt-5 w-full max-w-2xl">
              <Progress value={percent} className="h-3 bg-white/15" />
              <div className="mt-2 flex items-center justify-between text-xs text-cream/80">
                <span>{percent}% of goal reached</span>
                <span>{stats.donorsCount.toLocaleString()} donors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation form */}
      <section className="memorial-pattern py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow={`Step ${step} of 3`}
                title={done ? 'Thank you' : step === 1 ? 'Your gift' : step === 2 ? 'Your details' : 'Confirm & give'}
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
                        Your gift has been received
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                        Thank you, {fullName.split(' ')[0]}. A receipt and our gratitude have been
                        sent to {email}. Your generosity will be put to work at once.
                      </p>
                      <Button
                        onClick={() => {
                          setDone(false)
                          setStep(1)
                          setFullName('')
                          setEmail('')
                          setPhone('')
                          setMessage('')
                        }}
                        variant="outline"
                        className="mt-6"
                      >
                        Make another gift
                      </Button>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div>
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                              Choose an amount (USD)
                            </Label>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              {presetAmounts.map((a) => (
                                <button
                                  key={a}
                                  type="button"
                                  onClick={() => setAmount(a)}
                                  className={`rounded-lg border px-3 py-3 font-serif text-lg font-bold transition-all ${
                                    amount === a
                                      ? 'border-gold bg-gold text-navy shadow-md'
                                      : 'border-border bg-background hover:border-gold/50'
                                  }`}
                                >
                                  ${a}
                                </button>
                              ))}
                            </div>
                            <div className="mt-3">
                              <Input
                                type="number"
                                min={1}
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                                placeholder="Custom amount"
                                aria-label="Custom donation amount"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                              Frequency
                            </Label>
                            <RadioGroup
                              value={frequency}
                              onValueChange={setFrequency}
                              className="mt-3 grid grid-cols-3 gap-2"
                            >
                              {frequencies.map((f) => (
                                <label
                                  key={f.id}
                                  htmlFor={`freq-${f.id}`}
                                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                                    frequency === f.id
                                      ? 'border-navy bg-navy/5 dark:bg-white/5'
                                      : 'border-border hover:border-navy/40'
                                  }`}
                                >
                                  <RadioGroupItem value={f.id} id={`freq-${f.id}`} />
                                  {f.label}
                                </label>
                              ))}
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                              Payment method
                            </Label>
                            <RadioGroup
                              value={method}
                              onValueChange={setMethod}
                              className="mt-3 grid grid-cols-1 gap-2"
                            >
                              {methods.map((m) => (
                                <label
                                  key={m.id}
                                  htmlFor={`m-${m.id}`}
                                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                                    method === m.id
                                      ? 'border-navy bg-navy/5 dark:bg-white/5'
                                      : 'border-border hover:border-navy/40'
                                  }`}
                                >
                                  <RadioGroupItem value={m.id} id={`m-${m.id}`} />
                                  <m.icon className="h-5 w-5 text-navy dark:text-gold" />
                                  <div>
                                    <div className="text-sm font-medium">{m.label}</div>
                                    <div className="text-xs text-muted-foreground">{m.hint}</div>
                                  </div>
                                </label>
                              ))}
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                              Direct your gift (optional)
                            </Label>
                            <select
                              value={program}
                              onChange={(e) => setProgram(e.target.value)}
                              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="general">Where it is needed most</option>
                              {programs.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              onClick={() => setStep(2)}
                              disabled={!canProceedStep1}
                              className="bg-gold-gradient text-navy font-semibold hover:opacity-90"
                            >
                              Continue →
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="dn-name">Full name</Label>
                            <Input
                              id="dn-name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <Label htmlFor="dn-email">Email</Label>
                              <Input
                                id="dn-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="dn-phone">Phone</Label>
                              <Input
                                id="dn-phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="024 XXX XXXX"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="dn-msg">Message (optional)</Label>
                            <Textarea
                              id="dn-msg"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="In memory of... / In honour of..."
                              rows={3}
                            />
                          </div>
                          <div className="flex justify-between">
                            <Button variant="ghost" onClick={() => setStep(1)}>
                              ← Back
                            </Button>
                            <Button
                              onClick={() => setStep(3)}
                              disabled={!canProceedStep2}
                              className="bg-gold-gradient text-navy font-semibold hover:opacity-90"
                            >
                              Review →
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-5"
                        >
                          <div className="rounded-lg border border-border bg-muted/40 p-5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground">Amount</span>
                              <span className="font-serif text-2xl font-bold text-navy dark:text-gold">
                                ${amount.toLocaleString()}{' '}
                                <span className="text-sm font-normal text-muted-foreground">
                                  {frequencies.find((f) => f.id === frequency)?.label}
                                </span>
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                              <span className="text-muted-foreground">Method</span>
                              <span className="text-right">{methods.find((m) => m.id === method)?.label}</span>
                              <span className="text-muted-foreground">Directed to</span>
                              <span className="text-right">
                                {program === 'general'
                                  ? 'Where most needed'
                                  : programs.find((p) => p.id === program)?.title}
                              </span>
                              <span className="text-muted-foreground">Name</span>
                              <span className="text-right">{fullName}</span>
                              <span className="text-muted-foreground">Email</span>
                              <span className="text-right break-all">{email}</span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-emerald-50 p-4 text-xs text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                            <Shield className="mb-1 inline h-3.5 w-3.5" /> This is a demonstration
                            form. No actual payment will be processed. Your submission will be
                            recorded for the Admin dashboard.
                          </div>

                          <div className="flex justify-between">
                            <Button variant="ghost" onClick={() => setStep(2)}>
                              ← Back
                            </Button>
                            <Button
                              onClick={onSubmit}
                              disabled={submitting}
                              className="bg-gold-gradient text-navy font-semibold hover:opacity-90"
                            >
                              {submitting ? 'Processing...' : `Give $${amount.toLocaleString()}`}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-5 space-y-6">
              <Card className="border-gold/30 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-gradient ring-1 ring-gold/40">
                      <Heart className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="font-serif text-lg text-navy dark:text-gold">
                      What your gift makes possible
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-dark dark:text-gold" />
                      <span><strong>$50</strong> — funds a mobile-journalism kit for a youth bootcamp graduate.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-dark dark:text-gold" />
                      <span><strong>$250</strong> — covers a community-radio journalist's training week.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-dark dark:text-gold" />
                      <span><strong>$1,000</strong> — funds a full year of mentorship for one early-career journalist.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-dark dark:text-gold" />
                      <span><strong>$5,000</strong> — funds a full-tuition scholarship for a year.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-gradient ring-1 ring-gold/40">
                      <Building2 className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="font-serif text-lg text-navy dark:text-gold">
                      Bank transfer
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Donations may also be made directly to the Foundation's account. Please use
                    your email as the reference and write to us so we can acknowledge your gift.
                  </p>
                  <div className="mt-4 space-y-1.5 rounded-lg bg-muted/40 p-4 text-sm font-mono">
                    <div><span className="text-muted-foreground">Bank:</span> First Continental Bank</div>
                    <div><span className="text-muted-foreground">Account:</span> 3041 9822 07</div>
                    <div><span className="text-muted-foreground">Name:</span> RAS MUTA Foundation</div>
                    <div><span className="text-muted-foreground">SWIFT:</span> FCONNGLA</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-gradient ring-1 ring-gold/40">
                      <Gift className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="font-serif text-lg text-navy dark:text-gold">
                      Other ways to give
                    </h3>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>• In-memory gifts and tribute donations</li>
                    <li>• Legacy and bequest giving</li>
                    <li>• Corporate partnerships and matching gifts</li>
                    <li>• In-kind equipment donations for community radio</li>
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
