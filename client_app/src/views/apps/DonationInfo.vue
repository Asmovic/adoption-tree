<template>
  <div class="row">
    <div class="col-md-9">
      <donation-details v-if="adoptionData" :data="adoptionData">
        <template slot="close">
          <button
            class="button button--striped"
            type="button"
            @click="$router.go(-1)"
          >
            Closes
          </button>
        </template>
      </donation-details>
    </div>
    <div class="col-3">
      <sidebar-ads />
    </div>
  </div>
</template>

<script>
import SidebarAds from "./../../components/shared/Sidebar_Ads";
import DonationDetails from "./../../components/ui/DonationDetails";
export default {
  components: {
    DonationDetails,
    SidebarAds
  },
  created() {
    this.getAdoptionInfo();
  },
  data() {
    return {
      adoptionData: null
    };
  },
  methods: {
    async getAdoptionInfo() {
      this.showGlobalPageLoader(true);
      try {
        const { data } = await this.$axios.get(
          this.apiBaseUrl + `/adoptions/donor/${this.$route.params.id}`
        );
        this.adoptionData = data;
      } catch (error) {
        this.handleError(error);
      }
      this.showGlobalPageLoader(false);
    }
  }
};
</script>