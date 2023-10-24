<template>
  <div v-if="stateId">
    <component :is="home"></component>
  </div>
</template>

<script>
import AnambraHome from "./home/anambra/Index.vue";
import ImoHome from "./home/imo/Index.vue";
export default {
  computed: {
    home() {
      return this.stateId === 17 ? ImoHome : AnambraHome;
    }
  }
};
</script>
