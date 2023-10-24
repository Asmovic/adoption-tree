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
                class="text--center"
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
        <div class="row full-width">
          <div class="col-md-10 offset-1">
            <div class="row">
              <div class="col-sm-6">
                <button
                  class="button button--lg full-width"
                  @click="handleRouteChange"
                  type="button"
                >
                  Buy Plan
                </button>
              </div>
              <div class="col-sm-6">
                <a
                  href="/pages/health-plan-benefits"
                  target="_blank"
                  class="button button--lg text--no-decoration"
                  >View Health Plans Benefits</a
                >
              </div>
            </div>
          </div>
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
    }
  },
  data() {
    return {
      animate: false,
      loading: false,
      formData: {},
      verified: false
    };
  },
  methods: {
    handleRouteChange() {
      this.showGlobalForm("enrollee.adoption");
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
        }, 2000);
      } catch (error) {
        this.handleError(error);
      }

      this.loading = false;
      return false;
    }
  },
  mixins: [formMixins]
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

.confirmation-ui {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  background-color: #fff;

  .button {
    opacity: 0;
    transition: all 0.4s ease-in;
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
  .button {
    opacity: 1;
  }
}
</style>
