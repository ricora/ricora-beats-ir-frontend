<script lang="ts">
  import TailwindCSS from "./common/TailwindCSS.svelte"
  import Header from "./common/Header.svelte"
  import Footer from "./common/Footer.svelte"
  import Router from "svelte-spa-router"
  import { routes } from "./router"
</script>

<TailwindCSS />
<Header />

<main class="bg-base-100">
  <Router {routes} />
</main>

<Footer />
