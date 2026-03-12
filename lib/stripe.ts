import Stripe from 'stripe'

// Provide a dummy key during Vercel build phase if the real key is absent
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any, // Best practice is to lock the API version
  typescript: true,
})
