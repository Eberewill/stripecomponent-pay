<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { loadStripe } from "@stripe/stripe-js";
  const PUBLIC_STRIPE_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx";
  import {
    Elements,
    PaymentElement,
    LinkAuthenticationElement,
    Address,
  } from "$lib";

  let stripe = null;
  let clientSecret = null;
  let error = null;
  let elements;
  let processing = false;

  onMount(async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_KEY);

    // create payment intent server side
    clientSecret = await createPaymentIntent();
  });

  async function createPaymentIntent() {
    const response = await fetch("/payment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const { clientSecret } = await response.json();

    return clientSecret;
  }

  async function submit() {
    // avoid processing duplicates
    if (processing) return;

    processing = true;

    // confirm payment with stripe
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    // log results, for debugging
    console.log({ result });

    if (result.error) {
      // payment failed, notify user
      error = result.error;
      processing = false;
    } else {
      // payment succeeded, redirect to "thank you" page
      goto("/thanks");
    }
  }

  const paymentElementOptions = {
    layout: "tabs",
  };
</script>

{#if error}
  <p class="error">{error.message} Please try again.</p>
{/if}

{#if stripe && clientSecret}
  <Elements
    {stripe}
    {clientSecret}
    theme="stripe"
    labels="floating"
    variables={{ colorPrimary: "#007DFD" }}
    rules={{
      ".Input": {
        border: "solid 1px #A5ACB8",
        color: " #4F5B76",
        fontSize: "16px",
        fontFamily: "Poppins",
        background: "white",
      },
    }}
    bind:elements
  >
    <form on:submit|preventDefault={submit}>
      <LinkAuthenticationElement />
      <h3 class="text-md my-7">Customer information</h3>
      <Address mode="billing" />
      <h3 class="text-md my-7">Payment information</h3>
      <PaymentElement options={paymentElementOptions} />

      <button disabled={processing} class="bg-darkColor text-white rounded-md">
        {#if processing}
          <div class="flex justify-center items-center">Processing...</div>
        {:else}
          <div class="flex justify-center items-center mr-4">
            Make payment
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12L19 12"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
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
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 2rem 0;
  }

  button {
    padding: 1rem;
    border-radius: 5px;
    border: solid 1px #ccc;
    color: white;
    background: "#203136";
    font-size: 1.2rem;
    margin: 1rem 0;
  }
</style>
