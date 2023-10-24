<template>
  <div class="row">
    <div class="col-9">
      <div class="points grid">
        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">{{ dashboardData.adoptees }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My Adoptees</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="dashboardballs">{{ dashboardData.newAdoptees }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My New Adoptees for this Month</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">{{ dashboardData.lgaImpact }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My LGA Impact</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">
            {{ getFormattedAmount(dashboardData.totalDonation, true) }}
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">My total adoption</h4>
          </div>
        </div>
      </div>

      <hr />

      <div class="points grid">
        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">
            {{ formatRank(dashboardData.currentRank) }}
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">My current ranking on adopter list</h4>
          </div>
        </div>
      </div>
      <hr />
    </div>

    <div class="col-3">
      <!-- <sidebar-ads /> -->
      <ads></ads>
    </div>
  </div>
</template>

<script>
import Ads from '../shared/Ads.vue';
// import SidebarAds from "./../../components/shared/Sidebar_Ads";
export default {
  components: {
    // SidebarAds,
    Ads
  },
  data() {
    return {
     dashboardData: {}
    };
  },
  created() {
    this.getStatistics();
  },
  methods: {
    formatRank(rank) {
      rank = parseInt(rank);
      if (rank <= 0) return "N/A";

      return this.shortenAmount(rank);
    },
    async getStatistics() {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/dashboard/adopter"
        );
        this.dashboardData = data;
      } catch (error) {
        this.handleError(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.monthly-visit {
  border: 0;
}

.title th {
  &::before {
    content: " ";
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: $primary-color;
    color: $primary-color;
    border-radius: 50%;
    border: 6px solid #bddf99;
    margin-right: 15px;
    margin-left: 0px;
  }
}
/* Side Navigation Bar */

.dashboardbody {
  display: flex;
  padding: 10px;
  padding-top: 20px;
  margin: 0;
}

.points {
  grid-template-columns: repeat(4, 1fr);
  row-gap: 5px;
  margin-top: 30px;
}

.point {
  max-width: 280px;
}
</style>
