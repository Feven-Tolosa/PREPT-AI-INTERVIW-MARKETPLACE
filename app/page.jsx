import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GoldTitle,
  GrayTitle,
  SectionHeading,
  SectionLabel,
} from '@/components/reusables'
import { CodeDemo } from '@/components/demo-components-animate-code'
import Link from 'next/link'
import { AI_TAGS, AVATARS, LOGOS, ROLES, SLOTS } from '@/lib/data'
import Image from 'next/image'
import { StarsBackgroundDemo } from '@/components/demo-components-backgrounds-stars'
import { Bot, Wallet } from 'lucide-react'
import BentoCard from '@/components/BentoCard'
import PricingSection from '@/components/PricingSection'
import FaqAccordion from '@/components/FaqAccordion'
import HowItWorks from '@/components/HowItWorks'

function MockUI({ rows = 3 }) {
  const widths = ['w-4/5', 'w-3/5', 'w-2/5', 'w-4/5', 'w-1/2']
  const colors = [
    'bg-white/5',
    'bg-white/5',
    'bg-amber-400/15',
    'bg-white/5',
    'bg-white/5',
  ]

  return (
    <div className='mt-5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 overflow-hidden'>
      <div className='h-9 bg-white/5 border-b border-white/10 flex items-center px-3.5 gap-1.5'>
        <span className='w-2 h-2 rounded-full bg-[#ff5f57]' />
        <span className='w-2 h-2 rounded-full bg-[#ffbd2e]' />
        <span className='w-2 h-2 rounded-full bg-[#28c840]' />
      </div>
      <div className='p-4 flex flex-col gap-2'>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full ${widths[i]} ${colors[i]}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className='bg-black overflow-x-hidden'>
      {/* HERO */}
      <section className='relative min-h-screen grid grid-cols-1 lg:grid-cols-5 px-4 sm:px-8 pt-28 sm:pt-32 pb-20 overflow-hidden'>
        <StarsBackgroundDemo />

        {/* LEFT */}
        <div className='col-span-full lg:col-span-3 flex flex-col items-center justify-center text-center lg:-rotate-2'>
          <Badge variant='gold' className='text-yellow-400'>
            Powered by AI — Now in Beta
          </Badge>
          <h1 className='font-serif relative text-5xl sm:text-6xl lg:text-7xl tracking-tighter max-w-4xl'>
            <GrayTitle>Ace your next interview</GrayTitle>
            <br />
            <GoldTitle>with real experts</GoldTitle>
          </h1>
          <p className='relative text-sm sm:text-base md:text-lg text-stone-400 max-w-xl mt-6 leading-relaxed'>
            Book 1:1 mock interviews with senior engineers from top companies.
            Get AI-powered feedback, role-specific questions, and the confidence
            to land your dream job.
          </p>
          <div className='relative flex justify-center gap-2 sm:gap-4 mt-10 sm:w-auto'>
            <Link href='/onboarding'>
              <Button variant='gold' size='hero'>
                Get started
              </Button>
            </Link>

            <Link href='/explore'>
              <Button variant='outline' size='hero'>
                Browse Interviewers →
              </Button>
            </Link>
          </div>
          <div className='relative flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-16'>
            <div className='flex'>
              {AVATARS.map((av, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-[#0a0a0b] overflow-hidden ${
                    i > 0 ? '-ml-2' : ''
                  }`}
                >
                  <Image
                    src={av.src}
                    alt='user avatar'
                    width={32}
                    height={32}
                    className='w-full h-full object-cover'
                  />
                </div>
              ))}
            </div>

            <p className='text-sm text-stone-500 text-center sm:text-left'>
              <strong className='text-stone-400 font-medium'>
                2,400+ engineers
              </strong>{' '}
              cracked FAANG interviews via Prept
            </p>
          </div>
        </div>
        <div className='col-span-full lg:col-span-2 flex items-center justify-center lg:justify-start mt-12 lg:mt-0 lg:rotate-3'>
          <CodeDemo duration={30000} writing />
        </div>
      </section>

      {/* LOGOS */}
      <section className='relative z-10 border-y border-white/10 py-14 overflow-hidden'>
        <p className='text-center text-xs font-medium text-stone-600 tracking-widest uppercase mb-8'>
          Interviewees landed roles at
        </p>

        <div className='relative w-full overflow-hidden'>
          <div className='pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-black to-transparent' />
          <div className='pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-black to-transparent' />

          <div className='animate-marquee flex items-center gap-16'>
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((l, idx) => (
              <Image
                key={`${l.alt}-${idx}`}
                src={l.src}
                alt={l.alt}
                width={100}
                height={50}
                className='h-7 w-auto opacity-60 grayscale shrink-0 hover:opacity-100 hover:grayscale-0 transition-all duration-300'
              />
            ))}
          </div>
        </div>
      </section>
      {/* How it works */}
      <HowItWorks />

      {/* FEATURES BENTO GRID */}
      <section className='relative z-10 py-28 max-w-5xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <SectionLabel>Features</SectionLabel>
          <SectionHeading
            gray='Everything you need,'
            gold="nothing you don't"
          />
        </div>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 md:col-span-7'>
            <BentoCard
              icon={<Bot size={20} className='text-amber-400' />}
              title={<GrayTitle>AI Question Generator</GrayTitle>}
              desc="Interviewers get a live AI co-pilot generating role-specific questions on demand — system design, behavioural, DSA — all tailored to the candidate's level."
            >
              <div className='flex flex-wrap gap-2 mt-5'>
                {AI_TAGS.map((t) => (
                  <Badge key={t.label} variant={t.active ? 'gold' : 'outline'}>
                    {t.label}
                  </Badge>
                ))}
              </div>
            </BentoCard>
          </div>
          <div className='col-span-12 md:col-span-5'>
            <BentoCard
              icon={<Wallet size={16} className='text-amber-400' />}
              title={<GrayTitle>Credit System</GrayTitle>}
              desc='Subscribe for monthly credits. Book sessions. Interviewers earn and withdraw any time.'
            >
              <div className='mt-5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 flex justify-between items-end'>
                <div>
                  <p className='text-xs text-stone-600 mb-1'>Your balance</p>
                  <p className='font-serif text-4xl leading-none bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent'>
                    28
                  </p>
                  <p className='text-xs text-stone-600 mt-1'>
                    credits remaining
                  </p>
                </div>

                <Badge variant='secondary'>+10 this month</Badge>
              </div>
            </BentoCard>
          </div>
          <div className='col-span-12 md:col-span-4'>
            <BentoCard
              icon='📹'
              title='HD Video Calls'
              desc='Powered by Stream. Screen sharing, recording, and instant playback links — all built in.'
            >
              <MockUI rows={3} />
            </BentoCard>
          </div>
          <div className='col-span-12 md:col-span-4'>
            <BentoCard
              icon='💬'
              title='Persistent Chat'
              desc='Message your interviewer before and after the call. Share resources, prep notes, and follow-ups in one thread.'
            />
          </div>
          <div className='col-span-12 md:col-span-4'>
            <BentoCard
              icon='🔒'
              title='Security by Arcjet'
              desc='Bot protection, rate limiting, and abuse prevention baked into every API route.'
            />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <BentoCard
              icon='📊'
              title={<GrayTitle>AI Feedback Reports</GrayTitle>}
              desc='Post-interview analysis by Gemini with actionable insights.'
            >
              <MockUI rows={5} />
            </BentoCard>
          </div>
          <div className='col-span-12 md:col-span-6'>
            <BentoCard
              icon='🗓️'
              title={<GoldTitle>Slot-based Scheduling</GoldTitle>}
              desc='Interviewers set availability once. Interviewees pick from open slots and confirm with one click — no back-and-forth needed.'
            >
              <div className='flex flex-wrap gap-2 mt-5'>
                {SLOTS.map((s) => (
                  <span
                    key={s.label}
                    className={`text-xs px-3 py-1.5 rounded-lg border ${s.cls}`}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className='relative z-10 pb-28 max-w-5xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <SectionLabel>Who it&apos;s for</SectionLabel>
          <SectionHeading gray='Built for both sides' gold='of the table' />
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          {ROLES.map((role) => (
            <div
              key={role.label}
              className='relative group bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-400/25 rounded-2xl p-12 h-full transition-all duration-300 overflow-hidden shadow-[0_4px_40px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_60px_-12px_rgba(251,191,36,0.12)]'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-amber-400/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
              <div className='absolute -bottom-24 -right-24 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none' />

              <span className='relative inline-block text-xs font-semibold text-amber-400 tracking-widest uppercase border border-amber-400/20 bg-amber-400/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-5'>
                {role.label}
              </span>

              <h3 className='relative font-serif text-2xl tracking-tight mb-4'>
                {role.title}
              </h3>

              <p className='relative text-sm text-stone-400 leading-relaxed mb-8'>
                {role.desc}
              </p>

              <ul className='relative space-y-3'>
                {role.perks.map((p) => (
                  <li key={p} className='flex gap-3 text-sm text-stone-400'>
                    <span className='mt-0.5 min-w-4 h-4 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xs text-amber-400'>
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className='relative z-10 pb-28 max-w-5xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <SectionLabel>Pricing</SectionLabel>
          <SectionHeading
            gray='Simple, transparent'
            gold='credit-based plans'
          />
          <p className='text-stone-400 mt-3 text-sm'>
            Each credit = one session. Unused credits roll over.
          </p>
        </div>
        <PricingSection />
      </section>

      {/* FAQ */}
      <FaqAccordion />

      {/* FINAL CTA */}
      <section className='relative z-10 pb-28 max-w-5xl mx-auto px-6'>
        <div className='relative border border-amber-400/20 rounded-3xl px-3 sm:px-16 py-20 bg-linear-to-br from-amber-400/5 text-center overflow-hidden'>
          <StarsBackgroundDemo />

          <h2 className='font-serif relative text-4xl md:text-5xl leading-tight tracking-tight mb-4'>
            <GrayTitle>Your next interview</GrayTitle>
            <br />
            <GoldTitle>starts here</GoldTitle>
          </h2>

          <p className='relative text-stone-400 font-light text-sm mb-11'>
            Join thousands of engineers already levelling up on Prept.
          </p>

          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link href='/onboarding' className='relative'>
              <Button variant='gold' size='hero'>
                Get started
              </Button>
            </Link>

            <Link href='/explore' className='relative'>
              <Button variant='outline' size='hero'>
                Browse Interviewers →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
