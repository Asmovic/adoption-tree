<template>
  <section class="statistics" id="statistics">
    <div class="container mx-auto">
      <centered-divider>
        <h2 class="fw-md">Statistics</h2>
      </centered-divider>
      <div class="points grid">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="point flex mx-auto flex--column flex--items-center text--center"
        >
          <template v-if="stat.isActive">
            <div class="icon" v-html="stat.icon"></div>
            <h3 class="icon-text text--primary fw-md mb-0">
              {{ stat.title }}
            </h3>
            <div class="content">
              <h2 class="mb-0">{{ stat.value }}</h2>
            </div>
          </template>
        </div>
      </div>
    </div>
    <stretch-loader :show="showLoader" />
  </section>
</template>

<script>
import CenteredDivider from "./../../components/ui/CenteredDivider";
export default {
  components: {
    CenteredDivider
  },
  created() {
    this.getStats();
  },
  data() {
    return {
      showLoader: false,
      stats: []
    };
  },
  methods: {
    async getStats() {
      this.showLoader = true;
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/vision-board?perPage=50"
        );
        this.stats = data.data;
        console.log(data);
      } catch (error) {
        this.showGlobalAlert("An error occured", "error");
        this.handleError(error);
      }

      this.showLoader = false;
    }
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
