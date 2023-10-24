<template>
  <section class="howto-sponsor">
    <div class="container mx-auto">
      <centered-divider>
        <h2 class="fw-md">How To Sponsor</h2>
      </centered-divider>
      <div class="steps grid">
        <div class="step text--center">
          <div
            class="icon flex flex--items-center justify--center mx-auto img--rounded"
          >
            <img src="/assets/img/clipboard-with-pencil.svg" alt="Register" />
          </div>
          <h2 class="mb-0">Register</h2>
          <h3 class="fw-md">Supply your details</h3>
        </div>
        <div class="step text--center">
          <div
            class="icon flex flex--items-center justify--center mx-auto img--rounded"
          >
            <img src="/assets/img/magnifier.svg" alt="Register" />
          </div>
          <h2 class="mb-0">Search</h2>
          <h3 class="fw-md">Search for Adoptee</h3>
        </div>
        <div class="step text--center">
          <div
            class="icon flex flex--items-center justify--center mx-auto img--rounded"
          >
            <img
              src="/assets/img/credit-card.svg"
              alt="Make Payment for the Selected Adoptee"
            />
          </div>
          <h2 class="mb-0">Pay</h2>
          <h3 class="fw-md">Make Payment for the Selected Adoptee</h3>
        </div>
        <div class="step text--center">
          <div
            class="icon flex flex--items-center justify--center mx-auto img--rounded"
          >
            <img
              src="/assets/img/playoff.svg"
              alt="Your Adoptees Are Added To Your AdoptionTREE"
            />
          </div>
          <h2 class="mb-0">View Tree</h2>
          <h3 class="fw-md">Your Adoptees Are Added To Your AdoptionTREE</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CenteredDivider from "./../../../components/ui/CenteredDivider";

export default {
  components: { CenteredDivider }
};
</script>

<style lang="scss" scoped>
.steps {
  padding-top: 66px;
  grid-template-columns: repeat(4, 1fr);
  h3 {
    margin-top: 16px;
  }
}
.icon {
  width: 168px;
  height: 168px;
  background-color: #000;
  border: 15px solid $primary-color;
  padding: 12px;

  img {
    padding: 12px;
  }
}
</style>
