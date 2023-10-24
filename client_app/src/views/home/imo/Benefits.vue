<template>
  <section class="health-plan-benefits">
    <div class="container mx-auto">
      <centered-divider>
        <h2 class="fw-md">Health Plan Benefits</h2>
      </centered-divider>
      <section class="content mx-auto text--center">
        <p>
          The Imo State Health Insurance Benefit Package comprises of
          preventive, promotive and curative services.
        </p>
        <p>
          It provides minimum primary and secondary care, taking into cognizance
          the prevailing local diseases burden and morbidity pattern in Imo
          State. An enrollee under the IMSHIA is entitled to the following
          package in both primary and secondary services.
        </p>
      </section>
      <router-link
        to="/pages/imo-state-health-insurance-adoption"
        tag="button"
        class="button button--lg mx-auto read-more"
        >Read More</router-link
      >
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
.health-plan-benefits {
  margin-top: 60px;
}

.content {
  width: 750px;
  p {
    font-size: 20px;
    line-height: 1.4;
  }
}

.read-more {
  margin-top: 52px;
}
</style>
