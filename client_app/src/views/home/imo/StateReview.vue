<template>
  <section class="state-review">
    <div class="container mx-auto">
      <centered-divider>
        <h2 class="fw-md">State Review</h2>
      </centered-divider>
      <div class="imo-desc grid">
        <img src="/assets/img/imo-state-map.png" alt class="map-area" />
        <div class="description flex flex--column justify--center">
          <h2>Imo State</h2>
          <div class="excerpt">
            <p>
              Imo State is one of the 36 states of Nigeria located in the
              southeast region of the country. The state is rich in natural
              resources like crude oil, natural gas, lead and cash crops like
              oil palm, raffia palm, groundnuts, cotton, melon and maize.
            </p>
            <p>
              It has a total population of 5,542,602 million and a greater
              percentage of the population is engaged in agriculture (ODI,
              2011). The State is divided into twenty seven local government
              areas (LGAs), and three senatorial zones. Imo State covers an area
              of 5,530 square kilometers.
            </p>
            <p>
              The State shares boundaries with Enugu and Ebonyi States to the
              north, Anambra State to the west, Rivers State to the south and in
              the North and Abia State, Cross River and Akwa Ibom States to the
              east.
            </p>
            <p>
              The official language of the state is Igbo alongside English. The
              state is culturally homogeneous as it is a predominantly Igbo
              speaking state with minor differences in dialects.
            </p>
          </div>
          <div class="read-more flex justify--center">
            <more-button text="Read More" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CenteredDivider from "./../../../components/ui/CenteredDivider";
import MoreButton from "./../../../components/ui/MoreButton";

// TODO: Work on Read more buttons

export default {
  components: { MoreButton, CenteredDivider }
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
  background-color: #b2ebf2;
}

.read-more {
  margin-top: 16px;
}
</style>
