<template>
  <div class="flex">
    <img
      src="/assets/img/side-registration-form-img.jpg"
      alt
      class="form__side-image"
    />
    <div class="global-form registration-form flex flex--column">
      <h1 class="text--center form-header text--bold mb-0">Register</h1>
      <h3 class="text--center text--primary">
        Kindly provide your personal information
      </h3>
      <div class="form-data-container">
        <div class="step visible">
          <form action @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.firstName">
                  <input
                    type="text"
                    name="fname"
                    required
                    v-model="registration.firstName"
                    placeholder="First name"
                    autocomplete="given-name"
                    @click="clearFormError('firstName')"
                  />
                </input-group>
              </div>
              <div class="col-sm">
                <input-group :error="formErrors.lastName">
                  <input
                    type="text"
                    name="lname"
                    required
                    v-model="registration.lastName"
                    placeholder="Last name"
                    autocomplete="family-name"
                    @click="clearFormError('lastName')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.email">
                  <input
                    type="email"
                    name="email"
                    required
                    v-model="registration.email"
                    placeholder="Email Address"
                    autocomplete="email"
                    @click="clearFormError('email')"
                  />
                </input-group>
              </div>
              <div class="col-sm">
                <input-group :error="formErrors.username">
                  <input
                    type="text"
                    name="username"
                    required
                    v-model="registration.username"
                    placeholder="Username"
                    autocomplete="off"
                    @click="clearFormError('username')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.phone">
                  <input
                    type="tel"
                    name="phone"
                    required
                    v-model="registration.phone"
                    placeholder="Phone no."
                    autocomplete="tel"
                    @click="clearFormError('phone')"
                  />
                </input-group>
              </div>
              <div class="col-sm">
                <select-box
                  name="gender"
                  v-model="registration.gender"
                  required
                >
                  <option value disabled>Select Gender</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in options.sex"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.password">
                  <input
                    type="password"
                    name="password"
                    required
                    v-model="registration.password"
                    placeholder="Password"
                    autocomplete="new-password"
                    @click="clearFormError('password')"
                  />
                </input-group>
              </div>
              <div class="col-sm">
                <input-group :error="formErrors.confirmPassword">
                  <input
                    type="password"
                    name="password"
                    required
                    v-model="registration.confirmPassword"
                    placeholder="Confirm Password"
                    autocomplete="new-password"
                    @click="clearFormError('confirmPassword')"
                  />
                </input-group>
              </div>
            </div>
          </form>
        </div>
        <div class="step">
          <form action @submit.prevent="handleSubmit">
            <div class="row"></div>
            <div class="row">
              <div class="col-sm">
                <select-box name="stateOfOrigin" v-model="registration.stateId">
                  <option value disabled>State of Origin</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in getOptionsData('states')"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
              <div class="col-sm">
                <select-box name="lgaOfOrigin" v-model="registration.lgaId">
                  <option value>LGA of Origin</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in lgas"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <select-box
                  name="stateOfOrigin"
                  v-model="registration.residentStateId"
                >
                  <option value disabled>State of Residence</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in getOptionsData('states')"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
              <div class="col-sm">
                <select-box
                  name="lgaOfResidence"
                  v-model="registration.residentLgaId"
                >
                  <option value>LGA of Residence</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in residentLgas"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.residentAddress">
                  <textarea
                    name="residentialAddress"
                    v-model="registration.residentAddress"
                    placeholder="Residential Address"
                    autocomplete="address"
                    @click="clearFormError('residentialAddress')"
                  />
                </input-group>
              </div>
            </div>
          </form>
        </div>
        <br />
        <form-error />
      </div>
      <div class="action-buttons mt-auto flex justify--space-between">
        <div class="left">
          <button
            class="button"
            type="button"
            @click="goBack"
            :disabled="loading"
          >
            Back
          </button>
        </div>
        <div class="right">
          <button
            class="button"
            type="submit"
            :form="'form-' + currentStep"
            :disabled="loading"
          >
            {{ nextText }}
          </button>
        </div>
      </div>
      <stretch-loader :show="showLoader" />
    </div>
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
import multiStepForms from "./../../mixins/multiStepForms";
export default {
  computed: {
    buttonText() {
      return this.loading ? "Please wait" : "Sign up";
    },
    lgas() {
      const { stateId } = this.registration;
      if (!stateId) return null;

      return this.getOptionsData("lgas").filter(
        x => x.stateId === parseInt(stateId)
      );
    },
    nextText() {
      if (this.loading) return "Please wait..";
      return this.currentStep >= 1 ? "Register" : "Next";
    },
    residentLgas() {
      const { residentStateId } = this.registration;
      if (!residentStateId) return "";

      return this.getOptionsData("lgas").filter(
        x => x.stateId === parseInt(residentStateId)
      );
    },
    showLoader() {
      return this.requestedRegistrationData === false && !this.optionsData;
    }
  },
  data() {
    return {
      loading: false,
      registration: { role: "DONOR", gender: "", maritalStatus: "" },
      options: {
        maritalStatus: [
          {
            id: "single",
            name: "Single"
          },
          {
            id: "married",
            name: "Married"
          },
          {
            id: "divorced",
            name: "Divorced"
          }
        ],
        sex: [
          {
            id: "male",
            name: "Male"
          },
          {
            id: "female",
            name: "Female"
          }
        ]
      },
      steps: 2
    };
  },
  methods: {
    async handleSubmit() {
      if (this.currentStep < this.steps - 1) {
        this.currentStep += 1;
        return;
      }

      this.loading = true;
      const formData = Object.assign({}, this.registration);

      try {
        const { data } = await this.$axios.post(
          this.apiBaseUrl + "/account/register",
          formData
        );

        localStorage.setItem("cToken", data.continuationToken);
        this.$store.commit(
          "showGlobalForm",
          "registration.adopter.phone.confirmation"
        );
      } catch (error) {
        this.handleError(error);
      }

      this.loading = false;
    }
  },
  mixins: [formMixins, multiStepForms],
  mounted() {
    if (!this.optionsData) {
      this.loadRegistrationOptionsData();
    }
  }
};
</script>

<style lang="scss" scoped>
.registration-form-container {
  padding: 20px;
}

.registration-form {
  flex: 1;
}

form h3 {
  font-family: "Apercu Pro";
  line-height: 1.2;
  margin-bottom: 16px;
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

.step {
  display: none;
  visibility: hidden;
  transition: all ease-in 0.25s;

  &.visible {
    display: block;
    visibility: visible;
  }
}
</style>
