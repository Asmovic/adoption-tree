<template>
  <div class="adoption-payment-status">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <div v-if="finished" ref="confirmationContainer">
          <div
            class="confirmation-ui flex flex--column"
            v-if="valid"
            :class="{ animate: animate }"
          >
            <div class="icon-container mt-auto">
              <img src="/assets/svg/checkmark.svg" alt />
              <span class="text--white">Payment successful</span>
            </div>
          </div>
          <div v-else>
            <div class="alert alert-danger text--center" role="alert">
              <span>
                {{ errorMessage }}
                <br />
                <router-link
                  :to="{ name: 'Dashboard' }"
                  tag="button"
                  class="button flex--inline mt-2"
                  >Back to Dashboard</router-link
                >
              </span>
              <span></span>
            </div>
          </div>
        </div>
        <div v-else>
          <section class="validation-screen">
            <div class="row">
              <div class="col-12">
                <h3 class="text--center">
                  Please wait while we validate your payment
                </h3>
              </div>
              <div class="loader-div">
                <stretch-loader :show="true" />
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="col-sm-12">
        <div class="adoption-info-container" ref="adoptionInfoContainer">
          <adoption-details :data="adoptionInfo" v-if="adoptionInfo">
            <div class="close-page">
              <a href="/dashboard" class="button button--striped">Close</a>
            </div>
          </adoption-details>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { constants } from "./../../config";
import db from "./../../db";
import StretchLoader from "./../../components/ui/StretchLoader";
import AdoptionDetails from "./../../components/ui/AdoptionDetails";
export default {
  components: {
    AdoptionDetails,
    StretchLoader
  },
  data() {
    return {
      adoptionInfo: null,
      animate: false,
      errorMessage: "",
      validationData: {},
      finished: false,
      valid: false
    };
  },
  methods: {
    buildValidationData() {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      params.forEach((value, key) => {
        this.validationData[key] = value;
      });
    },

    async validatePayment() {
      const paymentData = db.get(constants.PENDING_PAYMENT_VALIDATION);
      const validationData = Object.assign(
        {},
        paymentData,
        this.validationData
      );

      if (validationData.status === "cancelled") {
        this.errorMessage = "You cancelled this transaction.";
        this.finished = true;
        return;
      }

      try {
        const { success, message, data } = await this.$axios.post(
          this.apiBaseUrl + "/payments/validate",
          validationData
        );
        if (success) {
          this.valid = true;
          setTimeout(() => {
            this.animate = true;

            setTimeout(() => {
              this.adoptionInfo = data;
            }, 3000);
          }, 500);
        } else {
          this.errorMessage = message;
        }
      } catch (error) {
        console.log(error);
        this.handleError(error);
        this.errorMessage =
          ((error.errors || [])[0] || {}).message ||
          "An error occurred. Please try again later.";
      }

      this.finished = true;
    }
  },
  mounted() {
    this.buildValidationData();
    this.validatePayment();
  },
  watch: {
    adoptionInfo: {
      handler(value) {
        if (value) {
          this.$refs.confirmationContainer.style.display = "none";
          this.$refs.adoptionInfoContainer.style.display = "block";

          setTimeout(() => {
            const element = document.querySelector(".adoption-info-container");
            element.classList.add("reveal");
          }, 50);
        }
      }
    }
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
