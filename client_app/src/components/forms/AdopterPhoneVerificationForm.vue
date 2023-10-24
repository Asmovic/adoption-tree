<template>
  <div class="flex">
    <img
      src="/assets/img/side-registration-form-img.jpg"
      alt
      class="form__side-image"
    />
    <form
      action
      @submit.prevent="handleSubmit"
      class="global-form flex flex--column"
    >
      <h1 class="text--center form-header text--bold mb-0">
        Phone Number Verification
      </h1>
      <h3 class="text--center text--primary" style="line-height: 1.1">
        Enter the one-time password sent To your mobile device
      </h3>
      <div class="activation-code mx-auto">
        <div class="row">
          <div class="col-sm">
            <input-group :error="formErrors.activationCode">
              <input
                type="text"
                name="activationCode"
                required
                v-model="formData.activationCode"
                placeholder="Enter OTP"
                autocomplete="off"
                @click="clearFormError('activationCode')"
                class="text--center text--uppercase"
              />
            </input-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <button class="button col-sm" type="submit" :disabled="loading">
              {{ buttonText }}
            </button>
          </div>
        </div>
        <br />
        <form-error />
      </div>
      <div
        class="confirmation-ui flex flex--column"
        v-if="verified"
        :class="{ animate: animate }"
      >
        <div class="icon-container mt-auto">
          <img src="/assets/svg/checkmark.svg" alt />
          <span class="text--white">Phone Number Verification Complete</span>
        </div>
      </div>
      <div
        class="prompt flex flex--column"
        v-if="renderPrompt"
        :style="{ opacity: showPrompt ? 1 : 0 }"
      >
        <div class="msg">
          <h2 class="fw-md text--center">
            Do you want to adopt
            <!--an Imolite -->
            now?
          </h2>
        </div>
        <div class="actions flex mt-auto">
          <button
            class="button button--lg"
            @click="startAdoptionProcess"
            type="button"
            style="padding-left: 32px; padding-right: 32px"
          >
            Yes
          </button>
          <button
            class="button button--lg"
            @click="handleRouteChange"
            type="button"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
export default {
  computed: {
    buttonText() {
      return this.loading ? "Please wait" : "Confirm";
    },
  },
  data() {
    return {
      animate: false,
      loading: false,
      formData: {},
      renderPrompt: false,
      showPrompt: false,
      verified: false,
    };
  },
  methods: {
    handleRouteChange() {
      this.$store.commit("hideGlobalForm");
      this.$router.replace({ name: "Dashboard" });
    },
    async handleSubmit() {
      this.loading = true;
      const formData = Object.assign({}, this.formData);
      formData.continuationToken = localStorage.getItem("cToken");

      try {
        const { data } = await this.$axios.post(
          this.apiBaseUrl + "/account/confirm-registration",
          formData
        );

        this.$store.commit("setUser", data.user);
        this.verified = true;
        setTimeout(() => {
          this.animate = true;

          setTimeout(() => {
            this.renderPrompt = true;

            setTimeout(() => {
              this.showPrompt = true;
            }, 500);
          }, 2000);
        }, 2000);
      } catch (error) {
        this.handleError(error);
      }

      this.loading = false;
      return false;
    },
    startAdoptionProcess() {
      this.$store.commit("showGlobalForm", "adoption");
    },
  },
  mixins: [formMixins],
};
</script>

<style lang="scss" scoped>
form h3 {
  font-family: "Apercu Pro";
  line-height: 1.2;
  margin-bottom: 16px;
}

.activation-code {
  margin-top: 50px;
  width: 400px;
  max-width: 100%;
}

::placeholder {
  text-align: center;
}

form {
  position: relative;
}

.confirmation-ui,
.prompt {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  background-color: #fff;

  button {
    opacity: 0;
    transition: all 0.4s ease-in;
  }
}

.prompt {
  transition: all 0.4s ease-in;
  .msg {
    margin-top: 100px;
    width: 500px;
    max-width: 100%;
  }

  button {
    opacity: 1;
    margin-right: 20px;

    &:last-of-type {
      margin: 0;
    }
  }
}

.icon-container {
  width: 300px;
  height: 300px;
  background-color: $primary-color;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.6s ease-in;
  transform-origin: top center;

  img {
    width: 84px;
    margin-top: -24px;
  }

  span {
    font-size: 24px;
    padding: 8px 48px 0;
    line-height: 1.3;
  }
}

.animate {
  .icon-container {
    transform: scale(0.8);
  }
  button {
    opacity: 1;
  }
}
</style>
