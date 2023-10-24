<template>
  <div class="flex">
    <img
      src="/assets/img/side-registration-form-img.jpg"
      alt
      class="form__side-image"
    />
    <div class="global-form registration-form flex flex--column">
      <div class="form-data-container">
        <div class="step visible">
          <form action @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-8 offset-md-2">
                <div class="prompt">
                  <h2 class="text--center prompt__msg">
                    Do you want to buy a health plan now?
                  </h2>
                  <div class="row">
                    <div class="col-sm-6 offset-sm-3">
                      <button
                        class="button button--lg full-width"
                        type="submit"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                  <div class="flex justify--center"></div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="step">
          <form action @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-8 offset-md-2">
                <h2 class="text--center text--bold chp">Choose Health plan</h2>
                <div
                  class="plan-btns flex justify--space-between flex--items-center"
                >
                  <div
                    v-for="(plan, index) in getPlans()"
                    :key="index"
                    :class="{ 'selection-border': plan.key === selectedPlan }"
                  >
                    <button
                      class="button button--lg"
                      type="submit"
                      @click="setPlan(plan.key)"
                    >
                      {{ plan.name }}
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  v-model="selectedPlan"
                  required
                  style="width: 0; height: 0; padding: 0; margin: 0;"
                />
                <a
                  href="/pages/health-plan-benefits"
                  class="button button--lg button--striped text--no-decoration text--primary hb-btn"
                  target="_blank"
                  >View all health plans</a
                >
              </div>
            </div>
          </form>
        </div>
        <div class="step">
          <form action @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-8 offset-md-2">
                <h2 class="text--center text--bold chp">Choose Health plan</h2>
                <div class="plan-btns flex justify--center">
                  <button
                    class="button button--lg"
                    type="button"
                    style="margin-top: -30px;"
                  >
                    {{ selectedPlan }}
                  </button>
                </div>
                <h1 class="text--bold text--center">{{ priceFormatted }}</h1>
              </div>
            </div>
          </form>
        </div>
        <div class="step">
          <form action @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-8 offset-md-2">
                <h3 class="text--center text--bold text--primary chp mb-0">
                  Cost of plan
                </h3>
                <h1 class="text--bold text--center">{{ priceFormatted }}</h1>
                <div class="row">
                  <div class="col-12">
                    <div class="payment-options">
                      <select-box required v-model="formData.paymentType">
                        <option value>Select payment method</option>
                        <option
                          v-for="(option, index) in paymentMethods"
                          :value="option.id"
                          :key="index"
                          >{{ option.name }}</option
                        >
                      </select-box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="step">
          <form action @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-8 offset-md-2">
                <h3 class="text--center text--bold confirm-header">
                  Confirm Payment of
                </h3>
                <h1 class="text--bold text--center mb-0">
                  {{ priceFormatted }}
                </h1>
                <h2 class="text--center">
                  <small>for Health Insurance</small>
                </h2>
                <div class="row">
                  <div class="col-12">
                    <div class="interval-options">
                      <div class="option flex">
                        <input
                          type="radio"
                          required
                          name="durationType"
                          v-model="formData.durationType"
                          value="onetime"
                          id="onetime"
                        />
                        <label for="onetime" role="radio">
                          <span class="plan">One time @</span>
                          <span>{{ getIntervalAmount("onetimeAmount") }}</span>
                        </label>
                      </div>
                      <div class="option flex">
                        <input
                          type="radio"
                          name="durationType"
                          v-model="formData.durationType"
                          value="weekly"
                          id="weekly"
                        />
                        <label for="weekly" role="radio">
                          <span class="plan">Weekly @</span>
                          <span>{{ getIntervalAmount("weeklyAmount") }}</span>
                        </label>
                      </div>
                      <div class="option flex">
                        <input
                          type="radio"
                          name="durationType"
                          v-model="formData.durationType"
                          value="monthly"
                          id="monthly"
                        />
                        <label for="monthly" role="radio">
                          <span class="plan">Monthly @</span>
                          <span>{{ getIntervalAmount("monthlyAmount") }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-auto">
        <div class="col-md-8 offset-md-2">
          <div
            class="action-buttons mt-auto flex justify--space-between"
            v-if="currentStep > 0"
          >
            <div class="left">
              <button
                class="button"
                type="button"
                @click="goBack"
                :disabled="loading"
                :style="{ visibility: currentStep > 0 ? 'visible' : 'hidden' }"
              >
                Back
              </button>
            </div>
            <div class="right">
              <button
                class="button"
                type="submit"
                :form="'form-' + currentStep"
                :disabled="loading || invalid"
              >
                {{ nextText }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <stretch-loader :show="showStretchLoader" />
    </div>
  </div>
</template>

<script>
import config from "./../../config";
import db from "./../../db";
import formMixins from "./../../mixins/formMixins";
import multiStepForms from "./../../mixins/multiStepForms";
export default {
  computed: {
    invalid() {
      return this.currentStep === 1 && !this.selectedPlan;
    },
    nextText() {
      if (this.currentStep < this.steps - 1) return "Next";

      if (this.loading) return "Please wait..";
      return "Confirm";
    },
    price() {
      if (!this.selectedPlan) return 0;

      const { durationType } = this.formData;

      // let key = "dailyAmount";
      let key = durationType + "Amount";

      return this.adoptionRates[this.selectedPlan][key];
    },
    priceFormatted() {
      return "₦" + parseFloat(this.price).toLocaleString();
    }
  },
  created() {
    this.formData.lgaId = this.loggedInUser.lgaId;
  },
  data() {
    return {
      adoptionRates: {},
      allowPayment: false,
      formData: {
        category: "self",
        durationType: "onetime",
        duration: 1,
        lgaId: null,
        noOfAdoptees: 1,
        type: "self"
      },
      loading: false,
      loadingPaymentInfo: false,
      paymentMethods: [
        // TODO: Uncomment as they're being implemented
        {
          id: "voucher",
          name: "Voucher"
        },
        // {
        //   id: "airtime",
        //   name: "Airtime"
        // },
        // {
        //   id: "ussd",
        //   name: "MyBankUSSD"
        // },
        {
          id: "debit_card",
          name: "Debit Card"
        }
      ],
      selectedPlan: "",
      showStretchLoader: false
    };
  },
  methods: {
    getIntervalAmount(key) {
      return (
        "₦" +
        parseFloat(
          (this.adoptionRates[this.selectedPlan] || {})[key] || 0
        ).toLocaleString()
      );
    },
    getPlans() {
      return Object.keys(this.adoptionRates).map(key => {
        return {
          key,
          name: key + " plan"
        };
      });
    },
    async getAdoptionRates() {
      this.showStretchLoader = true;

      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/adoptions/rates"
        );

        this.adoptionRates = data.reduce((acc, item) => {
          acc[item.type] = item;
          return acc;
        }, {});
      } catch (error) {
        this.handleError(error);
      }

      this.showStretchLoader = false;
    },
    async handleSubmit() {
      if (this.currentStep < this.steps - 1) {
        this.currentStep += 1;
        return;
      }

      this.loading = true;
      const formData = Object.assign({}, this.formData);
      const rate = this.adoptionRates[this.selectedPlan];
      formData.totalAmount = this.price;
      formData.plan = this.selectedPlan;
      formData.planId = rate.id;

      try {
        const { success, data, paymentLink } = await this.$axios.post(
          this.apiBaseUrl + "/adoptions",
          formData
        );

        // TODO: Handle other payment methods
        db.save(config.constants.PENDING_PAYMENT_VALIDATION, {
          adoptionRequestId: data.id
        });

        if (success) {
          // Voucher payment
          if (formData.paymentType === "voucher") {
            const queryString = JSON.stringify(data);
            this.hideGlobalForm();
            this.$router.push({
              name: "PayWithVoucher",
              query: { paymentInfo: queryString, method: "voucher" }
            });
            return;
          }

          window.location = paymentLink;
        }
      } catch (error) {
        this.handleError(error);
      }

      this.loading = false;
    },
    setPlan(key) {
      this.selectedPlan = key;
    }
  },
  mixins: [formMixins, multiStepForms],
  mounted() {
    //
  },
  watch: {
    currentStep: {
      handler(step) {
        if (step === 1 && Object.keys(this.adoptionRates) < 1) {
          this.getAdoptionRates();
        }
      }
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

.selection-border {
  padding: 8px;
  border: 1.2px solid #c1c1c1;
  border-radius: 8px;
}

form h3 {
  font-family: "Apercu Pro";
  line-height: 1.2;
  margin-bottom: 16px;
}

.chp {
  margin: 20px 0 60px;
}

.payment-options {
  margin-top: 50px;
}

.interval-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 20px;
  gap: 15px;

  .option {
    input {
      visibility: hidden;
      height: 0;
      width: 0;
      margin: 0;

      + label {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid $color-grey;
        &:hover {
          border-color: $primary-color;
        }
      }

      &:checked + label {
        border-color: $primary-color;
      }
    }
  }
}

.hb-btn {
  font-weight: 600;
  font-family: Raleway;
  border-width: 2px;
  margin-top: 20px;
}

button.option {
  margin-right: 24px;
  &:last-of-type {
    margin: 0;
  }
}

.plan-btns {
  button {
    text-transform: capitalize;
  }
}

.confirm-header {
  margin: 30px 0px 0;
  font-size: 28px;
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

.prompt {
  &__msg {
    font-size: 36px;
    padding: 80px;
  }
}

.action-buttons {
  button {
    width: 200px;
    max-width: 100%;
  }
}
</style>
