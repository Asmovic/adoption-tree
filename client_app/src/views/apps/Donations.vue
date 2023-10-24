<template>
  <div class="row">
    <div class="col-md-9">
      <!-- TODO: Revisit after demo -->
      <h4>My Donations</h4>
      <div v-if="donations.length">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Donations</th>
              <th scope="col">Payment ID</th>
              <th scope="col">Date</th>
              <th scope="col">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(donation, key) in donations" :key="key">
              <th scope="row">{{ key + 1 }}</th>
              <td>{{ donation.noOfAdoptees }}</td>
              <td>{{ donation.paymentId }}</td>
              <td>{{ formatDate(donation.startDate) }}</td>
              <td class="text--capitalize">{{ getPaymentType(donation.paymentType) }}</td>
              <td>
                <button type="button" class="btn btn-success btn-sm">
                  View Receipt
                  <i class="fa fa-arrow-right"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else style="width:100%;height:100%">
        <h2 class="icon-text text--primary fw-md mb-0">No Donations made yet.</h2>
      </div>
    </div>

    <div class="col-3">
      <sidebar-ads />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import SidebarAds from "./../../components/shared/Sidebar_Ads";
export default {
  components: {
    SidebarAds
  },
  data() {
    return {
      donations: []
    };
  },
  created() {
    this.getDonationList();
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format("DD/MM/YYYY");
    },
    async getDonationList() {
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + "/adoptions/mine"
        );
        this.donations = data.data;
      } catch (error) {
        this.handleError(error);
      }
    },
    getPaymentType(type) {
      return type.replace(/_/g, " ");
    }
  }
};
</script>

<style lang="scss" scoped>
/* Side Navigation Bar */

.container-body {
  display: flex;
  padding: 10px;
  padding-top: 20px;
  margin: 0;
}

.border-thick {
  border: 1px solid #3a3939;
}
</style>
