<template>
  <div class="home">
    <top-slider />
    <!-- <statistics /> -->
    <state-review />
    <sponsor />
    <benefits />
    <testimonials />
    <partners />
    <home-footer />
  </div>
</template>

<script>
import Benefits from "./Benefits";
import HomeFooter from "./HomeFooter";
import Sponsor from "./Sponsor";
import StateReview from "./StateReview";
// import Statistics from "./Statistics";
import Testimonials from "./Testimonials";
import TopSlider from "./TopSlider";
import Partners from "./Partners";
export default {
  name: "Home",
  components: {
    Benefits,
    HomeFooter,
    Partners,
    Sponsor,
    StateReview,
    // Statistics,
    Testimonials,
    TopSlider
  }
};
</script>
