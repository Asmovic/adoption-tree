<template>
  <div class="select-box">
    <select v-bind="$attrs" @change="handleChange" :class="className">
      <slot></slot>
    </select>
    <div class="select-box__icon">
      <arrow-down />
    </div>
  </div>
</template>

<script>
import ArrowDown from "./../icons/ArrowDown";
export default {
  components: { ArrowDown },
  inheritAttrs: false,
  methods: {
    handleChange(e) {
      this.$emit("input", e.target.value);
    }
  },
  props: {
    className: {
      type: String,
      default(){
        return ""
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.select-box {
  position: relative;
  select {
    padding-right: 30px;
  }
  &__icon {
    position: absolute;
    pointer-events: none;
    top: 0;
    right: 10px;
    bottom: 0;
    display: flex;
    align-items: center;
  }
}
</style>
