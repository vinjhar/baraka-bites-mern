export const STRIPE_PRODUCTS = {
  FREE: {
    priceId: null,
    name: 'Free Plan',
    description: 'Get started with basic recipe generation.',
    mode: 'subscription' as const,
  },
  PREMIUM: { 
    priceId: 'price_1RQDyAD0gUdxny5mfbZR8KgH',
    name: 'Baraka Bites Premium Plan',
    description: 'Unlimited halal recipe generations + save and manage your personal dashboard. Get Sunnah-inspired meal support and priority access to updates.',
    mode: 'subscription' as const,
  },
} as const;