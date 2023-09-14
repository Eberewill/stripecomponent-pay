import Stripe from 'stripe'
const  STRIPE_WEBHOOK_SECRET =  '/webhook'

const PUBLIC_STRIPE_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx"
const  SECRET_STRIPE_KEY = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"
  
const stripe = new Stripe(SECRET_STRIPE_KEY)

export async function POST({ request }) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.warn('⚠️  Webhook signature verification failed.', err.message)

    return new Response(undefined, { status: 400 })
  }

  if (event.type == 'charge.succeeded') {
    const charge = event.data.object

    // TODO: fulfill the order
    console.log(`✅ Charge succeeded ${charge.id}`)
  }

  return new Response(undefined)
}