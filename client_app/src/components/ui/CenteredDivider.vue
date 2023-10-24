<template>
  <div class="centered-divider flex flex--items-center">
    <div class="left" :style="borderStyle"></div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  computed: {
    borderStyle() {
      return this.borderColor ? { backgroundColor: this.borderColor } : {};
    }
  },
  props: {
    borderColor: {
      type: String,
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
.left,
.right {
  height: 1px;
  flex: 1;
  background-color: $primary-color;
}

.content {
  padding: 0 10%;
}
</style>
