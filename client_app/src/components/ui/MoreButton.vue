<template>
  <div class="more flex flex--items-center">
    <span class="text">{{ text }}</span>
    <arrow-down />
  </div>
</template>

<script>
import ArrowDown from "./icons/ArrowDown";
export default {
  components: {
    ArrowDown
  },
  props: {
    text: {
      type: String,
      default() {
        return "More";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  font-family: Raleway;
  font-weight: bold;
  margin-right: 8px;
}
</style>
