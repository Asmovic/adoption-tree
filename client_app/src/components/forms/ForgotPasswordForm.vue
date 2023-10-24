<template>
  <div class="login-form-container">
    <img
      src="/assets/img/side-loginform-img.jpg"
      alt
      class="form__side-image"
    />
    <form
      class="login-form"
      ref="loginForm"
      method="POST"
      action="/api/account/forgot-password"
      @submit.prevent="handleSubmit"
    >
      <div class="content flex flex--column mx-auto">
        <h1 class="text--center form-header text--bold mb-0">
          {{ headerText }}
        </h1>
        <template v-if="mode === 'reset'">
          <div class="barrier"></div>

          <input-group :error="formErrors.password">
            <input
              type="password"
              name="password"
              required
              v-model="resetData.password"
              placeholder="Password"
              autocomplete="new-password"
              @click="clearFormError('password')"
            />
          </input-group>
          <input-group :error="formErrors.confirmPassword">
            <input
              type="password"
              name="confirmPassword"
              required
              v-model="resetData.confirmPassword"
              placeholder="Confirm password"
              autocomplete="new-password"
              @click="clearFormError('confirmPassword')"
            />
          </input-group>
          <input-group>
            <input
              type="text"
              v-model="resetData.token"
              required
              placeholder="Enter verification token"
              @click="clearFormError('token')"
            />
          </input-group>
        </template>
        <template v-else>
          <div class="barrier"></div>
          <input-group
            :error="formErrors.username"
            v-if="resetKey === 'username'"
          >
            <input
              type="username"
              name="username"
              required
              v-model="formData.username"
              placeholder="Username"
              autocomplete="username"
              @click="clearFormError('username')"
            />
          </input-group>
          <input-group :error="formErrors.phone" v-else>
            <input
              type="tel"
              name="phone"
              required
              v-model="formData.phone"
              placeholder="Phone no."
              autocomplete="tel"
              @click="clearFormError('phone')"
            />
          </input-group>
          <span class="key-switch">
            Can't remember your {{ keySwitchText[0] }}?
            <strong class="text--primary anchor-link" @click="switchResetKey"
              >Use {{ keySwitchText[1] }}</strong
            >
          </span>
        </template>
        <button
          class="button"
          type="submit"
          :disabled="loading"
          style="margin-top: 10px"
        >
          {{ buttonText }}
        </button>
        <br />
        <form-error />
      </div>
    </form>
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
export default {
  computed: {
    buttonText() {
      const text = this.mode === "reset" ? "Update Password" : "Reset Password";
      return this.loading ? "Please wait" : text;
    },
    headerText() {
      return this.mode === "reset"
        ? "Update your password"
        : "Reset your password";
    },
    keySwitchText() {
      return this.resetKey === "username"
        ? ["username", "phone number"]
        : ["phone number", "username"];
    }
  },
  data() {
    return {
      formData: {},
      loading: false,
      login: {},
      resetData: {},
      resetKey: "username",
      mode: "request"
    };
  },
  methods: {
    handleSubmit() {
      this.mode === "reset"
        ? this.resetPasswordUpdate()
        : this.resetPasswordChange();
    },
    async resetPasswordChange() {
      this.loading = true;
      try {
        const { continuationToken, message } = await this.$axios.post(
          this.apiBaseUrl + "/account/forgot-password",
          Object.assign({}, this.formData)
        );

        localStorage.setItem("cToken", continuationToken);
        alert(message);
        this.mode = "reset";
      } catch (error) {
        this.handleError(error);
      }

      this.loading = false;
    },
    async resetPasswordUpdate() {
      this.loading = true;
      const resetData = Object.assign({}, this.resetData);
      resetData.continuationToken = localStorage.getItem("cToken");

      try {
        const { message } = await this.$axios.post(
          this.apiBaseUrl + "/account/reset-password",
          resetData
        );

        alert(message);
        this.$store.commit("showGlobalForm", "login");
      } catch (error) {
        this.handleError(error);
      }

      this.loading = false;
    },
    switchResetKey() {
      this.resetKey = this.resetKey === "username" ? "phone" : "username";
    }
  },
  mixins: [formMixins]
};
</script>

<style lang="scss" scoped>
.login-form {
  flex: 1;
  padding-left: 24px;
}

.content {
  width: 500px;
  max-width: 100%;
}

.key-switch {
  margin: 5px 0 20px;
  text-align: center;
}

.register-link {
  padding-top: 24px;
  margin-bottom: 24px;
}

.barrier {
  margin-top: 50px;
}

button.option {
  margin-right: 24px;
  &:last-of-type {
    margin: 0;
  }
}
</style>
