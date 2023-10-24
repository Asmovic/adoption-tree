<template>
  <div class="registration-container flex">
    <img src="/assets/img/side-registration-form-img.jpg" alt class="form__side-image" />
    <div class="global-form content flex flex--column">
      <h1 class="text--center form-header text--bold mb-0">Register as</h1>
      <div class="form-container">
        <div class="role-options flex justify--center">
          <button
            class="option button"
            v-for="(option, index) in roleOptions"
            :key="index"
            type="button"
            @click="showRegistrationForm(option.displayName)"
          >{{ option.displayName }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleOptions: [
        {
          name: "ENROLLEE",
          displayName: "Enrollee"
        },
        {
          name: "DONOR",
          displayName: "Adopter"
        }
      ]
    };
  },
  methods: {
    showRegistrationForm(name) {
      this.$store.commit(
        "showGlobalForm",
        `registration.${name.toLowerCase()}`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  flex: 1;
}

.registration-container {
  .content {
    flex: 1;
    padding-left: 24px;
  }
}

.role-options {
  margin-top: 120px;
  button {
    margin-right: 20px;
    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>
