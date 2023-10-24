<template>
  <div class="adoption-payment-status">
    <form
      action="/payments/voucher"
      method="post"
      @submit.prevent="handleSubmit"
    >
      <div class="row">
        <div class="col-md-4 offset-md-4">
          <form-error />
          <h3 class="text--center">
            Pay with voucher (N{{ totalAmount.toLocaleString() }})
          </h3>
          <hr />
          <div class="row form-group">
            <div class="col-sm-12">
              <input-group :error="formErrors.voucherNumber">
                <label for="voucherNumber">Card PIN</label>
                <input
                  type="number"
                  name="voucherNumber"
                  class="form-control"
                  required
                  v-model="formData.voucherNumber"
                  placeholder="Enter card PIN"
                  autocomplete="off"
                  @click="clearFormError('voucherNumber')"
                />
                <input type="hidden" name="amount" :value="totalAmount" />
              </input-group>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-sm">
              <button
                class="button full-width"
                type="submit"
                :disabled="loading"
              >
                {{ buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import formMixins from "./../../mixins/formMixins";
export default {
  components: {
    // AdoptionDetails,
    // StretchLoader
  },
  computed: {
    buttonText() {
      return this.loading ? "Please wait..." : "Pay";
    },
    totalAmount() {
      console.log(this.paymentData.paymentInfo);
      return (this.paymentData.paymentInfo || {}).totalAmount || 0;
    }
  },
  data() {
    return {
      formData: {},
      errorMessage: "",
      paymentData: {}
    };
  },
  methods: {
    buildpaymentData() {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const paymentData = {};
      params.forEach((value, key) => {
        const decoded = decodeURIComponent(value);
        let parsed = decoded;
        try {
          parsed = JSON.parse(decoded);
        } catch (error) {
          // Do nothing
        }
        console.log(decoded);
        paymentData[key] = parsed;
      });

      this.paymentData = paymentData;
    },
    async handleSubmit() {
      const adoptionRequestId = this.paymentData.paymentInfo.id;
      const formData = {
        description: "Adoption payment",
        phone: this.loggedInUser.phone,
        adoptionRequestId,
        amount: parseFloat(this.totalAmount),
        voucherNumber: this.formData.voucherNumber
      };

      this.loading = true;

      try {
        const { success, data } = await this.$axios.post(
          this.apiBaseUrl + "/payments/voucher",
          formData
        );

        if (!success) {
          return this.handleError(data.message);
        }

        this.showGlobalAlert(data.message);

        setTimeout(() => {
          this.$router.replace({
            name: "AdoptionInfo",
            params: { id: adoptionRequestId }
          });
        }, 1500);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    }
  },
  mixins: [formMixins],
  mounted() {
    this.buildpaymentData();
    console.log(this.paymentData.paymentInfo);
  }
};
</script>

<style lang="scss" scoped>
.adoption-payment-status {
  margin: 60px 0;
}
.validation-screen {
  h3 {
    padding: 0 30px;
  }
}

.adoption-info-container {
  display: none;
  opacity: 0;
  transition: all 0.3s ease-in;
  transform: translateY(100px);

  &.reveal {
    transform: translateY(0px);
    opacity: 1;
  }
}

.loader-div {
  height: 100px;
  width: 100%;
  position: relative;
}

.confirmation-ui {
  align-items: center;
  background-color: #fff;

  button {
    opacity: 0;
    transition: all 0.4s ease-in;
  }
}

.close-page {
  padding: 0 10px 10px;
}

.icon-container {
  width: 300px;
  height: 300px;
  background-color: $primary-color;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.6s ease-in;
  transform-origin: top center;

  img {
    width: 84px;
    margin-top: -24px;
  }

  span {
    font-size: 24px;
    padding: 8px 48px 0;
    line-height: 1.3;
  }
}

.animate {
  .icon-container {
    transform: scale(0.8);
  }
  button {
    opacity: 1;
  }
}
</style>
