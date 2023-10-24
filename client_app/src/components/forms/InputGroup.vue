<template>
  <div class="input-group" :class="[iconClass]">
    <slot></slot>
    <div class="input-group__icon" v-if="$slots.icon">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    iconClass() {
      return this.$slots.icon ? "has-icon" : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.input-group {
  display: flex;
  position: relative;
  &__icon {
    position: absolute;
    right: 0;
    width: 35px;
    bottom: 22px;
    display: flex;
    justify-content: center;
  }

  &.has-icon {
    input,
    select,
    textarea {
      padding-right: 40px;
    }
  }
}
</style>
