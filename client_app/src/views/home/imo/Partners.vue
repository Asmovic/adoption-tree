<template>
  <section class="partners">
    <div class="container mx-auto">
      <centered-divider>
        <h2 class="fw-md">Partners</h2>
      </centered-divider>
      <div class="partner-logos flex justify--center mx-auto">
        <div class="logo">
          <img src="/assets/img/gov-logo-grey.png" alt="IMO State Logo" />
        </div>
        <div class="logo">
          <img src="/assets/img/eu-logo-grey.png" alt="European Union logo" />
        </div>
        <div class="logo">
          <img src="/assets/img/unilever-logo.png" alt="Unilever logo" />
        </div>
        <div class="logo">
          <img src="/assets/img/who-logo-grey.png" alt="WHO logo" />
        </div>
        <div class="logo">
          <img src="/assets/img/nhis-logo.png" alt="NHIS logo" />
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
.partners {
  margin-top: 80px;
}

.partner-logos {
  width: 900px;
  max-width: 100%;
  margin-top: 64px;
}

.logo {
  padding-right: 20px;

  img {
    max-height: 136px;
  }
}
</style>
