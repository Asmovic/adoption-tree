<template>
  <section class="state-review">
    <div class="container mx-auto">
      <centered-divider>
        <h2 class="fw-md">State Review</h2>
      </centered-divider>
      <div class="imo-desc grid">
        <img src="/assets/img/anambra-state-map.png" alt class="map-area" />
        <div class="description flex flex--column justify--center">
          <h2>Anambra State</h2>
          <div class="excerpt">
            <p>
              Anambra is a state in southeastern part of Nigeria. The capital
              and seat of government is Awka. Onitsha, a historic port city from
              pre-colonial times is the largest urban area in the state. The
              state’s theme is “Light of the Nation”, formerly known as the “
              Home for all”. Anambra has 181 towns within it.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CenteredDivider from "./../../components/ui/CenteredDivider";

// TODO: Work on Read more buttons

export default {
  components: { CenteredDivider }
};
</script>

<style lang="scss" scoped>
.state-review {
  margin-top: 100px;
}

.imo-desc {
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
}

.excerpt {
  padding: 24px 28px;
  border-radius: 18px;
  background-color: $primary-color-light;
}

.read-more {
  margin-top: 16px;
}

@media screen and (max-width: 786px) {
  .imo-desc {
    display: flex;
    flex-direction: column;
  }
}
</style>
