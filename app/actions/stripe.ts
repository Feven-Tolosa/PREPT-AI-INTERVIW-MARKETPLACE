'use server'

import Stripe from 'stripe'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', // Use the latest or your preferred API version
})

export async function createCheckoutSession(priceId: string) {
  let sessionUrl = ''

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId, // Pass a product price ID configured in your Stripe Dashboard
          quantity: 1,
        },
      ],
      mode: 'payment', // Use 'subscription' for recurring payments
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/canceled`,
    })

    sessionUrl = session.url!
  } catch (error) {
    console.error('Stripe error:', error)
    throw new Error('Failed to create checkout session.')
  }

  // Redirect the user to the Stripe-hosted checkout page
  if (sessionUrl) {
    redirect(sessionUrl)
  }
}
