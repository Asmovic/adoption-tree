<template>
  <div class="row">
    <div class="col-9">
      <div class="points grid">
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon dashboardballs">{{ dashboardData.adoptees }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My Adoptee</h4>
          </div>
        </div>

        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="dashboardballs">{{ dashboardData.newAdoptees }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My New Adoptees for this Month</h4>
          </div>
        </div>

        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon dashboardballs">{{ dashboardData.lgaImpact }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My LGA Impact</h4>
          </div>
        </div>

        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div
            class="icon dashboardballs"
          >{{ dashboardData.lgaImpact ? dashboardData.lgaImpact : 0 }}</div>
          <div class="content">
            <h4 class="m-0 fw-md">My total donation</h4>
          </div>
        </div>
      </div>

      <hr />

      <div class="points grid">
        <div class="point flex mx-auto flex--column flex--items-center text--center">
          <div class="icon dashboardballs">0</div>
          <div class="content">
            <h4 class="m-0 fw-md">My current ranking on donor list</h4>
          </div>
        </div>
      </div>

      <hr />

      <!-- <div class="grid">
        <h4 class="text-success">
          <b>Hospital visits in this month</b>
        </h4>

        <table class="table-borderless monthly-visit title">
          <tbody>
            <tr>
              <th scope="row">Okafor General Hospital, Aboh Mbaise, Imo State</th>
              <td>
                <button type="button" class="btn text-success btn-link">View Receipt</button>
              </td>
            </tr>
            <tr>
              <th scope="row">Okafor General Hospital, Aboh Mbaise, Imo State</th>
              <td>
                <button type="button" class="btn text-success btn-link">View Receipt</button>
              </td>
            </tr>
            <tr>
              <th scope="row">Okafor General Hospital, Aboh Mbaise, Imo State</th>
              <td>
                <button type="button" class="btn text-success btn-link">View Receipt</button>
              </td>
            </tr>
            <tr>
              <th scope="row">Okafor General Hospital, Aboh Mbaise, Imo State</th>
              <td>
                <button type="button" class="btn text-success btn-link">View Receipt</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>-->
    </div>

    <div class="col-3">
      <img src="/assets/img/dashboard-donor2.png" alt class="donor" />
      <div class="flex grid">
        <div class="adverttext grid">
          <button
            type="button"
            class="btn btn-light button-default get-started-btn align-self-center"
            @click="showGlobalForm('adoption')"
          >Donate Now!</button>
        </div>
        <h5 class="text--center mb-0 adverttext-info">
          Many helpless Anambra State children have being lost because they had
          no health insurance.
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dashboardData: {}
    };
  },
  created() {
    this.getStatistics();
  },
  methods: {
    async getStatistics() {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/dashboard/donor"
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

.adverttext {
  margin: 0;
  padding: 15px;
  min-height: 70px;
  color: #fff;
  border: 1.2px solid #fff;
  background: #69be0f;
}
.adverttext-info {
  color: #fff;
}

.get-started-btn {
  box-shadow: 1px 6px 3px #00000053;
  margin: 0px;
}
</style>
