<template>
  <svg class="icon" :style="iconSize" viewBox="0 0 8 8">
    <use :href="href" :class="customClass" :fill="color" />
  </svg>
</template>

<script>
export default {
  computed: {
    href() {
      const href = "/assets/svg/open-iconic.svg";
      return `${href}#${this.icon}`;
    },
    iconSize() {
      const dimensions = this.size.split("x");
      const style = {
        width: dimensions[0] + "px",
        height: dimensions[1] + "px",
      };

      return style;
    },
  },
  props: {
    color: {
      type: String,
      default() {
        return "#000";
      },
    },
    icon: {
      type: String,
      default() {
        return "file";
      },
    },
    customClass: {
      type: String,
    },
    size: {
      type: String,
      default() {
        return "16x16";
      },
    },
  },
};
</script>
