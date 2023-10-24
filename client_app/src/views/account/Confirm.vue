<template>
  <div class="confirm-registration text--center mx-auto">
    <h3 class="text--center text--bold">One more step</h3>
    <p>Enter the verification code sent to your phone number/email</p>
    <form
      action="/account/confirm-registration"
      method="POST"
      class="flex flex--column flex--items-center mx-auto"
      @submit.prevent="handleSubmit"
    >
      <input-group>
        <input
          type="text"
          class="text--uppercase text--center"
          v-model="formData.activationCode"
          required
          @click="clearFormError('activationCode')"
        />
      </input-group>
      <button class="button" type="submit">{{ buttonText }}</button>
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
      return this.loading ? "Please wait" : "Confirm";
    }
  },
  data() {
    return {
      formData: {}
    };
  },
  methods: {
    async handleSubmit() {
      const formData = Object.assign({}, this.formData);
      formData.continuationToken = localStorage.getItem("cToken");

      try {
        const { data, appStateId } = await this.$axios.post(
          this.apiBaseUrl + "/account/confirm-registration",
          formData
        );

        this.$store.commit("setUser", data.user);
        this.$store.commit("setStateId", appStateId);

        window.location = "/dashboard";
      } catch (error) {
        this.handleError(error);
      }
    }
  },
  mixins: [formMixins]
};
</script>

<style lang="scss" scoped>
.confirm-registration {
  margin-top: 80px;
  width: 450px;
  max-width: 100%;
}
</style>
