<template>
  <div class="global-loader flex flex--items-center justify--center" v-show="show">
    <div class="ad-dual-ring"></div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  watch: {
    show: {
      immediate: false,
      handler(bool) {
        document.body.parentElement.style.overflowY = bool ? "hidden" : "";
      }
    }
  }
};
</script>

<style lang="scss">
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff94;
  z-index: 99998;
}

.ad-dual-ring {
  display: inline-block;
  width: 64px;
  height: 64px;
}
.ad-dual-ring:after {
  content: " ";
  display: block;
  width: 48px;
  height: 48px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid $primary-color;
  border-color: $primary-color transparent $primary-color transparent;
  animation: ad-dual-ring 0.6s linear infinite;
}
@keyframes ad-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
