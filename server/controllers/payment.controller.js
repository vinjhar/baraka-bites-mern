import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2022-11-15',
// });

export const createCheckoutSession = async (req, res) => {
  const { priceId, mode } = req.body;

  if (!priceId || !mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode, // either 'payment' or 'subscription'
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error.message);
    return res.status(500).json({ error: 'Failed to create Stripe checkout session' });
  }
};
