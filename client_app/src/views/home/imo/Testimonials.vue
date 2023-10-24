<template>
  <section class="featured-testimonials">
    <div class="container mx-auto">
      <centered-divider>
        <h2 class="fw-md">Featured Testimonials</h2>
      </centered-divider>
      <div class="testimonials mx-auto">
        <div class="testimonial flex">
          <div class="img-container">
            <img src="/assets/img/ydNog9tDAf.png" class="img--rounded" alt />
            <span class="name text--center">
              <h3 class="fw-md mt-0">Ngozi Okafor</h3>
            </span>
          </div>
          <div class="quote flex flex--self-flex-start">
            <div class="left flex flex--items-flex-start">
              <span>“</span>
            </div>
            <div class="text">
              <p>
                I had been battling with a terminal illness for the last 6
                years. It kept getting worse since I couldn’t afford to pay the
                medical bills. I thought all hope was lost until I heard about
                the Anambra State Health Adoption Tree. I am really appreciative
                of this gesture by the Anambra State Government to partner with
                the World Health Organisation, European Union and others. God
                Bless You.
              </p>
            </div>
            <div class="right flex flex--items-flex-end">
              <span>”</span>
            </div>
          </div>
        </div>
        <div class="testimonial flex swapped">
          <div class="img-container">
            <img src="/assets/img/htdrhtytud.png" class="img--rounded" alt />
            <span class="name text--center">
              <h3 class="fw-md mt-0">Nnamdi Okereke</h3>
            </span>
          </div>
          <div class="quote flex flex--self-flex-start">
            <div class="left flex flex--items-flex-start">
              <span>“</span>
            </div>
            <div class="text">
              <p>
                I am an orphan with two siblings to take care of. The health of my
                siblings kept deteriorating due to insufficient funds to take care of them both.
                It brought great joy to our family when we got to know that a sponsor had
                taken over our health insurance. God bless you wherever you are.
              </p>
            </div>
            <div class="right flex flex--items-flex-end">
              <span>”</span>
            </div>
          </div>
        </div>
      </div>
      <div class="load-more flex justify--center">
        <more-button text="See More" />
      </div>
    </div>
  </section>
</template>

<script>
import CenteredDivider from "./../../../components/ui/CenteredDivider";
import MoreButton from "./../../../components/ui/MoreButton";

export default {
  components: { CenteredDivider, MoreButton }
};
</script>

<style lang="scss" scoped>
.featured-testimonials {
  margin-top: 140px;
}

.testimonials {
  width: 800px;
  max-width: 100%;
  padding-top: 80px;
}

.quote {
  padding: 8px;
  background-color: $color-grey--light;
}

.left,
.right {
  font-family: "Raleway", sans-serif;
  font-weight: 600;
  font-size: 120px;
  color: #c7c7c7;
}

.left {
  margin: 4px;
  span {
    line-height: 100px;
  }
}

.right {
  span {
    line-height: 0px;
  }
}

.img-container {
  margin-right: 20px;
  img {
    width: 220px;
    max-width: initial;
    border: 15px solid #eaeaea;
  }
}

.swapped .img-container {
  margin-right: 0;
  margin-left: 20px;
}

.swapped {
  flex-direction: row-reverse;
}
</style>
