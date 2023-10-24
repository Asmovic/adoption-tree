<template>
  <div class="flex">
    <img
      src="/assets/img/side-registration-form-img.jpg"
      alt
      class="form__side-image"
    />
    <div class="global-form registration-form flex flex--column">
      <template v-if="currentStep < steps - 1">
        <h1 class="text--center form-header text--bold mb-0">Register</h1>
        <h3 class="text--center text--primary">{{ subheadingText }}</h3>
      </template>
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
                <input-group :error="formErrors.middleName">
                  <input
                    type="text"
                    name="lname"
                    v-model="registration.middleName"
                    placeholder="Middle name"
                    autocomplete="additional-name"
                    @click="clearFormError('middleName')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row">
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
            </div>
            <div class="row">
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
            </div>
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.password">
                  <input
                    type="password"
                    name="password"
                    required
                    minlength="6"
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
                    minlength="6"
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
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.birthDate">
                  <input
                    type="date"
                    name="birthDate"
                    required
                    v-model="registration.birthDate"
                    placeholder="Date of birth"
                    autocomplete="bday"
                    @click="clearFormError('birthDate')"
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
                <select-box
                  name="gender"
                  v-model="registration.maritalStatus"
                  required
                >
                  <option value disabled>Select Marital Status</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in options.maritalStatus"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
              <div class="col-sm">
                <select-box name="lgaId" v-model="registration.lgaId" required>
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
                <select-box
                  name="hospitalId"
                  v-model="registration.hospitalId"
                  required
                >
                  <option value>Closest facility</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in hospitals"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
              <div class="col-sm"></div>
            </div>
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.address">
                  <textarea
                    name="address"
                    required
                    v-model="registration.address"
                    placeholder="Residential Address"
                    autocomplete="address"
                    @click="clearFormError('address')"
                  />
                </input-group>
              </div>
              <div class="col-sm">
                <input-group :error="formErrors.preExistingConditions">
                  <textarea
                    name="preExistingConditions"
                    v-model="registration.preExistingConditions"
                    placeholder="Pre-existing Conditions"
                    autocomplete="none"
                    @click="clearFormError('preExistingConditions')"
                  />
                </input-group>
              </div>
            </div>
          </form>
        </div>
        <div class="step">
          <form action @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.nokFirstName">
                  <input
                    type="text"
                    name="nokFirstName"
                    required
                    v-model="registration.nokFirstName"
                    placeholder="First name"
                    autocomplete="off"
                    @click="clearFormError('nokFirstName')"
                  />
                </input-group>
              </div>
              <div class="col-sm">
                <input-group :error="formErrors.nokLastName">
                  <input
                    type="text"
                    name="nokLastName"
                    required
                    v-model="registration.nokLastName"
                    placeholder="Last name"
                    autocomplete="off"
                    @click="clearFormError('nokLastName')"
                  />
                </input-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <input-group :error="formErrors.nokPhone">
                  <input
                    type="tel"
                    name="nokPhone"
                    required
                    v-model="registration.nokPhone"
                    placeholder="Phone no."
                    autocomplete="tel"
                    @click="clearFormError('nokPhone')"
                  />
                </input-group>
              </div>
              <div class="col-sm">
                <select-box
                  name="nokGender"
                  v-model="registration.nokGender"
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
                <select-box
                  name="nokRelationshipId"
                  v-model="registration.nokRelationshipId"
                  required
                >
                  <option value disabled>Select Relationship</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in getOptionsData(
                      'nokRelationships'
                    )"
                    :key="index"
                    >{{ option.value }}</option
                  >
                </select-box>
              </div>
              <div class="col-sm">
                <select-box name="nokStateId" v-model="registration.nokStateId">
                  <option value disabled>State of Origin</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in getOptionsData('states')"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <select-box name="nokLgaId" v-model="registration.nokLgaId">
                  <option value>LGA of Origin</option>
                  <option
                    :value="option.id"
                    v-for="(option, index) in nokLgas"
                    :key="index"
                    >{{ option.name }}</option
                  >
                </select-box>
              </div>
              <div class="col-sm"></div>
            </div>
          </form>
        </div>
        <div class="step">
          <form action @submit.prevent="handleSubmit">
            <h1 class="text--center text--primary text--bold">Declaration</h1>
            <div class="declaration text--center">
              <p>
                I hereby declare that all the personal information provided are
                true, that I have not concealed nor withheld anything with which
                the assurer should be acquainted with in other to assess my
                eligibility for health insurance.
              </p>
              <p>
                There are no additional facts affecting the risk of assurance on
                my health of which the AGENCY should be made aware of.
              </p>
            </div>
            <div class="buttons">
              <div class="row">
                <div class="col-md-8 offset-md-2">
                  <div class="row">
                    <div class="col-sm-6">
                      <button
                        class="button button--lg full-width"
                        type="submit"
                        :disabled="loading"
                      >
                        {{ buttonText }}
                      </button>
                    </div>
                    <div class="col-sm-6">
                      <button
                        class="button button--lg full-width"
                        type="button"
                        @click="goBack"
                      >
                        Back to Registration
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <br />
        <form-error />
      </div>
      <div
        class="action-buttons mt-auto flex justify--space-between"
        v-show="currentStep <= steps - 2"
      >
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
      return this.loading ? "Please wait" : "I Declare";
    },
    lgas() {
      const { stateId } = this.registration;
      if (!stateId) return [];

      return this.getOptionsData("lgas").filter(
        x => x.stateId === parseInt(stateId)
      );
    },
    hospitals() {
      const hospitals = this.getOptionsData("hospitals");
      if (this.registration.lgaId) {
        return hospitals.filter(
          x => parseInt(x.lgaId) === parseInt(this.registration.lgaId)
        );
      }

      return hospitals;
    },
    nextText() {
      if (this.loading) return "Please wait..";
      return this.currentStep >= this.steps - 1 ? "Register" : "Next";
    },
    nokLgas() {
      const { nokStateId } = this.registration;
      if (!nokStateId) return [];

      return this.getOptionsData("lgas").filter(
        x => x.stateId === parseInt(nokStateId)
      );
    },
    residentLgas() {
      const { defaultStateId } = this.optionsData || {};

      return this.getOptionsData("lgas").filter(
        x => x.stateId === parseInt(defaultStateId || 3)
      );
    },
    showLoader() {
      return this.requestedRegistrationData === false && !this.optionsData;
    },
    subheadingText() {
      return this.currentStep >= this.steps - 2
        ? "Next of kin details"
        : "Kindly provide your personal information";
    }
  },
  data() {
    return {
      loading: false,
      registration: { role: "ENROLLEE", gender: "", maritalStatus: "" },
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
      steps: 0
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
          "registration.enrollee.phone.confirmation"
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

.declaration {
  font-size: 18px;
  font-family: Raleway;
  padding: 25px 20px;
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
