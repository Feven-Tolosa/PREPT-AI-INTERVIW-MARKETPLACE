'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser, SignInButton } from '@clerk/nextjs'
import { toast } from 'sonner'
import {
  AlertTriangle,
  Coins,
  Lock,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { chapaCustomizations } from '@/lib/chapa-theme'
import { getCreditPack } from '@/lib/credit-packs'
import { completeChapaPurchase } from '@/actions/chapa'
import { getCurrentUser } from '@/actions/user'

const CHAPA_FORM_ID = 'chapa-inline-form'

// Clerk phone numbers come as "+251911223344" — the inline form wants
// the local "9XXXXXXXX" / "7XXXXXXXX" part only
const normalizePhone = (value) => {
  const digits = (value ?? '').replace(/\D/g, '')
  if (!digits) return ''
  return digits.startsWith('251') ? digits.slice(3) : digits.slice(-9)
}

function CheckoutInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoaded, isSignedIn, user } = useUser()

  const [status, setStatus] = useState('loading') // loading | ready | error
  const [role, setRole] = useState(undefined) // undefined = checking

  const packId = searchParams.get('pack') ?? 'starter'
  const pack = getCreditPack(packId)
  const readyToPay = Boolean(
    isLoaded && isSignedIn && user && role === 'INTERVIEWEE' && pack
  )

  // Resolve the signed-in user's project role
  useEffect(() => {
    if (!isSignedIn) return
    let cancelled = false
    getCurrentUser().then((u) => {
      if (!cancelled) setRole(u?.role ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [isSignedIn])

  // Boot the Chapa inline SDK and mount the themed payment form
  useEffect(() => {
    if (!readyToPay) return
    let cancelled = false

    const boot = async () => {
      // The SDK script is loaded with lazyOnload — poll briefly for it,
      // then fall back to the bundled @chapa_et/inline.js package.
      for (let i = 0; i < 40 && !window.ChapaCheckout; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      if (!window.ChapaCheckout) {
        // The npm package's "main" points to a missing file, so import
        // the script directly — it assigns window.ChapaCheckout as a side effect
        try {
          await import('@chapa_et/inline.js/lib/inline.js')
        } catch {
          /* handled below */
        }
      }

      if (cancelled) return

      const publicKey = process.env.NEXT_PUBLIC_CHAPA_PUBLIC_KEY
      if (!publicKey || !window.ChapaCheckout) {
        setStatus('error')
        return
      }

      new window.ChapaCheckout({
        publicKey,
        amount: String(pack.price),
        currency: 'ETB',
        mobile: normalizePhone(user?.phoneNumbers?.[0]?.phoneNumber),
        tx_ref: `prept-${crypto.randomUUID()}`,
        showFlag: true,
        showPaymentMethodsNames: true,

        customizations: chapaCustomizations({
          buttonText: `Pay ${pack.price.toLocaleString()} ETB`,
          successMessage:
            'Payment received! Adding your credits, hang tight…',
        }),

        onSuccessfulPayment: async (verifyResult, refId) => {
          const res = await completeChapaPurchase({
            packId: pack.id,
            refId,
            paymentMethod: verifyResult?.data?.payment_method ?? '',
          })

          if (res.success) {
            toast.success(
              `+${res.credits} credits added — balance ${res.balance}`
            )
          } else {
            toast.error(res.error || 'Purchase could not be finalized')
          }
          setTimeout(() => router.push('/appointments'), 1800)
        },
        onPaymentFailure: (message) =>
          toast.error(message || 'Payment failed. Please try again.'),
        onClose: () => {},
      }).initialize(CHAPA_FORM_ID)

      setStatus('ready')
    }

    boot()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToPay])

  return (
    <div className='relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden'>
      {/* Ambient gold glow */}
      <div className='absolute top-[-25%] left-1/2 -translate-x-1/2 w-[55vw] h-[55vw] rounded-full bg-amber-500/[0.06] blur-[140px] pointer-events-none' />

      <div className='relative w-full max-w-md'>
        <div className='rounded-2xl bg-muted/30 backdrop-blur-xl border border-border p-7 sm:p-9 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.5)]'>
          {/* Heading */}
          <div className='text-center mb-8'>
            <p className='inline-flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-[0.14em] uppercase mb-3'>
              <span className='w-4 h-px bg-amber-400' />
              Secure Checkout
              <span className='w-4 h-px bg-amber-400' />
            </p>
            <h1 className='font-serif text-2xl sm:text-3xl font-medium leading-tight'>
              Buy{' '}
              <span className='bg-linear-to-br from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent'>
                interview credits
              </span>
            </h1>
          </div>

          {/* Pack summary */}
          {pack ? (
            <div className='rounded-xl border border-border bg-background/40 px-5 py-4 mb-7 flex items-center justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5'>
                  <Coins size={13} className='text-amber-400' />
                  {pack.name}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {pack.credits} mock-interview credits
                </p>
              </div>
              <div className='text-right shrink-0'>
                <p className='text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-0.5'>
                  Total
                </p>
                <p className='font-serif text-2xl font-semibold bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent leading-none'>
                  {pack.price.toLocaleString()}{' '}
                  <span className='text-xs font-sans text-muted-foreground'>
                    ETB
                  </span>
                </p>
              </div>
            </div>
          ) : (
            /* Unknown pack id */
            <div className='flex flex-col items-center gap-3 rounded-xl border border-destructive/25 bg-destructive/10 px-5 py-6 text-center mb-7'>
              <AlertTriangle size={20} className='text-destructive' />
              <p className='text-sm font-medium'>Unknown credit package.</p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => router.push('/')}
              >
                Back home
              </Button>
            </div>
          )}

          {/* Gate: auth / role / sdk states */}
          {!isLoaded || (isSignedIn && role === undefined) ? (
            <div className='min-h-[190px] rounded-xl border border-border bg-muted/20 animate-pulse' />
          ) : !isSignedIn ? (
            <div className='flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/20 px-5 py-8 text-center min-h-[190px] justify-center'>
              <ShieldCheck size={22} className='text-amber-400' />
              <div>
                <p className='text-sm font-medium mb-1'>Sign in to continue</p>
                <p className='text-xs text-muted-foreground'>
                  You need an account to buy credits and book sessions.
                </p>
              </div>
              <SignInButton mode='modal'>
                <Button variant='gold' size='sm'>
                  Sign in
                </Button>
              </SignInButton>
            </div>
          ) : role !== 'INTERVIEWEE' ? (
            <div className='flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/20 px-5 py-8 text-center min-h-[190px] justify-center'>
              <UserCheck size={22} className='text-amber-400' />
              <div>
                <p className='text-sm font-medium mb-1'>
                  Interviewers don&apos;t buy credits
                </p>
                <p className='text-xs text-muted-foreground'>
                  You earn credits from sessions — request a payout from your
                  dashboard instead.
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => router.push('/dashboard')}
              >
                Go to dashboard
              </Button>
            </div>
          ) : status === 'error' || !pack ? (
            <div className='flex flex-col items-center gap-3 rounded-xl border border-destructive/25 bg-destructive/10 px-5 py-6 text-center min-h-[190px] justify-center'>
              <AlertTriangle size={20} className='text-destructive' />
              <p className='text-sm font-medium'>
                We couldn&apos;t load the payment form.
              </p>
              <Button
                variant='gold'
                size='sm'
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            /* Themed Chapa inline form */
            <div
              id={CHAPA_FORM_ID}
              className={`min-h-[190px] transition-opacity duration-500 ${
                status === 'ready' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Trust footer */}
          {readyToPay && status !== 'error' && (
            <div className='mt-7 flex items-center justify-center gap-1.5 text-xs text-muted-foreground'>
              <ShieldCheck size={13} className='text-amber-400/80' />
              Payments secured by Chapa · telebirr, CBE Birr & more
            </div>
          )}
        </div>

        <p className='mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground'>
          <Lock size={11} /> Encrypted checkout · Prept never sees your PIN
        </p>
      </div>
    </div>
  )
}

export default function InlineCheckout() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <p className='text-sm text-muted-foreground animate-pulse'>
            Loading checkout…
          </p>
        </div>
      }
    >
      <CheckoutInner />
    </Suspense>
  )
}
