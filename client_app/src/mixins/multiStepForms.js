export default {
  computed: {
    optionsData() {
      return this.$store.getters.registrationOptionsData;
    }
  },
  data() {
    return {
      currentStep: 0,
      requestedRegistrationData: false,
      steps: 0
    };
  },
  methods: {
    getOptionsData(key) {
      const data = (this.optionsData || {})[key];

      return data || [];
    },
    goBack(cb) {
      if (this.currentStep > 0) this.currentStep--;
      if (cb && typeof cb === "function") cb();
    },
    async loadRegistrationOptionsData() {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/account/registration-data"
        );
        this.$store.commit("getRegistrationOptionsData", data);
        this.requestedRegistrationData = true;
      } catch (error) {
        this.handleError(error);
      }
    }
  },
  mounted() {
    this.$el.querySelectorAll("form").forEach((form, index) => {
      form.id = "form-" + index;
    });

    const { steps } = this;
    if (typeof steps !== "undefined") {
      this.steps = document.querySelectorAll(
        ".form-data-container .step"
      ).length;
    }
  },
  watch: {
    currentStep: {
      immediate: false,
      handler(step) {
        if (step > this.steps - 1) return;
        const steps = document.querySelectorAll(".form-data-container .step");

        steps.forEach((_step, index) => {
          if (index === step) {
            _step.classList.add("visible");
            setTimeout(() => {
              _step.style.opacity = 1;
            }, 0);
          } else {
            _step.style.opacity = 0;
            _step.classList.remove("visible");
          }
        });
      }
    }
  }
};
