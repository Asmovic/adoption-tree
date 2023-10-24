<template>
  <div class="flex">
    <img
      src="/assets/img/side-registration-form-img.jpg"
      alt
      class="form__side-image"
    />
    <div class="global-form registration-form flex flex--column">
      <h1
        class="text--center form-header text--bold mb-0"
        v-if="currentStep === 0"
      >
        Adopt
      </h1>
      <br />
      <div class="form-data-container">
        <div class="step visible">
          <form action @submit.prevent="handleSubmit">
            <div
              class="flex justify--center flex--items-center"
              style="margin-bottom: 20px"
            >
              <h3 class="mb-0" style="margin-right: 20px">Method</h3>
              <select-box name="type" id="type" v-model="formData.type">
                <!-- <option value="random" selected>Auto</option> -->
                <option value="list" >Upload file</option>
                <option value="multi-form" selected>Enter Adoptee(s) info</option>
              </select-box>
            </div>
            <!-- <template v-if="formData.type === 'random'">
              <div class="row">
                <div class="col-sm">
                  <select-box name="lgaId" v-model="formData.lgaId" required>
                    <option value>Select LGA of choice</option>
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
                    name="category"
                    v-model="formData.category"
                    required
                  >
                    <option value disabled>Category of adoption</option>
                    <option
                      :value="option.id"
                      v-for="(option, index) in options.categories"
                      :key="index"
                      >{{ option.name }}</option
                    >
                  </select-box>
                </div>
              </div>
              <div class="row">
                <div class="col-sm">
                  <input-group :error="formErrors.noOfAdoptees">
                    <input
                      type="number"
                      name="noOfAdoptees"
                      required
                      v-model="formData.noOfAdoptees"
                      placeholder="No. of adoptees"
                      autocomplete="off"
                      @click="clearFormError('noOfAdoptees')"
                    />
                  </input-group>
                </div>
              </div>
            </template> -->
            <template v-if="formData.type === 'list'">
              <div class="row">
                <div class="col-md-6">
                  <a
                    href="/assets/files/adoption_file.xlsx"
                    class="button"
                    download
                    target="_blank"
                    ><span>Download sample</span>
                    <div class="_space"></div>
                    <ion-icon name="copy"></ion-icon>
                  </a>
                </div>
                <div class="col-md-6">
                  <input
                    type="file"
                    name="file"
                    class="button full-width"
                    ref="customFile"
                    required
                    accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  />
                </div>
              </div>
            </template>
            <template v-if="formData.type === 'multi-form'">
              <div
                class="flex justify--space-between flex--items-center"
                v-for="(row, index) in formDataEntries"
                :key="index"
              >
                <div class="row" style="flex: 1">
                  <div class="col-md-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      v-model="formData.entries[index].firstName"
                      autocomplete="off"
                      required
                    />
                  </div>
                  <div class="col-md-4">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      v-model="formData.entries[index].lastName"
                      autocomplete="off"
                      required
                    />
                  </div>
                  <div class="col-md-4">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      v-model="formData.entries[index].phone"
                      required
                      autocomplete="off"
                    />
                  </div>
                </div>
                <div
                  class="flex entry-buttons"
                  :style="{
                    visibility: index === formDataEntries.length - 1,
                    paddingLeft: '10px'
                  }"
                >
                  <button
                    @click="addEntry"
                    type="button"
                    style="margin-right: 8px"
                  >
                    +
                  </button>
                  <button
                    @click="removeEntry(index)"
                    type="button"
                    :style="{
                      backgroundColor: 'red',
                      visibility: index > 0 ? 'visible' : 'hidden'
                    }"
                  >
                    -
                  </button>
                </div>
              </div>
            </template>
          </form>
        </div>
        <div class="step">
          <form action @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-8 offset-md-2">
                <div class="flex flex--column text--center">
                  <h2 class="text--primary">Total cost of adoption</h2>
                  <h1 class="text--bold">
                    N{{ (formData.totalAmount || 0).toLocaleString() }}
                  </h1>
                  <br />
                  <select-box
                    name="category"
                    v-model="formData.paymentType"
                    required
                  >
                    <option value disabled>Choose payment method</option>
                    <option
                      :value="option.id"
                      v-for="(option, index) in options.paymentMethods"
                      :key="index"
                      >{{ option.name }}</option
                    >
                  </select-box>
                </div>
              </div>
            </div>
          </form>
          <br />
          <form-error />
        </div>
      </div>
      <div class="action-buttons mt-auto flex justify--space-between">
        <div class="left">
          <button
            class="button"
            type="button"
            @click="goBack(allowPaymentFn)"
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
            :disabled="loading || !allowPayment"
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
import config from "./../../config";
import db from "./../../db";
import formMixins from "./../../mixins/formMixins";
import multiStepForms from "./../../mixins/multiStepForms";
export default {
  computed: {
    formDataEntries() {
      return this.formData.entries || [];
    },
    lgas() {
      const { defaultStateId } = this.optionsData || {};
      if (!defaultStateId) return null;

      return this.getOptionsData("lgas").filter(
        x => x.stateId === parseInt(defaultStateId)
      );
    },
    nextText() {
      if (this.loading) return "Please wait..";
      return this.currentStep >= 1 ? "Make payment" : "Next";
    },
    showLoader() {
      return (
        this.loadingPaymentInfo ||
        (this.requestedRegistrationData === false && !this.optionsData)
      );
    }
  },
  data() {
    return {
      adoptionRates: {},
      allowPayment: true,
      formData: {
        durationType: "onetime",
        duration: 1,
        type: "multi-form",
        entries: [{ firstName: "", lastName: "", phone: "" }],
        plan: "individual"
      },
      loading: false,
      loadingPaymentInfo: false,
      options: {
        categories: [
          {
            id: "men",
            name: "Men"
          },
          {
            id: "women",
            name: "Women"
          },
          {
            id: "children",
            name: "Children"
          },
          // {
          //   id: "any",
          //   name: "Random"
          // }
        ],
        paymentMethods: [
          // TODO: Uncomment as they're being implemented
          // {
          //   id: "voucher",
          //   name: "Voucher"
          // },
          // {
          //   id: "airtime",
          //   name: "Airtime",
          // },
          // {
          //   id: "ussd",
          //   name: "MyBankUSSD",
          // },
          {
            id: "debit_card",
            name: "Debit Card"
          }
        ]
      },
      steps: 0,
      useOwnCategory: false
    };
  },
  methods: {
    async getAdoptionRates() {
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
      console.log(this.adoptionRates);
    },
    addEntry() {
      this.formData.entries.push({ firstName: "", lastName: "", phone: "" });
    },
    allowPaymentFn() {
      this.allowPayment = true;
    },
    async getPaymentInfo() {
      this.loadingPaymentInfo = true;
      const { type, noOfAdoptees, entries, durationType, plan } = this.formData;

      let estimateData = {
        durationType,
        noOfAdoptees:
          type === "random"
            ? noOfAdoptees
            : type === "multi-form"
            ? entries.length
            : 0,
        plan,
        entries,
        type
      };

      if (type === "list") {
        const formData = new FormData();
        Object.keys(estimateData).forEach(key => {
          formData.append(key, estimateData[key]);
        });

        // Add file to form data
        const fileInput = this.$refs.customFile;
        const file = fileInput.files[0];
        formData.append("file", file, file.name);

        estimateData = formData;
      }

      try {
        const { data } = await this.$axios.post(
          this.apiBaseUrl + "/adoptions/estimate",
          estimateData
        );

        const { totalAmount, entryId } = data;

        this.formData.totalAmount = totalAmount;
        if (entryId) this.formData.entryId = entryId;
      } catch (error) {
        this.handleError(error);
        this.allowPayment = false;
      }

      this.loadingPaymentInfo = false;
    },
    async handleSubmit() {
      // Check for unique phone numbers
      if (this.formData.type === "multi-form" && this.currentStep === 0) {
        const phoneNumbers = {};
        let duplicatePhone = "";
        if (
          this.formData.entries.some(entry => {
            if (entry.phone in phoneNumbers) {
              duplicatePhone = entry.phone;
              return true;
            }

            phoneNumbers[entry.phone] = true;
            return false;
          })
        ) {
          return alert(
            'Phone number "' + duplicatePhone + '" has already been included.'
          );
        }
      }

      if (this.currentStep < this.steps - 1) {
        this.currentStep += 1;
        this.clearFormError();

        return;
      }

      const formData = Object.assign({}, this.formData);
      this.loading = true;
      console.log("formData:", this.formData);
      const rate = this.adoptionRates[formData.plan];
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
    removeEntry(index) {
      this.formData.entries.splice(index, 1);
    }
  },
  mixins: [formMixins, multiStepForms],
  mounted() {
    if (!this.loadedOptionsData) {
      this.loadRegistrationOptionsData();
    }

    this.steps = document.querySelectorAll(".form-data-container .step").length;

    // Start with a clean slate
    db.delete(config.constants.PENDING_PAYMENT_VALIDATION);
  },
  watch: {
    currentStep: {
      handler(step) {
        if (step === 1) {
          this.getAdoptionRates();
        }
        if (step === this.steps - 1) {
          this.getPaymentInfo();
        }
        if (step > 0) return this.setPopupSize("lg");
      }
    },
    formData: {
      immediate: true,
      deep: true,
      handler(data) {
        if (data.type === "multi-form") {
          this.setPopupSize("xl");
        } else this.setPopupSize("lg");
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

::v-deep #type {
  width: 250px;
  max-width: 100%;
}

.entry-buttons {
  button {
    background-color: $primary-color;
    border-radius: 4px;
    color: #fff;
    border: none;
    cursor: pointer;
    width: 22px;
    height: 22px;
    padding: 0;
    line-height: 22px;

    &:hover {
      opacity: 0.8;
    }
  }
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
