<template>
  <div class="login-form-container">
    <img
      src="/assets/img/side-loginform-img.jpg"
      alt
      class="form__side-image"
    />
    <form
      class="login-form flex flex--column"
      ref="loginForm"
      method="POST"
      action="/api/account/login"
      @submit.prevent="handleSubmit"
    >
      <h1 class="text--center form-header text--bold mb-0">Welcome Back</h1>
      <template v-if="!showRoleForm">
        <input-group :error="formErrors.username">
          <input
            type="username"
            name="username"
            required
            v-model="login.username"
            placeholder="Username"
            autocomplete="username"
            @click="clearFormError('username')"
          />
          <template #icon>
            <img src="/assets/svg/user.svg" alt="User icon" />
          </template>
        </input-group>
        <input-group :error="formErrors.password">
          <input
            type="password"
            name="password"
            required
            v-model="login.password"
            placeholder="Password"
            autocomplete="current-password"
            @click="clearFormError('password')"
          />
          <template #icon>
            <img src="/assets/svg/padlock.svg" alt="Padlock icon" />
          </template>
        </input-group>
        <span
          class="anchor-link text--right text--primary"
          @click="$store.commit('showGlobalForm', 'forgot-password')"
          >Forgot Password</span
        >
        <span class="register-link text--center">
          Don’t have an account?&nbsp;
          <span
            class="text--primary text--bold anchor-link"
            @click="showGlobalForm('registration.role')"
            >Register</span
          >
        </span>
        <button class="button" type="submit" :disabled="loading">
          {{ buttonText }}
        </button>
      </template>
      <template v-else>
        <div class="role-options flex">
          <button
            class="option button"
            v-for="(option, index) in roleOptions"
            :key="index"
            :disabled="loading"
            @click.prevent="setUserRole(option.name)"
          >
            {{ option.displayName }}
          </button>
        </div>
      </template>
      <br />
      <form-error />
    </form>
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
export default {
  computed: {
    buttonText() {
      return this.loading ? "Please wait" : "Login";
    }
  },
  data() {
    return {
      loading: false,
      login: {},
      roleOptions: null,
      showRoleForm: false
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      try {
        const {
          success,
          roleOptions,
          user,
          appStateId
        } = await this.$axios.post(this.apiBaseUrl + "/auth/login", this.login);

        if (!success) {
          this.roleOptions = roleOptions;
          this.showRoleForm = true;
        } else {
          this.$store.commit("setUser", user);
          this.$store.commit("setStateId", appStateId);
          window.location = "/dashboard";
        }
      } catch (error) {
        this.handleError(error);
      }

      this.loading = false;
    },
    async setUserRole(role) {
      this.loading = true;
      try {
        const { user } = await this.$axios.patch(
          this.apiBaseUrl + "/auth/active-role",
          {
            activeRole: role
          }
        );

        this.$store.commit("setUser", user);

        window.location = "/dashboard";
      } catch (error) {
        if (error.errors) this.formErrors = error.errors;
      }

      this.loading = false;
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

.register-link {
  padding-top: 24px;
  margin-bottom: 24px;
}

button.option {
  margin-right: 24px;
  &:last-of-type {
    margin: 0;
  }
}
</style>
