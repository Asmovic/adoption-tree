<template>
  <div
    class="modal__overlay"
    :class="{ show: show, centered: center }"
    @click.self="$emit('click')"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99998;
  display: none;

  &.centered {
    justify-content: center;
    align-items: center;
  }

  &.show {
    display: flex;
  }
}
</style>
