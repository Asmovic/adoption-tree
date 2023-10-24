<template>
  <div class="jumbo-slider">
    <div id="carousel-container" class="carouselrr sliderr">
      <ol class="carousel-indicators slide-dots">
        <li
          data-target="#carousel-container"
          v-for="(bg, index) in bgImages"
          :data-slide-to="index"
          :class="{ active: index === 0 }"
          :key="index"
          class="dot"
        >
          <div class="inner"></div>
        </li>
      </ol>
      <div class="carousel-inner">
        <div
          class="carousel-item"
          v-for="(bg, index) in bgImages"
          :class="{ active: index === 0 }"
          :key="index"
        >
          <img class="d-block w-100" :src="bg" alt="First slide" />
        </div>
      </div>
      <div class="jumbo-content-container">
        <div class="container mx-auto">
          <section class="flex flex--column flex--items-center">
            <img
              src="/assets/img/anambra-gov-logo.png"
              alt="Imo State Government"
              class="state-logo"
            />
            <h1 class="main-heading text--center text--white">
              ANAMBRA STATE HEALTH INSURANCE ADOPTION TREE
            </h1>
            <h2 class="subheading text--center text--white">
              ADOPT A RESIDENT OF ANAMBRA TODAY!
            </h2>
            <div class="links flex">
              <router-link
                :to="{ name: 'GovernorsAddress' }"
                exact
                tag="button"
                class="button button--lg"
                >Governor’s Address</router-link
              >
              <template v-if="loggedInUser">
                <router-link
                  :to="{ name: 'Adopt', query: { showDialog: true } }"
                  exact
                  tag="button"
                  class="button button--lg"
                  >Adopt Now</router-link
                >
              </template>
              <template v-else>
                <button
                  class="button button--lg button--grey"
                  @click="$store.commit('showGlobalForm', 'login')"
                >
                  Adopt Now
                </button>
              </template>
              <!-- <router-link
                :to="{ name: 'Adopters' }"
                exact
                tag="button"
                class="button button--lg"
              >Our Adopters</router-link>-->
              <template v-if="loggedInUser">
                <button class="button button--lg" @click="handleHealthPlanLink">
                  Buy Health Plan
                </button>
              </template>
              <template v-else>
                <button
                  class="button button--lg button--grey"
                  @click="$store.commit('showGlobalForm', 'login')"
                >
                  Buy Health Plan
                </button>
              </template>
              <!-- <a
                class="button button--lg text--no-decoration"
                href="#statistics"
                >Statistics</a
              > -->
            </div>
          </section>
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#carousel-container"
        role="button"
        data-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a
        class="carousel-control-next"
        href="#carousel-container"
        role="button"
        data-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgImages: [
        "/assets/img/home-slider/_children.jpg",
        "/assets/img/home-slider/_children.jpg"
      ]
    };
  },
  methods: {
    handleHealthPlanLink() {
      if (this.loggedInUser.activeRole !== "ENROLLEE")
        return alert("This is only available for enrollees for now.");

      this.$store.commit("showGlobalForm", "enrollee.adoption");
    }
  },
  mounted() {
    // setTimeout(() => {
    //   //
    //   window.jQuery(".carousel").carousel({
    //     interval: 2000,
    //     pause: false,
    //     ride: "carousel"
    //   });
    // }, 2000);
  }
};
</script>

<style lang="scss" scoped>
.jumbo-slider {
  background-color: grey;
}
.jumbo-content-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 140px;
}
.main-heading {
  font-weight: bold;
  font-size: 74px;
  line-height: 1;
}

.subheading {
  font-size: 46px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 32px;
}

.links {
  margin-bottom: 20px;
  > * {
    margin-right: 24px;

    &:last-child {
      margin-right: 0;
    }
  }
}

#carousel-container {
  position: relative;
}

.slide-dots {
  .dot {
    width: 20px;
    height: 20px;
    border: 3px solid #fff;
    padding: 2px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: transparent;

    &:before,
    &:after {
      content: none;
    }

    &:last-of-type {
      margin-right: 0;
    }
  }

  .inner {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: transparent;
  }

  .active .inner {
    background-color: $primary-color;
  }
}

.state-logo {
  max-width: 150px;
}
</style>
