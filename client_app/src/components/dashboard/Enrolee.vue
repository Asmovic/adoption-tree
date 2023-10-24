<template>
  <div class="row">
    <div class="col-9">
      <div class="row">
        <div class="col-sm-12">
          <template v-if="loggedInUser.biometricId">
            <div class="alert alert-secondary">
              <div class="p-1">
                <span>
                  <strong>Biometric ID: </strong>
                  {{ loggedInUser.biometricId }}
                </span>
                <span class="_space"></span>
                <span>Enrollee ID: {{ anshiaEnrolleeId }}</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="alert alert-danger">
              <div class="p-1">
                Please complete your biometric registration at the {{ agency }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="points grid">
        <div
          class="point flex mx-auto flex--column flex--items-center text--center"
        >
          <div class="dashboardballs">
            <span :class="{ danger: (dashboardData.weeksLeft || 0) < 0 }">{{
              Math.max(dashboardData.weeksLeft || 0, 0)
            }}</span>
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">Weeks Left on Plan</h4>
          </div>
        </div>
        <div
          class="point flex mx-auto flex--column flex--items-center text--center"
        >
          <div class="icon dashboardballs">
            <span :class="{ danger: (dashboardData.daysLeft || 0) < 0 }">{{
              Math.max(dashboardData.daysLeft || 0, 0)
            }}</span>
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">Days left for your health plan</h4>
          </div>
        </div>
        <div
          class="point flex mx-auto flex--column flex--items-center text--center"
        >
          <div class="icon dashboardballs">
            {{ dashboardData.hospitalVisits || 0 }}
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">Number of Hospital Visits this Month</h4>
          </div>
        </div>

        <hr />
      </div>
      <hr />

      <div
        class="points grid"
        v-if="donorDashboardData && donorDashboardData.adoptees > 0"
      >
        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">
            {{ donorDashboardData.adoptees }}
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">My Adoptees</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="dashboardballs">{{ donorDashboardData.newAdoptees }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My New Adoptees for this Month</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">
            {{ donorDashboardData.lgaImpact }}
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">My LGA Impact</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">
            {{ getFormattedAmount(donorDashboardData.totalDonation, true) }}
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">My total adoption</h4>
          </div>
        </div>
      </div>

      <!-- <div class="points grid">
        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">{{ dashboardData2.adoptees }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My Adoptees</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="dashboardballs">{{ dashboardData2.newAdoptees }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My New Adoptees for this Month</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">{{ dashboardData2.lgaImpact }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My LGA Impact</h4>
          </div>
        </div>

        <div class="point flex flex--column flex--items-center text--center">
          <div class="icon dashboardballs">
            {{ getFormattedAmount(dashboardData2.totalAdoption, true) }}
          </div>
          <div class="content">
            <h4 class="m-0 fw-md">My total adoption</h4>
          </div>
        </div>
      </div> -->

      <div class="grid">
        <h4 class="text-success mt-4 mb-4">
          <b>Hospital visits in this month</b>
        </h4>
        <template v-if="loggedInUser">
          <vue-table
            ref="vuetable"
            :api-url="`/patients/${loggedInUser.id}/checkins`"
            :fields="fields"
            :detail-row-component="detailRowComponent"
            detail-row-field="note"
            no-data-template="<h4 class='icon-text text--primary fw-md mb-0'>No Hospital Visit made yet.</h4>"
          >
            <template slot="sn" slot-scope="props">{{
              props.rowIndex + 1
            }}</template>
            <template slot="action" slot-scope="props">
              <button
                class="btn btn-sm btn-info"
                @click="toggleNote(props.rowData.id)"
              >
                {{ getNoteButtonText(props.rowData.id) }}
              </button>
            </template>
          </vue-table>
        </template>
      </div>
    </div>
    <div class="col-3">
      <!-- <sidebar-ads /> -->
      <ads></ads>
    </div>
  </div>
</template>

<script>
import Ads from '../shared/Ads.vue';
// import SideBar from '../shared/SideBar.vue';
// import SidebarAds from "./../../components/shared/Sidebar_Ads";

import DetailRowComponent from "./../ui/rowComponents/BasicRowComponent";
export default {
  components: {
    Ads
    // SideBar
    // SidebarAds
  },
  computed: {
    agency() {
      return this.orgs[this.$store.getters.stateId];
    },
    enrolleeId() {
      return this.loggedInUser.enrolleeId.padStart(8, 0);
    },
    anshiaEnrolleeId() {
      return this.loggedInUser.AshiaEnrolleeId;
    }
  },
  data() {
    return {
      dashboardData: {},
      donorDashboardData: {},
      expandedNotes: {},
      detailRowComponent: DetailRowComponent,
      fields: [
        {
          name: "sn",
          title: "#"
        },
        {
          formatter: date => this.$dayjs(date).format("DD/MM/YYYY"),
          name: "createdAt",
          title: "Date"
        },
        {
          name: "action",
          title: "Action"
        }
      ],
      orgs: {
        1: "Imo State Health Insurance Agency",
        5: "Anambra State Health Insurance Agency"
      }
    };
  },
  created() {
    this.getStatistics();
    this.getStatistics2();
  },
  methods: {
    getNoteButtonText(id) {
      const expanded = this.expandedNotes[id];
      return expanded === true ? "Hide note" : "View note";
    },
    async getStatistics() {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/dashboard/adoptee"
        );
        this.dashboardData = data;
      } catch (error) {
        this.handleError(error);
      }
    },
    async getStatistics2() {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/dashboard/adopter"
        );
        this.donorDashboardData = data;
      } catch (error) {
        this.handleError(error);
      }
    },
    toggleNote(rowId) {
      this.$refs.vuetable.toggleDetailRow(rowId);
      const expanded = this.expandedNotes[rowId] || false;
      this.expandedNotes[rowId] = !expanded;
    }
  }
};
</script>

<style lang="scss" scoped>
.monthly-visit {
  border: 0;
}

.danger {
  color: red;
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

.dashboardballs:hover {
  font-size: 2.5em;
  border: 2px solid #70c11a;
  opacity: 1;
}

.dashboardballs {
  margin: 20px;
  border-radius: 50%;
  opacity: 0.7;
  height: 125px;
  padding: 10px;
  background: transparent linear-gradient(320deg, #f8f8f8 0%, #f5fffd 100%) 0%
    0% no-repeat padding-box;
  border: 1px solid #70c11a;
  line-height: 100px;
  color: 000;
  font-weight: bold;
  font-size: 2em;
  text-align: center;
  flex-direction: column;
  width: 125px;
  box-shadow: 0px 0px 0px 8px #e7ebea;

  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    margin-right: 0;
  }
}
</style>