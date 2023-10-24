<template>
  <object data type class="icon-arrow-down">
    <arrow />
  </object>
</template>

<script>
import Arrow from "./Arrow";
export default {
  components: { Arrow }
};
</script>

<style lang="scss" scoped>
::v-deep > svg {
  transform: rotate(90deg);
}

object {
  padding-top: 3px;
  transition: all 0.2s ease-in-out;
}
</style>
