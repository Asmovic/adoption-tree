export default {
  methods: {
    clearFormError(key) {
      if (key in this.formErrors) this.formErrors[key] = null;
      this.$store.commit("setFormError", null);
    }
  }
};
