<script>

  import { goto } from "$app/navigation";
  
  function redirectToPay() {
    goto('/pay');
  }
</script>

<main class="p-4">
  <h1 class="text-2xl font-bold">Welcome to SvelteKit</h1>
  <p class="mt-4">Click the button to go to the payment page:</p>
  <button class="px-4 py-2 mt-2 bg-themeGreen text-white rounded hover:bg-blue-600" on:click={redirectToPay}>Go to Pay</button>
</main>
