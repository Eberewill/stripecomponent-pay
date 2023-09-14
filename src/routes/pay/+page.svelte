<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { loadStripe } from "@stripe/stripe-js";
  //import { PUBLIC_STRIPE_KEY } from '$env/static/public'
  import { Elements, CardNumber, CardExpiry, CardCvc } from "$lib";

const PUBLIC_STRIPE_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx";

  let stripe = null;
  let error = null;
  let cardElement;
  let name;
  let processing = false;

  onMount(async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_KEY);
  });

  async function createPaymentIntent() {
    const response = await fetch("/payment", {
      method: "POST",
    });
    const { clientSecret } = await response.json();

    return clientSecret;
  }

  async function submit() {
    // avoid processing duplicates
    if (processing) return;

    processing = true;

    // create the payment intent server-side
    const clientSecret = await createPaymentIntent();

    // confirm payment with stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name,
          email: 'jenny.rosen@example.com',
        },
      },
    });

    // log results, for debugging
    console.log({ result });

    if (result.error) {
      // payment failed, notify user
      error = result.error;
      processing = false;
    } else {
      // payment succeeded, redirect to "thank you" page
      goto("/about");
    }
  }
</script>

{#if error}
  <p class="error">{error.message} Please try again.</p>
{/if}

{#if stripe}
  <Elements {stripe}>
    <form on:submit|preventDefault={submit} class="mt-10">
      <h3 id="payment-heading" class="text-lg font-medium text-gray-900">
        Payment details
      </h3>

      <div class="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
        <div class="col-span-3 sm:col-span-4">
          <div class="mt-1">
            <input
             
              name="name"
              bind:value={name}
              placeholder="Your name"
              disabled={processing}
              class="block w-full rounded-md border-themeGreen shadow-sm focus:border-themeGreen focus:ring-themeGreen sm:text-sm"
            />
          </div>
        </div>

        <div class="col-span-3 sm:col-span-4">
          <div class="mt-1">
            <CardNumber
              bind:element={cardElement}
              classes={{
                base: "block w-full rounded-md border-themeGreen shadow-sm focus:border-themeGreen focus:ring-themeGreen sm:text-sm",
              }}
            />
          </div>
        </div>

        <div class="col-span-2 sm:col-span-3">
          <div class="mt-1">
            <CardExpiry
              classes={{
                base: "block w-full rounded-md border-themeGreen shadow-sm focus:border-themeGreen focus:ring-themeGreen sm:text-sm",
              }}
            />
          </div>
        </div>

        <div>
          <div class="mt-1">
            <CardCvc
              classes={{
                base: "block w-full rounded-md border-themeGreen shadow-sm focus:border-themeGreen focus:ring-themeGreen sm:text-sm",
              }}
            />
          </div>
        </div>
      </div>

      <button
        disabled={processing}
        class="mt-4 px-4 py-2 bg-themeGreen text-white rounded hover:themeGreen"
      >
        {#if processing}
          Processing...
        {:else}
          Pay
        {/if}
      </button>
    </form>
  </Elements>
{:else}
  Loading...
{/if}

<style>
  .error {
    color: tomato;
    margin: 2rem 0 0;
  }

  form {
    width: 30vw;
    min-width: 500px;
    align-self: center;
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
  }


  button {
    background: rgb(177, 204, 79);
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 4px;
    border: 0;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
  }
  button:hover {
    filter: contrast(115%);
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
</style>
