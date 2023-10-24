<template>
  <section class="statistics" id="statistics">
    <div class="container mx-auto">
      <centered-divider>
        <h2 class="fw-md">Statistics</h2>
      </centered-divider>
      <div class="points grid">
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/goal.svg" alt="Adoption target" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Adoption Target per annum</h3>
          <div class="content">
            <h2 class="mb-0">250,000</h2>
          </div>
        </div>
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/coin.svg" alt="Target Population" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Target Population</h3>
          <div class="content">
            <h2 class="mb-0">5,408,756</h2>
          </div>
        </div>
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/goal.svg" alt="Number of Enrollees" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Total Number of Enrollees</h3>
          <div class="content">
            <h2 class="mb-0">6000+</h2>
          </div>
        </div>
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/family-insurance-1.svg" alt=" Women and Children" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Total Number of Women and Children Covered</h3>
          <div class="content">
            <h2 class="mb-0">4,873</h2>
          </div>
        </div>
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/family-insurance-2.svg" alt="Vulnerables left" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Number of Vulnerable Individuals Left</h3>
          <div class="content">
            <h2 class="mb-0">5,000,000+</h2>
          </div>
        </div>
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/coin.svg" alt="Largest Adoption" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Largest Adoption by one Adopter</h3>
          <div class="content">
            <h2 class="mb-0">2,000</h2>
          </div>
        </div>
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/pharmacy.svg" alt="Providers" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Health Care Providers</h3>
          <div class="content">
            <h2 class="mb-0">280</h2>
          </div>
        </div>
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/family-insurance-2.svg" alt="Total Indigent Residents" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Total Indigent Residents</h3>
          <div class="content">
            <h2 class="mb-0">50,502</h2>
          </div>
        </div>
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon">
            <img src="/assets/img/coin.svg" alt="Adopters" />
          </div>
          <h3 class="icon-text text--primary fw-md mb-0">Adopters</h3>
          <div class="content">
            <h2 class="mb-0">62</h2>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CenteredDivider from "./../../../components/ui/CenteredDivider";
export default {
  components: {
    CenteredDivider
  }
};
</script>

<style lang="scss" scoped>
.statistics {
  margin-top: 60px;
}
.points {
  grid-template-columns: repeat(3, 1fr);
  row-gap: 66px;
  margin-top: 100px;
}

.point {
  max-width: 320px;
}

.icon-text {
  margin-top: 20px;
}

.content {
  h2 {
    margin-top: 20px;
  }
}
</style>
