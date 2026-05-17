export const config = {
  runtime: 'nodejs',
};

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { items, successUrl, cancelUrl } = await req.json();

    const lineItems = items.map((item: any) => ({
  price_data: {
    currency: 'eur',
    product_data: {
      name: item.name,
      // Stripe acceptă doar URL-uri https valide
      ...(item.image && item.image.startsWith('https://') ? { images: [item.image] } : {}),
    },
    unit_amount: Math.round(item.price * 100),
  },
  quantity: item.quantity,
}));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
  console.error('Stripe error:', error);
  return new Response(JSON.stringify({ 
    error: error.message,
    type: error.type,
    code: error.code,
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
}