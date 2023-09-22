import { json } from '@sveltejs/kit'
import Stripe from 'stripe'
const  SECRET_STRIPE_KEY = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"
 
const stripe = new Stripe(SECRET_STRIPE_KEY)

export async function POST() {
  
 const  paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    payment_method_types: ['card']
  })

  return json({
    clientSecret: paymentIntent.client_secret
  })
}