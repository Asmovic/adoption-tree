<template>
  <modal-overlay :show="showOverlay">
    <div class="pop-up--box" :class="[size]">
      <header>
        <div class="close-icon" @click="closePopup">
          <close-icon />
        </div>
      </header>
      <div class="body">
        <div class="content">
          <slot></slot>
        </div>
        <a @click="closePopup">close</a>
      </div>
    </div>
  </modal-overlay>
</template>

<script>
import CloseIcon from "./icons/CloseIcon";
import ModalOverlay from "./ModalOverlay";
export default {
  components: {
    CloseIcon,
    ModalOverlay,
  },
  data() {
    return {
      box: null,
      popup: null,
      showOverlay: false,
      overflowValue: "",
      onKeyUp: (evt) => {
        if (evt.keyCode === 27) this.closePopup();
      },
    };
  },
  methods: {
    closePopup() {
      this.$emit("close-popup");
      document.removeEventListener("keyup", this.onKeyUp);
    },
    hidePopup() {
      document.body.parentElement.style.overflowY = "";
      this.box.style.opacity = 0;
      setTimeout(() => {
        this.showOverlay = false;
      }, 400);
    },
    showPopup() {
      this.showOverlay = true;
      setTimeout(() => {
        this.box.style.opacity = 1;
      }, 100);
      document.body.parentElement.style.overflowY = "hidden";
    },
  },
  mounted() {
    this.box = document.querySelector(".pop-up--box");
    this.overflowValue = document.body.parentElement.style.overflowY;

    if (this.show) {
      this.showPopup();
    }
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    size: {
      type: String,
      default() {
        return "sm";
      },
    },
  },
  watch: {
    show: {
      immediate: false,
      handler(show) {
        if (false === show) {
          this.hidePopup();
        } else {
          this.showPopup();
          document.addEventListener("keyup", this.onKeyUp);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.pop-up {
  &--box {
    width: 150px;
    min-height: 150px;
    max-width: 100%;
    background-color: #fff;
    box-shadow: 0px 3px 6px #00000033;
    border-radius: 5px;
    opacity: 1;
    transition: all 0.3s ease-in-out;

    header {
      display: flex;
      justify-content: flex-end;
      padding: 0;
      position: relative;

      .close-icon {
        cursor: pointer;
        position: absolute;
        right: -50px;
        top: -25px;

        svg {
          fill: #fff;
        }
      }
    }

    .content {
      padding: 20px;
    }

    &.hidden {
      visibility: hidden;
      opacity: 0;
    }

    &.sm {
      width: 450px;
      max-width: 100%;
    }

    &.md {
      width: 650px;
      max-width: 100%;
    }

    &.lg {
      width: 950px;
      max-width: 100%;
    }

    &.xl {
      width: 1120px;
      max-width: 100%;
    }
  }

  @media screen and (max-width: 768px) {
    &--box {
      margin: 0 15px;
    }
  }
}
</style>
